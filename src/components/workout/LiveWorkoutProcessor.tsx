import React, { useRef, useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Square, CheckCircle2, XCircle } from "lucide-react";
import { Pose, POSE_CONNECTIONS, NormalizedLandmark, Results } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Camera } from "@mediapipe/camera_utils";
import {
  PushupState,
  initPushupState,
  pushupFrameAnalysis,
  PullupState,
  initPullupState,
  pullupFrameAnalysis,
  SitupState,
  initSitupState,
  situpFrameAnalysis,
  VerticalJumpState,
  initVerticalJumpState,
  verticalJumpFrameAnalysis,
  ShuttleState,
  initShuttleState,
  shuttleFrameAnalysis,
  SitReachState,
  initSitReachState,
  sitReachFrameAnalysis,
  summarizePushups,
  summarizePullups,
  summarizeSitups,
  summarizeVerticalJump,
  summarizeShuttle,
  summarizeSitReach,
  RepRow,
  VerticalJumpRow,
  Landmark,
} from "@/lib/metrics";

export type ProcessingResult = {
  type: "good" | "bad";
  posture: "Good" | "Bad";
  setsCompleted: number;
  badSets: number;
  duration: string;
  videoUrl: string;
  message: string;
  [k: string]: string | number | boolean;
};

type Props = {
  activityKey: string;
  onBack: () => void;
  onFinish: (res: ProcessingResult) => void;
};

type ActivityState = PushupState | PullupState | SitupState | VerticalJumpState | ShuttleState | SitReachState;

type FeedbackMessage = {
  text: string;
  type: "good" | "bad" | "neutral";
  timestamp: number;
};

