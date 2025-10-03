import React, { useRef, useState, useEffect } from "react";

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

const VideoProcessor: React.FC<Props> = ({ videoSrc, activityKey, onFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Mediapipe.Pose | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  /* ---------------- INIT POSE ---------------- */
  useEffect(() => {
    const pose = new Pose({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((res: Mediapipe.PoseResults) => {
      drawPose(res);
    });

    poseRef.current = pose;

    return () => {
      poseRef.current?.close();
    };
  }, []);

  /* ---------------- DRAW ---------------- */
  function drawPose(res: Mediapipe.PoseResults) {
    const canvasEl = canvasRef.current;
    const ctx = canvasEl?.getContext("2d");
    const videoEl = videoRef.current;
    if (!ctx || !canvasEl || !videoEl || !res.image) return;

    canvasEl.width = videoEl.videoWidth;
    canvasEl.height = videoEl.videoHeight;

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.drawImage(res.image, 0, 0, canvasEl.width, canvasEl.height);

    if (res.poseLandmarks) {
      drawConnectors(ctx, res.poseLandmarks, POSE_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 2,
      });
      drawLandmarks(ctx, res.poseLandmarks, {
        color: "#FF0000",
        lineWidth: 1,
      });
    }
  }

  /* ---------------- PROCESS ---------------- */
  async function processVideo() {
    setIsProcessing(true);

    const videoEl = videoRef.current;
    const pose = poseRef.current;
    if (!videoEl || !pose) return;

    let activityState:
      | PushupState
      | PullupState
      | SitupState
      | VerticalJumpState
      | ShuttleState
      | SitReachState;

    switch (activityKey) {
      case "pushups": activityState = initPushupState(); break;
      case "pullups": activityState = initPullupState(); break;
      case "situps": activityState = initSitupState(); break;
      case "verticaljump": activityState = initVerticalJumpState(); break;
      case "shuttlerun": activityState = initShuttleState(); break;
      case "sitreach": activityState = initSitReachState(); break;
      default: throw new Error("Unknown activity");
    }

    const durationStr = `${Math.round(videoEl.duration)}s`;

    const hiddenCanvas = document.createElement("canvas");
    const hiddenCtx = hiddenCanvas.getContext("2d");
    if (!hiddenCtx) return;

    hiddenCanvas.width = videoEl.videoWidth;
    hiddenCanvas.height = videoEl.videoHeight;

    while (videoEl.currentTime < videoEl.duration) {
      hiddenCtx.drawImage(videoEl, 0, 0, videoEl.videoWidth, videoEl.videoHeight);
      await pose.send({ image: hiddenCanvas });

      const landmarks = pose.results?.poseLandmarks;
      if (landmarks) {
        const t = videoEl.currentTime;
        switch (activityKey) {
          case "pushups": pushupFrameAnalysis(landmarks, videoEl.videoWidth, videoEl.videoHeight, t, activityState as PushupState); break;
          case "pullups": pullupFrameAnalysis(landmarks, videoEl.videoWidth, videoEl.videoHeight, t, activityState as PullupState); break;
          case "situps": situpFrameAnalysis(landmarks, videoEl.videoWidth, videoEl.videoHeight, t, activityState as SitupState); break;
          case "verticaljump": verticalJumpFrameAnalysis(landmarks, videoEl.videoWidth, videoEl.videoHeight, t, activityState as VerticalJumpState); break;
          case "shuttlerun": shuttleFrameAnalysis(landmarks, videoEl.videoWidth, videoEl.videoHeight, t, activityState as ShuttleState); break;
          case "sitreach": sitReachFrameAnalysis(landmarks, videoEl.videoWidth, videoEl.videoHeight, t, activityState as SitReachState); break;
        }
      }
      videoEl.currentTime += 1 / 30;
    }

    let summary: Record<string, number | string | boolean> = {};
    switch (activityKey) {
      case "pushups": summary = summarizePushups((activityState as PushupState).reps); break;
      case "pullups": summary = summarizePullups((activityState as PullupState).reps); break;
      case "situps": summary = summarizeSitups((activityState as SitupState).reps); break;
      case "verticaljump": summary = summarizeVerticalJump((activityState as VerticalJumpState).jumpData); break;
      case "shuttlerun": summary = summarizeShuttle(activityState as ShuttleState); break;
      case "sitreach": summary = summarizeSitReach(activityState as SitReachState); break;
    }

    const setsCompleted =
      Number(summary["count"] ?? summary["jumpCount"] ?? summary["runs"] ?? 0);
    const badSets = Number(summary["badReps"] ?? 0);
    const posture: "Good" | "Bad" = badSets > 0 ? "Bad" : "Good";

    const processedResult: ProcessingResult = {
      type: posture === "Good" ? "good" : "bad",
      posture,
      setsCompleted,
      badSets,
      duration: durationStr,
      videoUrl: videoSrc,
      message: "Workout summary ready",
      ...summary,
    };

    setResult(processedResult);
    onFinish(processedResult);
    setIsProcessing(false);
  }

  return (
    <div className="p-4">
      <video ref={videoRef} src={videoSrc} controls className="rounded-xl mb-2" />
      <canvas ref={canvasRef} className="w-full border rounded-xl" />

      <button
        onClick={processVideo}
        disabled={isProcessing}
        className="px-4 py-2 bg-purple-600 text-white rounded-xl mt-3"
      >
        {isProcessing ? "Processing..." : "Process Video"}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Results</h3>
          <p>Posture: {result.posture}</p>
          <p>Sets/Count: {result.setsCompleted}</p>
          {result.badSets !== undefined && <p>Bad Reps: {result.badSets}</p>}
          <p>Duration: {result.duration}</p>
          {Object.entries(result).map(([key, val]) => {
            if (
              ["type", "posture", "setsCompleted", "badSets", "duration", "videoUrl", "message"].includes(key)
            ) return null;
            return <p key={key}>{key}: {String(val)}</p>;
          })}
        </div>
      )}
    </div>
  );
};

export default VideoProcessor;
