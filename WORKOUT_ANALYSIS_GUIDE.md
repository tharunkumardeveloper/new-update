# AI-Powered Workout Analysis System

## Overview

The TalentTrack app now includes a comprehensive AI-powered workout analysis system with two distinct modes: **Video Mode** and **Live Mode**. The system uses MediaPipe Pose for motion analysis and provides real-time feedback with speech synthesis.

## Features

### Two Analysis Modes

1. **Video Mode** - Upload a recorded workout video for analysis
   - Upload pre-recorded videos (MP4, WebM, etc.)
   - Frame-by-frame pose analysis
   - Annotated video playback with skeleton overlay
   - Detailed summary report after processing

2. **Live Mode** - Real-time webcam analysis
   - Live webcam feed with pose detection
   - Real-time rep counting
   - Instant posture feedback (visual and audio)
   - Speech synthesis for verbal feedback
   - Live overlay with rep count and feedback messages

### Supported Activities

- Push-ups
- Pull-ups
- Sit-ups
- Vertical Jump
- Shuttle Run
- Sit & Reach

## Architecture

### Core Components

#### 1. `LiveWorkoutProcessor.tsx`
Handles real-time workout analysis with webcam input.

**Key Features:**
- Real-time pose detection using MediaPipe Camera
- Live rep counting with state machines
- Visual feedback overlay (rep count, status)
- Speech synthesis for audio feedback
- Session timer

**Feedback System:**
- Green checkmark for good reps
- Red X for bad form
- Spoken feedback: "Good rep!", "Go lower!", etc.

#### 2. `VideoProcessor.tsx`
Processes uploaded video files for workout analysis.

**Key Features:**
- Frame-by-frame video processing
- Progress indicator
- Annotated video playback
- Toggle skeleton overlay on/off
- Detailed results summary

#### 3. `WorkoutInterface.tsx`
Main orchestrator that routes between modes.

**Routing:**
- Upload screen → Video Mode
- Live button → Live Mode
- Record video → Video Mode

#### 4. `WorkoutUploadScreen.tsx`
Initial selection screen with three options:
- Start Live Session (green button)
- Upload Video
- Record Video

### Motion Analysis (`metrics.ts`)

All workout logic is contained in strongly-typed state machines:

```typescript
// Example: Pushup state machine
export type PushupState = {
  angleHistory: number[];
  state: "up" | "down";
  inDip: boolean;
  dipStartTime?: number | null;
  currentDipMinAngle: number;
  reps: RepRow[];
  fps: number;
};
```

**Per-Activity Analysis Functions:**
- `pushupFrameAnalysis()` - Detects elbow angle, validates depth
- `pullupFrameAnalysis()` - Tracks head height, validates pull
- `situpFrameAnalysis()` - Measures torso angle change
- `verticalJumpFrameAnalysis()` - Calculates jump height
- `shuttleFrameAnalysis()` - Tracks horizontal movement
- `sitReachFrameAnalysis()` - Measures forward reach

**Summary Functions:**
- `summarizePushups()` - Returns count, good/bad reps, avg angle
- `summarizePullups()` - Returns count, avg dip duration
- `summarizeSitups()` - Returns count, avg angle change
- `summarizeVerticalJump()` - Returns count, max height, avg air time
- `summarizeShuttle()` - Returns runs, distance
- `summarizeSitReach()` - Returns max reach

## Data Flow

### Live Mode Flow
```
User clicks "Start Live Session"
  ↓
LiveWorkoutProcessor initializes
  ↓
Camera starts + MediaPipe Pose loads
  ↓
Frame loop begins:
  - Capture frame
  - Send to MediaPipe
  - Extract landmarks
  - Run activity analysis
  - Update UI overlay
  - Speak feedback on new rep
  ↓
User clicks "Stop Workout"
  ↓
Generate summary
  ↓
Save to history + return to home
```

### Video Mode Flow
```
User uploads video
  ↓
VideoProcessor initializes
  ↓
User clicks "Analyze Video"
  ↓
Processing loop:
  - Seek to frame
  - Extract landmarks
  - Run activity analysis
  - Draw annotations
  - Update progress bar
  ↓
Processing complete
  ↓
Show annotated playback + results
  ↓
User clicks "Complete Workout"
  ↓
Save to history + return to home
```

## Type Safety

All code is strongly typed with **no usage of `any`**:

```typescript
// Result type
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

// Landmark type from MediaPipe
import { NormalizedLandmark } from "@mediapipe/pose";

// Activity state union type
type ActivityState =
  | PushupState
  | PullupState
  | SitupState
  | VerticalJumpState
  | ShuttleState
  | SitReachState;
```

## Real-Time Feedback

### Visual Feedback
- **Rep Counter Badge** - Large display showing current count
- **Status Messages** - Text feedback with color coding:
  - Green: Good form detected
  - Red: Form correction needed
  - White: Neutral status
- **Icons** - CheckCircle2 (good) / XCircle (bad)

### Audio Feedback
Uses browser SpeechSynthesis API:

```typescript
const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  }
};
```

**Feedback Messages:**
- Push-ups: "Good rep!", "Go lower!", "Keep your back straight!"
- Pull-ups: "Great pull-up!"
- Sit-ups: "Good sit-up!"
- Vertical Jump: "Nice jump!", "Jump higher!"

## MediaPipe Integration

### Pose Detection Setup
```typescript
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
```

### Drawing Annotations
```typescript
drawConnectors(ctx, landmarks, POSE_CONNECTIONS, {
  color: "#00FF00",
  lineWidth: 4,
});

drawLandmarks(ctx, landmarks, {
  color: "#FF0000",
  radius: 6,
});
```

## Results & Persistence

Results are saved to localStorage as `WorkoutHistoryItem`:

```typescript
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
  // Extra activity-specific metrics
  [k: string]: string | number | boolean | string[] | undefined;
};
```

## User Experience

### Video Mode
1. User sees upload screen with three options
2. User selects "Upload Video" or "Record Video"
3. Video selected → Shows video with "Analyze Video" button
4. Analysis runs with progress bar
5. Annotated playback available with play/pause
6. Results card shows all metrics
7. "Complete Workout" saves and returns

### Live Mode
1. User clicks "Start Live Session"
2. Camera permission requested
3. Live feed appears with skeleton overlay
4. Timer starts counting up
5. Rep counter updates in real-time
6. Feedback messages appear and are spoken
7. User clicks "Stop Workout"
8. Summary generated and saved
9. Returns to home screen

## Best Practices

### For Users
- Ensure good lighting
- Keep full body in frame
- Maintain steady camera position
- Use proper exercise form

### For Developers
- All state is managed with refs for performance
- Canvas is redrawn every frame
- Speech synthesis is cancelled before new utterance
- Camera/pose resources cleaned up on unmount
- Progress tracked for long video processing

## Browser Compatibility

- **Camera**: Requires `navigator.mediaDevices.getUserMedia`
- **Speech**: Requires `window.speechSynthesis`
- **MediaPipe**: Loads from CDN, works in modern browsers
- **Canvas**: Standard 2D rendering

## Performance Considerations

- Live mode runs at 30 FPS
- Video mode processes at 30 FPS (can be adjusted)
- Pose detection is CPU-intensive
- Large videos may take time to process
- Results are cached during processing

## Future Enhancements

Potential additions:
- Save annotated video to file
- Compare workouts over time
- Advanced metrics (speed, acceleration)
- Multi-person detection
- Exercise form scoring algorithm
- Cloud storage for videos
- Social sharing features
