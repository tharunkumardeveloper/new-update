import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause } from "lucide-react";
import { Pose, POSE_CONNECTIONS, NormalizedLandmark } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
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
  videoSrc: string;
  activityKey: string;
  onFinish: (res: ProcessingResult) => void;
};

type ActivityState = PushupState | PullupState | SitupState | VerticalJumpState | ShuttleState | SitReachState;

const VideoProcessor: React.FC<Props> = ({ videoSrc, activityKey, onFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const stateRef = useRef<ActivityState | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const processingRef = useRef<boolean>(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);

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
      if (poseRef.current) {
        poseRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activityKey]);

  const drawFrame = (landmarks?: NormalizedLandmark[]) => {
    const canvasEl = canvasRef.current;
    const videoEl = videoRef.current;
    const ctx = canvasEl?.getContext("2d");

    if (!ctx || !canvasEl || !videoEl) return;

    canvasEl.width = videoEl.videoWidth || 640;
    canvasEl.height = videoEl.videoHeight || 480;

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

    if (landmarks && showAnnotations) {
      drawConnectors(ctx, landmarks, POSE_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 4,
      });
      drawLandmarks(ctx, landmarks, {
        color: "#FF0000",
        radius: 6,
      });
    }
  };

  const processVideo = async () => {
    const videoEl = videoRef.current;
    const pose = poseRef.current;

    if (!videoEl || !pose || !stateRef.current) return;

    setIsProcessing(true);
    processingRef.current = true;
    videoEl.currentTime = 0;

    const fps = 30;
    const frameInterval = 1 / fps;
    const totalFrames = Math.floor(videoEl.duration * fps);

    for (let frameNum = 0; frameNum < totalFrames && processingRef.current; frameNum++) {
      videoEl.currentTime = frameNum * frameInterval;

      await new Promise<void>((resolve) => {
        const onSeeked = async () => {
          videoEl.removeEventListener("seeked", onSeeked);

          const canvasEl = canvasRef.current;
          if (!canvasEl) {
            resolve();
            return;
          }

          const ctx = canvasEl.getContext("2d");
          if (!ctx) {
            resolve();
            return;
          }

          canvasEl.width = videoEl.videoWidth;
          canvasEl.height = videoEl.videoHeight;
          ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

          try {
            await pose.send({ image: canvasEl });

            const results = (pose as {results?: {poseLandmarks?: NormalizedLandmark[]}}).results;
            const landmarks = results?.poseLandmarks;

            if (landmarks && stateRef.current) {
              const t = videoEl.currentTime;

              switch (activityKey) {
                case "pushups":
                  pushupFrameAnalysis(landmarks, canvasEl.width, canvasEl.height, t, stateRef.current as PushupState);
                  break;
                case "pullups":
                  pullupFrameAnalysis(landmarks, canvasEl.width, canvasEl.height, t, stateRef.current as PullupState);
                  break;
                case "situps":
                  situpFrameAnalysis(landmarks, canvasEl.width, canvasEl.height, t, stateRef.current as SitupState);
                  break;
                case "verticaljump":
                  verticalJumpFrameAnalysis(landmarks, canvasEl.width, canvasEl.height, t, stateRef.current as VerticalJumpState);
                  break;
                case "shuttlerun":
                  shuttleFrameAnalysis(landmarks, canvasEl.width, canvasEl.height, t, stateRef.current as ShuttleState);
                  break;
                case "sitreach":
                  sitReachFrameAnalysis(landmarks, canvasEl.width, canvasEl.height, t, stateRef.current as SitReachState);
                  break;
              }

              drawFrame(landmarks);
            }
          } catch (error) {
            console.error("Frame processing error:", error);
          }

          setProgress(Math.floor((frameNum / totalFrames) * 100));
          resolve();
        };

        videoEl.addEventListener("seeked", onSeeked);
      });
    }

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

    const setsCompleted = Number(summary.count ?? summary.runs ?? 0);
    const badSets = Number(summary.badReps ?? 0);
    const posture: "Good" | "Bad" = badSets > 0 ? "Bad" : "Good";

    const processedResult: ProcessingResult = {
      type: posture === "Good" ? "good" : "bad",
      posture,
      setsCompleted,
      badSets,
      duration: `${Math.round(videoEl.duration)}s`,
      videoUrl: videoSrc,
      message: "Video analysis complete!",
      ...summary,
    };

    setResult(processedResult);
    setIsProcessing(false);
    processingRef.current = false;
    setProgress(100);
    videoEl.currentTime = 0;
  };

  const handlePlayPause = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.play();
      setIsPlaying(true);
      startAnnotationLoop();
    } else {
      videoEl.pause();
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const startAnnotationLoop = async () => {
    const videoEl = videoRef.current;
    const pose = poseRef.current;

    if (!videoEl || !pose) return;

    const processFrame = async () => {
      if (!videoEl.paused && !videoEl.ended) {
        const canvasEl = canvasRef.current;
        if (canvasEl) {
          try {
            await pose.send({ image: videoEl });
            const results = (pose as {results?: {poseLandmarks?: NormalizedLandmark[]}}).results;
            drawFrame(results?.poseLandmarks);
          } catch (error) {
            console.error("Annotation error:", error);
          }
        }
        animationFrameRef.current = requestAnimationFrame(processFrame);
      }
    };

    processFrame();
  };

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleEnded = () => {
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    videoEl.addEventListener("ended", handleEnded);

    return () => {
      videoEl.removeEventListener("ended", handleEnded);
    };
  }, []);

  const renderSummaryField = (key: string, value: string | number | boolean) => {
    const labels: Record<string, string> = {
      count: "Total Reps",
      goodReps: "Good Reps",
      badReps: "Bad Reps",
      avgElbowAngle: "Avg Elbow Angle",
      avgRepDurationSec: "Avg Rep Duration",
      avgDipDuration: "Avg Dip Duration",
      avgAngleChange: "Avg Angle Change",
      maxHeightCm: "Max Jump Height (cm)",
      avgAirTimeSec: "Avg Air Time (s)",
      runs: "Runs Completed",
      distanceM: "Distance (m)",
      maxReachM: "Max Reach (m)",
      timeOfMax: "Time of Max (s)",
    };

    return (
      <div key={key} className="flex justify-between py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-600">{labels[key] || key}</span>
        <span className="text-sm font-bold text-gray-900">{String(value)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {!result ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Video Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    className="w-full"
                    preload="auto"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing video...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}

                <Button
                  onClick={processVideo}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? "Processing..." : "Analyze Video"}
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Annotated Video Playback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    className="w-full"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Button onClick={handlePlayPause} variant="outline" size="sm">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => setShowAnnotations(!showAnnotations)}
                    variant="outline"
                    size="sm"
                  >
                    {showAnnotations ? "Hide" : "Show"} Annotations
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Workout Results</CardTitle>
                  <Badge variant={result.posture === "Good" ? "default" : "destructive"}>
                    {result.posture} Posture
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {renderSummaryField("setsCompleted", result.setsCompleted)}
                  {result.badSets > 0 && renderSummaryField("badSets", result.badSets)}
                  {renderSummaryField("duration", result.duration)}

                  {Object.entries(result).map(([key, val]) => {
                    if (
                      ["type", "posture", "setsCompleted", "badSets", "duration", "videoUrl", "message"].includes(key)
                    ) {
                      return null;
                    }
                    return renderSummaryField(key, val);
                  })}
                </div>

                <Button
                  onClick={() => onFinish(result)}
                  className="w-full mt-6"
                  size="lg"
                >
                  Complete Workout
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoProcessor;
