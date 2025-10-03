// src/types/mediapipe.d.ts
declare global {
    namespace Mediapipe {
      export interface PoseLandmark {
        x: number;
        y: number;
        z?: number;
        visibility?: number;
      }
  
      export interface PoseResults {
        poseLandmarks?: PoseLandmark[];
        image?: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement;
      }
  
      export interface PoseOptions {
        locateFile?: (file: string) => string;
        modelComplexity?: number;
        smoothLandmarks?: boolean;
        minDetectionConfidence?: number;
        minTrackingConfidence?: number;
      }
  
      export type PoseConnection = [number, number];
  
      export class Pose {
        constructor(options: PoseOptions);
        setOptions(opts: PoseOptions): void;
        onResults(cb: (res: PoseResults) => void): void;
        send(data: { image: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement }): Promise<void>;
        close(): void;
        results?: PoseResults;
      }
  
      export const POSE_CONNECTIONS: PoseConnection[];
  
      export interface DrawingStyle {
        color?: string;
        lineWidth?: number;
        radius?: number;
      }
  
      export function drawConnectors(
        ctx: CanvasRenderingContext2D,
        landmarks: PoseLandmark[],
        connections: PoseConnection[],
        style?: DrawingStyle
      ): void;
  
      export function drawLandmarks(
        ctx: CanvasRenderingContext2D,
        landmarks: PoseLandmark[],
        style?: DrawingStyle
      ): void;
    }
  
    // Expose globals
    const Pose: typeof Mediapipe.Pose;
    const POSE_CONNECTIONS: typeof Mediapipe.POSE_CONNECTIONS;
    const drawConnectors: typeof Mediapipe.drawConnectors;
    const drawLandmarks: typeof Mediapipe.drawLandmarks;
  }
  
  export {};
  