const LiveWorkoutProcessor: React.FC<Props> = ({ activityKey, onBack, onFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const stateRef = useRef<ActivityState | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const lastRepCountRef = useRef<number>(0);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>({
    text: "Get ready...",
    type: "neutral",
    timestamp: Date.now(),
  });
  const [sessionDuration, setSessionDuration] = useState(0);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const updateFeedback = useCallback((text: string, type: "good" | "bad" | "neutral") => {
    setFeedbackMessage({ text, type, timestamp: Date.now() });
  }, []);

  const getRepFeedback = useCallback((activityKey: string, rep: RepRow | VerticalJumpRow | null): { text: string; type: "good" | "bad" } => {
    if (!rep) return { text: "", type: "neutral" };

    switch (activityKey) {
      case "pushups": {
        const pushupRep = rep as RepRow;
        if (pushupRep.correct) {
          const messages = ["Good rep!", "Perfect form!", "Keep it up!", "Excellent!", "Nice push-up!"];
          return { text: messages[Math.floor(Math.random() * messages.length)], type: "good" };
        } else {
          const messages = ["Go lower!", "Keep your back straight!", "Full range of motion!", "Deeper!"];
          return { text: messages[Math.floor(Math.random() * messages.length)], type: "bad" };
        }
      }
      case "pullups": {
        return { text: "Great pull-up!", type: "good" };
      }
      case "situps": {
        return { text: "Good sit-up!", type: "good" };
      }
      case "verticaljump": {
        const jumpRep = rep as VerticalJumpRow;
        if (jumpRep.jump_height_px > 50) {
          return { text: "Nice jump!", type: "good" };
        } else {
          return { text: "Jump higher!", type: "bad" };
        }
      }
      default:
        return { text: "Keep going!", type: "good" };
    }
  }, []);

  const onPoseResults = useCallback((results: Results) => {
    const canvasEl = canvasRef.current;
    const ctx = canvasEl?.getContext("2d");
    if (!ctx || !canvasEl || !results.image) return;

    canvasEl.width = (results.image as HTMLVideoElement).videoWidth || 640;
    canvasEl.height = (results.image as HTMLVideoElement).videoHeight || 480;

    ctx.save();
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.drawImage(results.image, 0, 0, canvasEl.width, canvasEl.height);

    if (results.poseLandmarks && stateRef.current) {
      drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 4,
      });
      drawLandmarks(ctx, results.poseLandmarks, {
        color: "#FF0000",
        radius: 6,
      });

      const t = (Date.now() - startTimeRef.current) / 1000;
      let newRep: RepRow | VerticalJumpRow | null = null;

      switch (activityKey) {
        case "pushups":
          newRep = pushupFrameAnalysis(results.poseLandmarks, canvasEl.width, canvasEl.height, t, stateRef.current as PushupState);
          break;
        case "pullups":
          newRep = pullupFrameAnalysis(results.poseLandmarks, canvasEl.width, canvasEl.height, t, stateRef.current as PullupState);
          break;
        case "situps":
          newRep = situpFrameAnalysis(results.poseLandmarks, canvasEl.width, canvasEl.height, t, stateRef.current as SitupState);
          break;
        case "verticaljump":
          newRep = verticalJumpFrameAnalysis(results.poseLandmarks, canvasEl.width, canvasEl.height, t, stateRef.current as VerticalJumpState);
          break;
        case "shuttlerun":
          shuttleFrameAnalysis(results.poseLandmarks, canvasEl.width, canvasEl.height, t, stateRef.current as ShuttleState);
          break;
        case "sitreach":
          sitReachFrameAnalysis(results.poseLandmarks, canvasEl.width, canvasEl.height, t, stateRef.current as SitReachState);
          break;
      }

      if (newRep) {
        const currentCount = (newRep as RepRow).count || lastRepCountRef.current + 1;
        if (currentCount > lastRepCountRef.current) {
          lastRepCountRef.current = currentCount;
          setRepCount(currentCount);

          const feedback = getRepFeedback(activityKey, newRep);
          updateFeedback(feedback.text, feedback.type);
          speak(feedback.text);
        }
      }

      if (activityKey === "shuttlerun") {
        const shuttleState = stateRef.current as ShuttleState;
        setRepCount(shuttleState.runCount);
        if (shuttleState.status !== feedbackMessage.text) {
          updateFeedback(shuttleState.status, "neutral");
        }
      }

      if (activityKey === "verticaljump") {
        const jumpState = stateRef.current as VerticalJumpState;
        setRepCount(jumpState.jumpCount);
      }
    }

    ctx.restore();
  }, [activityKey, feedbackMessage.text, getRepFeedback, speak, updateFeedback]);

  useEffect(() => {
    const initPose = async () => {
      const pose = new Pose({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults(onPoseResults);
      poseRef.current = pose;

      switch (activityKey) {
        case "pushups":
          stateRef.current = initPushupState(30);
          break;
        case "pullups":
          stateRef.current = initPullupState(30);
          break;
        case "situps":
          stateRef.current = initSitupState(30);
          break;
        case "verticaljump":
          stateRef.current = initVerticalJumpState(30);
          break;
        case "shuttlerun":
          stateRef.current = initShuttleState(30);
          break;
        case "sitreach":
          stateRef.current = initSitReachState(30);
          break;
      }
    };

    initPose();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (poseRef.current) {
        poseRef.current.close();
      }
      window.speechSynthesis.cancel();
    };
  }, [activityKey, onPoseResults]);

  useEffect(() => {
    const startCamera = async () => {
      if (videoRef.current && poseRef.current) {
        try {
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current && poseRef.current) {
                await poseRef.current.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480,
          });
          await camera.start();
          cameraRef.current = camera;
          setIsActive(true);
          startTimeRef.current = Date.now();
          speak("Ready! Start your workout.");
        } catch (error) {
          console.error("Camera error:", error);
          updateFeedback("Camera access denied", "bad");
        }
      }
    };

    startCamera();
  }, [speak, updateFeedback]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleStop = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    window.speechSynthesis.cancel();
    setIsActive(false);

    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    let summary: Record<string, number | string | boolean> = {};

    switch (activityKey) {
      case "pushups":
        summary = summarizePushups((stateRef.current as PushupState).reps);
        break;
      case "pullups":
        summary = summarizePullups((stateRef.current as PullupState).reps);
        break;
      case "situps":
        summary = summarizeSitups((stateRef.current as SitupState).reps);
        break;
      case "verticaljump":
        summary = summarizeVerticalJump((stateRef.current as VerticalJumpState).jumpData);
        break;
      case "shuttlerun":
        summary = summarizeShuttle(stateRef.current as ShuttleState);
        break;
      case "sitreach":
        summary = summarizeSitReach(stateRef.current as SitReachState);
        break;
    }

    const setsCompleted = Number(summary.count ?? summary.runs ?? repCount);
    const badSets = Number(summary.badReps ?? 0);
    const posture: "Good" | "Bad" = badSets > 0 ? "Bad" : "Good";

    const result: ProcessingResult = {
      type: posture === "Good" ? "good" : "bad",
      posture,
      setsCompleted,
      badSets,
      duration: `${duration}s`,
      videoUrl: "",
      message: "Live workout complete!",
      ...summary,
    };

    onFinish(result);
  }, [activityKey, repCount, onFinish]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          className="hidden"
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="bg-black/50 border-white/20 text-white hover:bg-black/70"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="bg-black/70 text-white px-4 py-2 rounded-lg">
            <div className="text-2xl font-mono font-bold">{formatTime(sessionDuration)}</div>
          </div>
        </div>

        <div className="absolute top-20 left-4 right-4 z-10">
          <Card className="bg-black/70 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">Rep Count</span>
                <Badge variant="secondary" className="text-2xl font-bold px-4 py-2">
                  {repCount}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                {feedbackMessage.type === "good" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {feedbackMessage.type === "bad" && <XCircle className="w-5 h-5 text-red-500" />}
                <span
                  className={`text-sm font-medium ${
                    feedbackMessage.type === "good"
                      ? "text-green-400"
                      : feedbackMessage.type === "bad"
                      ? "text-red-400"
                      : "text-white"
                  }`}
                >
                  {feedbackMessage.text}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="absolute bottom-24 left-4 right-4 z-10">
          <div className="bg-black/70 text-white p-3 rounded-lg text-center">
            <p className="text-xs opacity-80">Keep full body in frame • Maintain good form</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-black">
        <Button
          size="lg"
          onClick={handleStop}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          <Square className="w-5 h-5 mr-2" />
          Stop Workout
        </Button>
      </div>
    </div>
  );
};

export default LiveWorkoutProcessor;
