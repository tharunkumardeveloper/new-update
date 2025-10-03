// src/components/WorkoutInterface.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Camera,
  Upload,
  Play,
  Pause,
  Square,
  Download,
  Award,
  RefreshCw,
} from "lucide-react";
import WorkoutUploadScreen from "./WorkoutUploadScreen";
import VideoProcessor from "./VideoProcessor";

/**
 * Typed shapes so we avoid `any`
 */
type Activity = {
  name: string;
  rating: number;
  muscles: string;
};

interface WorkoutInterfaceProps {
  activity: Activity;
  onBack: () => void;
}

/** result shape emitted by VideoProcessor (keeps flexible but typed) */
type ProcessingResultFromVideo = {
  type: "good" | "bad";
  posture?: "Good" | "Bad";
  setsCompleted?: number | string;
  badSets?: number | string;
  duration?: string;
  videoUrl?: string;
  message?: string;
  badgesEarned?: string[];
  coinsEarned?: number;
  // extra summary fields from metrics (e.g., avgElbowAngle, maxHeightPx)
  [k: string]: string | number | boolean | string[] | undefined;
};

/** persistent history item stored in localStorage */
export type WorkoutHistoryItem = {
  id: number;
  activityName: string;
  posture?: "Good" | "Bad";
  setsCompleted: number;
  badSets: number;
  duration?: string;
  timestamp: string;
  videoUrl?: string;
  badgesEarned?: string[];
  coinsEarned?: number;
  // allow extra summary fields
  [k: string]: string | number | boolean | string[] | undefined;
};

const supportedActivities = [
  "Push-ups",
  "Pull-ups",
  "Sit-ups",
  "Vertical Jump",
  "Shuttle Run",
  "Sit & Reach",
];

function normalizeActivityKey(name: string): string {
  // maps display name to the activityKey expected by VideoProcessor
  const key = name.toLowerCase().replace(/\s+/g, "");
  if (key.includes("push")) return "pushups";
  if (key.includes("pull")) return "pullups";
  if (key.includes("sit") && key.includes("reach")) return "s itreach".replace(" ", ""); // not used usually
  if (key.includes("sit") && key.includes("up")) return "situps";
  if (key.includes("vertical")) return "verticaljump";
  if (key.includes("shuttle")) return "shuttlerun";
  if (key.includes("sitreach") || key.includes("sit&reach") || name.toLowerCase().includes("sit & reach")) return "sitreach";
  // fallback
  return key;
}

const WorkoutInterface: React.FC<WorkoutInterfaceProps> = ({ activity, onBack }) => {
  const [stage, setStage] = useState<"upload" | "processing" | "complete">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const isSupported = supportedActivities.includes(activity.name);

  useEffect(() => {
    // cleanup object URL when component unmounts or file changes
    return () => {
      if (videoSrc) {
        try {
          URL.revokeObjectURL(videoSrc);
        } catch {
          /* ignore */
        }
      }
    };
  }, [videoSrc]);

  const handleVideoSelected = (file: File) => {
    // revoke previous URL
    if (videoSrc) {
      try {
        URL.revokeObjectURL(videoSrc);
      } catch {
        /* ignore */
      }
    }
    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setVideoSrc(url);
    setStage("processing");
  };

  const handleRetry = () => {
    if (videoSrc) {
      try {
        URL.revokeObjectURL(videoSrc);
      } catch {
        /* ignore */
      }
    }
    setSelectedFile(null);
    setVideoSrc(null);
    setStage("upload");
  };

  const handleWorkoutComplete = (res: ProcessingResultFromVideo) => {
    // build typed workout item
    const workout: WorkoutHistoryItem = {
      id: Date.now(),
      activityName: activity.name,
      posture: (res.posture as "Good" | "Bad") ?? (res.badSets && Number(res.badSets) > 0 ? "Bad" : "Good"),
      setsCompleted: Number(res.setsCompleted ?? 0),
      badSets: Number(res.badSets ?? 0),
      duration: String(res.duration ?? ""),
      timestamp: new Date().toISOString(),
      videoUrl: res.videoUrl ? String(res.videoUrl) : videoSrc ?? undefined,
      badgesEarned: Array.isArray(res.badgesEarned) ? res.badgesEarned : undefined,
      coinsEarned: typeof res.coinsEarned === "number" ? res.coinsEarned : (res.type === "good" ? 50 : 25),
      // copy other summary fields (avgElbowAngle, maxHeightPx, etc.)
      ...Object.fromEntries(
        Object.entries(res).filter(
          ([k]) =>
            ![
              "type",
              "posture",
              "setsCompleted",
              "badSets",
              "duration",
              "videoUrl",
              "message",
              "badgesEarned",
              "coinsEarned",
            ].includes(k)
        )
      ),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("workout_history") || "[]") as WorkoutHistoryItem[];
      existing.push(workout);
      localStorage.setItem("workout_history", JSON.stringify(existing));
    } catch (err) {
      // if localStorage parse fails, reset it safely
      const fallback: WorkoutHistoryItem[] = [workout];
      localStorage.setItem("workout_history", JSON.stringify(fallback));
    }

    // Option: show a brief confirmation by moving to complete stage, then navigate back
    setStage("complete");

    // revoke object URL now that we've stored the result
    if (videoSrc) {
      try {
        URL.revokeObjectURL(videoSrc);
      } catch {
        /* ignore */
      }
      setVideoSrc(null);
    }

    // call parent callback to return to previous screen
    onBack();
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Activity Not Supported</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Sorry — "{activity.name}" is not supported by the current analyzer.</p>
            <Button onClick={onBack}>Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (stage === "processing" && videoSrc) {
    return (
      <VideoProcessor
        videoSrc={videoSrc}
        activityKey={normalizeActivityKey(activity.name)}
        onFinish={handleWorkoutComplete}
      />
    );
  }

  // default: upload/record screen
  return (
    <WorkoutUploadScreen
      activityName={activity.name}
      onBack={onBack}
      onVideoSelected={handleVideoSelected}
    />
  );
};

export default WorkoutInterface;
