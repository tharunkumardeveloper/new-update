declare module "@mediapipe/pose" {
  export interface NormalizedLandmark {
    x: number;
    y: number;
    z?: number;
    visibility?: number;
  }

  export interface Results {
    poseLandmarks?: NormalizedLandmark[];
    image?: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement;
  }

  export interface Options {
    locateFile?: (file: string) => string;
    modelComplexity?: number;
    smoothLandmarks?: boolean;
    minDetectionConfidence?: number;
    minTrackingConfidence?: number;
  }

  export type Connection = [number, number];

  export class Pose {
    constructor(options: Options);
    setOptions(opts: Partial<Options>): void;
    onResults(callback: (results: Results) => void): void;
    send(data: { image: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement }): Promise<void>;
    close(): void;
  }

  export const POSE_CONNECTIONS: Connection[];
}

declare module "@mediapipe/drawing_utils" {
  import { NormalizedLandmark, Connection } from "@mediapipe/pose";

  export interface DrawingOptions {
    color?: string;
    lineWidth?: number;
    radius?: number;
  }

  export function drawConnectors(
    ctx: CanvasRenderingContext2D,
    landmarks: NormalizedLandmark[],
    connections: Connection[],
    options?: DrawingOptions
  ): void;

  export function drawLandmarks(
    ctx: CanvasRenderingContext2D,
    landmarks: NormalizedLandmark[],
    options?: DrawingOptions
  ): void;
}

declare module "@mediapipe/camera_utils" {
  export interface CameraOptions {
    onFrame: () => Promise<void> | void;
    width?: number;
    height?: number;
  }

  export class Camera {
    constructor(videoElement: HTMLVideoElement, options: CameraOptions);
    start(): Promise<void>;
    stop(): void;
  }
}

export {};
  