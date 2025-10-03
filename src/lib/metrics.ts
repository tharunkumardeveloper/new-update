/**
 * metrics.ts
 *
 * Full motion analysis + summaries for TalentTrack app.
 * - 6 workouts supported.
 * - No CSV, no `any`.
 * - All State/init/analysis functions exported.
 * - Summaries expose clean UI fields.
 */

export type Landmark = {
    x: number;
    y: number;
    z?: number;
    visibility?: number;
  };
  
  export type FrameMetric = Record<string, string | number | boolean>;
  
  /* ----------------- Helpers ----------------- */
  export function lmXY(lm: Landmark, w: number, h: number): [number, number] {
    return [lm.x * w, lm.y * h];
  }
  
  function angle(a: [number, number], b: [number, number], c: [number, number]): number {
    const ba = [a[0] - b[0], a[1] - b[1]];
    const bc = [c[0] - b[0], c[1] - b[1]];
    const dot = ba[0] * bc[0] + ba[1] * bc[1];
    const mag1 = Math.hypot(ba[0], ba[1]);
    const mag2 = Math.hypot(bc[0], bc[1]);
    const cosang = Math.max(-1, Math.min(1, dot / (mag1 * mag2 + 1e-9)));
    return (Math.acos(cosang) * 180) / Math.PI;
  }
  
  export function averageAngleBetween(
    lm: Landmark[],
    w: number,
    h: number,
    leftIdx: number,
    midIdx: number,
    rightIdx: number
  ): number | null {
    try {
      const a = lmXY(lm[leftIdx], w, h);
      const b = lmXY(lm[midIdx], w, h);
      const c = lmXY(lm[rightIdx], w, h);
      return angle(a, b, c);
    } catch {
      return null;
    }
  }
  
  /* ----------------- Generic Rep ----------------- */
  export type RepRow = {
    count: number;
    down_time?: number;
    up_time?: number;
    dip_duration_sec?: number;
    min_elbow_angle?: number;
    angle_change?: number;
    correct?: boolean;
    [k: string]: number | string | boolean | undefined;
  };
  
  /* ============================================================
     PUSHUPS
     ============================================================ */
  export type PushupState = {
    angleHistory: number[];
    state: "up" | "down";
    inDip: boolean;
    dipStartTime?: number | null;
    currentDipMinAngle: number;
    reps: RepRow[];
    fps: number;
  };
  
  export function initPushupState(fps = 30): PushupState {
    return { angleHistory: [], state: "up", inDip: false, dipStartTime: null, currentDipMinAngle: 180, reps: [], fps };
  }
  
  export function pushupFrameAnalysis(
    landmarks: Landmark[],
    w: number,
    h: number,
    t: number,
    state: PushupState
  ): RepRow | null {
    if (!landmarks.length) return null;
  
    const angL = averageAngleBetween(landmarks, w, h, 11, 13, 15);
    const angR = averageAngleBetween(landmarks, w, h, 12, 14, 16);
    const elbowAngle = angL != null && angR != null ? (angL + angR) / 2 : null;
    if (elbowAngle == null) return null;
  
    state.angleHistory.push(elbowAngle);
    if (state.angleHistory.length > 3) state.angleHistory.shift();
    const elbowSm = state.angleHistory.reduce((a, b) => a + b, 0) / state.angleHistory.length;
  
    const DOWN_ANGLE = 75;
    const UP_ANGLE = 110;
    const MIN_DIP_DURATION = 0.2;
  
    if (state.state === "up" && elbowSm <= DOWN_ANGLE) {
      state.state = "down";
      state.inDip = true;
      state.dipStartTime = t;
      state.currentDipMinAngle = elbowSm;
    } else if (state.state === "down" && elbowSm >= UP_ANGLE) {
      state.state = "up";
      if (state.inDip) {
        const dipDuration = t - (state.dipStartTime ?? t);
        const isCorrect = state.currentDipMinAngle <= DOWN_ANGLE && dipDuration >= MIN_DIP_DURATION;
        const rep: RepRow = {
          count: state.reps.length + 1,
          down_time: Number((state.dipStartTime ?? 0).toFixed(3)),
          up_time: Number(t.toFixed(3)),
          dip_duration_sec: Number(dipDuration.toFixed(3)),
          min_elbow_angle: Number(state.currentDipMinAngle.toFixed(2)),
          correct: isCorrect,
        };
        state.reps.push(rep);
        state.inDip = false;
        state.dipStartTime = null;
        state.currentDipMinAngle = 180;
        return rep;
      }
    }
  
    if (state.inDip && elbowSm < state.currentDipMinAngle) state.currentDipMinAngle = elbowSm;
    return null;
  }
  
  /* ============================================================
     PULLUPS
     ============================================================ */
  export type PullupState = {
    angleHistory: number[];
    state: "waiting" | "up";
    inDip: boolean;
    dipStartTime?: number | null;
    reps: RepRow[];
    initialHeadY?: number | null;
    fps: number;
  };
  
  export function initPullupState(fps = 30): PullupState {
    return { angleHistory: [], state: "waiting", inDip: false, dipStartTime: null, reps: [], initialHeadY: null, fps };
  }
  
  export function pullupFrameAnalysis(
    landmarks: Landmark[],
    w: number,
    h: number,
    t: number,
    state: PullupState
  ): RepRow | null {
    if (!landmarks.length) return null;
    const nose = landmarks[0];
    const headY = nose ? nose.y * h : null;
  
    const angL = averageAngleBetween(landmarks, w, h, 11, 13, 15);
    const angR = averageAngleBetween(landmarks, w, h, 12, 14, 16);
    const elbowAngle = angL != null && angR != null ? (angL + angR) / 2 : null;
  
    if (state.initialHeadY == null && headY != null) state.initialHeadY = headY;
    if (elbowAngle == null || headY == null) return null;
  
    state.angleHistory.push(elbowAngle);
    if (state.angleHistory.length > 3) state.angleHistory.shift();
    const smoothed = state.angleHistory.reduce((a, b) => a + b, 0) / state.angleHistory.length;
  
    const BOTTOM_ANGLE = 160;
    const MIN_DIP = 0.1;
  
    if (state.state === "waiting" && headY < (state.initialHeadY ?? headY)) {
      state.state = "up";
      state.inDip = true;
      state.dipStartTime = t;
    } else if (
      state.state === "up" &&
      smoothed > BOTTOM_ANGLE &&
      headY >= (state.initialHeadY ?? headY) &&
      state.inDip
    ) {
      const dipDuration = t - (state.dipStartTime ?? t);
      if (dipDuration >= MIN_DIP) {
        const rep: RepRow = {
          count: state.reps.length + 1,
          up_time: Number((state.dipStartTime ?? 0).toFixed(2)),
          down_time: Number(t.toFixed(2)),
          dip_duration_sec: Number(dipDuration.toFixed(2)),
          min_elbow_angle: Number(smoothed.toFixed(2)),
        };
        state.reps.push(rep);
        state.inDip = false;
        state.dipStartTime = null;
        state.state = "waiting";
        return rep;
      }
    }
    return null;
  }
  
  /* ============================================================
     SITUPS
     ============================================================ */
  export type SitupState = {
    angleHistory: number[];
    state: "up" | "down";
    lastExtremeAngle?: number | null;
    dipStartTime?: number | null;
    reps: RepRow[];
    fps: number;
  };
  
  export function initSitupState(fps = 30): SitupState {
    return { angleHistory: [], state: "up", lastExtremeAngle: null, dipStartTime: null, reps: [], fps };
  }
  
  export function situpFrameAnalysis(
    landmarks: Landmark[],
    w: number,
    h: number,
    t: number,
    state: SitupState
  ): RepRow | null {
    if (!landmarks.length) return null;
    const angL = averageAngleBetween(landmarks, w, h, 11, 13, 15);
    const angR = averageAngleBetween(landmarks, w, h, 12, 14, 16);
    const elbowAngle = angL != null && angR != null ? (angL + angR) / 2 : null;
    if (elbowAngle == null) return null;
  
    state.angleHistory.push(elbowAngle);
    if (state.angleHistory.length > 5) state.angleHistory.shift();
    const sm = state.angleHistory.reduce((a, b) => a + b, 0) / state.angleHistory.length;
  
    const MIN_DIP_CHANGE = 15;
    if (state.lastExtremeAngle == null) state.lastExtremeAngle = sm;
  
    if (state.state === "up" && (state.lastExtremeAngle - sm) >= MIN_DIP_CHANGE) {
      state.state = "down";
      state.dipStartTime = t;
      state.lastExtremeAngle = sm;
    } else if (state.state === "down" && (sm - (state.lastExtremeAngle ?? 0)) >= MIN_DIP_CHANGE) {
      state.state = "up";
      const rep: RepRow = {
        count: state.reps.length + 1,
        down_time: state.dipStartTime ? Number(state.dipStartTime.toFixed(3)) : 0,
        up_time: Number(t.toFixed(3)),
        angle_change: Number((sm - (state.lastExtremeAngle ?? 0)).toFixed(2)),
      };
      state.reps.push(rep);
      state.dipStartTime = null;
      state.lastExtremeAngle = sm;
      return rep;
    }
  
    state.lastExtremeAngle = sm;
    return null;
  }
  
  /* ============================================================
     VERTICAL JUMP
     ============================================================ */
  export type VerticalJumpRow = {
    takeoff_time: number;
    landing_time?: number | null;
    jump_height_px: number;
    air_time_s: number;
  };
  
  export type VerticalJumpState = {
    hipHistory: number[];
    baselineY?: number | null;
    inAir: boolean;
    peakY?: number | null;
    jumpCount: number;
    jumpData: VerticalJumpRow[];
    fps: number;
  };
  
  export function initVerticalJumpState(fps = 30): VerticalJumpState {
    return { hipHistory: [], baselineY: null, inAir: false, peakY: null, jumpCount: 0, jumpData: [], fps };
  }
  
  export function verticalJumpFrameAnalysis(
    landmarks: Landmark[],
    w: number,
    h: number,
    t: number,
    state: VerticalJumpState
  ): VerticalJumpRow | null {
    if (!landmarks.length) return null;
  
    const leftHip = lmXY(landmarks[23], w, h);
    const rightHip = lmXY(landmarks[24], w, h);
    const midHipY = (leftHip[1] + rightHip[1]) / 2;
  
    state.hipHistory.push(midHipY);
    if (state.hipHistory.length > 5) state.hipHistory.shift();
    const hipSm = state.hipHistory.reduce((a, b) => a + b, 0) / state.hipHistory.length;
  
    if (state.baselineY == null) state.baselineY = hipSm;
  
    if (!state.inAir && hipSm < (state.baselineY - 20)) {
      state.inAir = true;
      state.peakY = hipSm;
      state.jumpCount += 1;
      state.jumpData.push({ takeoff_time: t, landing_time: null, jump_height_px: 0, air_time_s: 0 });
    } else if (state.inAir) {
      if (hipSm < (state.peakY ?? hipSm)) state.peakY = hipSm;
      if (hipSm >= (state.baselineY - 5)) {
        const last = state.jumpData[state.jumpData.length - 1];
        const jumpHeightPx = (state.baselineY ?? 0) - (state.peakY ?? 0);
        last.landing_time = t;
        last.jump_height_px = Number(jumpHeightPx.toFixed(2));
        last.air_time_s = Number(((t - (last.takeoff_time ?? t)) || 0).toFixed(3));
        state.inAir = false;
        state.peakY = null;
        return last;
      }
    }
    return null;
  }
  
  /* ============================================================
     SHUTTLE RUN
     ============================================================ */
  export type ShuttleState = {
    xHistory: number[];
    dirHistory: string[];
    positions: number[];
    runCount: number;
    status: string;
    direction?: string | null;
    startX?: number | null;
    lastX?: number | null;
    fps: number;
  };
  
  export function initShuttleState(fps = 30): ShuttleState {
    return { xHistory: [], dirHistory: [], positions: [], runCount: 0, status: "Waiting", direction: null, startX: null, lastX: null, fps };
  }
  
  export function shuttleFrameAnalysis(
    landmarks: Landmark[],
    w: number,
    h: number,
    t: number,
    state: ShuttleState
  ): FrameMetric | null {
    if (!landmarks.length) return null;
    const keys = [27, 28, 31, 32];
    const keyx = keys.map(i => (landmarks[i]?.x ?? 0) * w);
    const currentX = keyx.reduce((a, b) => a + b, 0) / keyx.length;
  
    state.xHistory.push(currentX);
    if (state.xHistory.length > 5) state.xHistory.shift();
    const smoothedX = state.xHistory.reduce((a, b) => a + b, 0) / state.xHistory.length;
  
    if (state.lastX != null) {
      const delta = smoothedX - state.lastX;
      if (delta > 5) state.dirHistory.push("forward");
      else if (delta < -5) state.dirHistory.push("backward");
  
      if (state.dirHistory.length > 3) state.dirHistory.shift();
  
      if (state.dirHistory.length === 3 && state.dirHistory.every(d => d === state.dirHistory[0])) {
        const confirmed = state.dirHistory[0];
        if (state.startX == null) {
          state.startX = smoothedX;
          state.direction = confirmed;
          state.status = confirmed === "forward" ? "Running Towards" : "Returning";
        } else if (state.direction !== confirmed) {
          state.direction = confirmed;
          if (confirmed === "backward") {
            state.runCount += 1;
            state.status = "Returning";
          } else state.status = "Running Towards";
        }
      }
    }
    state.lastX = smoothedX;
    state.positions.push(smoothedX);
    return { runCount: state.runCount, status: state.status };
  }
  
  /* ============================================================
     SIT & REACH
     ============================================================ */
  export type SitReachState = {
    reachHistory: number[];
    maxReachPx: number;
    timeOfMax: number;
    reachData: { time_s: number; reach_px: number; reach_m: number }[];
    fps: number;
  };
  
  export function initSitReachState(fps = 30): SitReachState {
    return { reachHistory: [], maxReachPx: 0, timeOfMax: 0, reachData: [], fps };
  }
  
  export function sitReachFrameAnalysis(
    landmarks: Landmark[],
    w: number,
    h: number,
    t: number,
    state: SitReachState
  ): FrameMetric | null {
    if (!landmarks.length) return null;
    const leftFoot = lmXY(landmarks[31], w, h);
    const rightFoot = lmXY(landmarks[32], w, h);
    const footX = (leftFoot[0] + rightFoot[0]) / 2;
    const leftHand = lmXY(landmarks[15], w, h);
    const rightHand = lmXY(landmarks[16], w, h);
    const handX = (leftHand[0] + rightHand[0]) / 2;
  
    const reachPx = handX - footX;
    state.reachHistory.push(reachPx);
    if (state.reachHistory.length > 5) state.reachHistory.shift();
    const sm = state.reachHistory.reduce((a, b) => a + b, 0) / state.reachHistory.length;
  
    if (sm > state.maxReachPx) {
      state.maxReachPx = sm;
      state.timeOfMax = t;
    }
  
    state.reachData.push({ time_s: Number(t.toFixed(3)), reach_px: Number(sm.toFixed(2)), reach_m: Number((sm * 0.01).toFixed(3)) });
    return null;
  }
  
  /* ============================================================
     SUMMARIES
     ============================================================ */
  export function summarizePushups(reps: RepRow[]) {
    if (!reps.length) return { count: 0, goodReps: 0, badReps: 0, avgElbowAngle: 0, avgRepDurationSec: 0 };
    const goodReps = reps.filter(r => r.correct).length;
    const badReps = reps.length - goodReps;
    const avgAngle = reps.reduce((a, r) => a + (r.min_elbow_angle ?? 0), 0) / reps.length;
    const avgDuration = reps.reduce((a, r) => a + (r.dip_duration_sec ?? 0), 0) / reps.length;
    return { count: reps.length, goodReps, badReps, avgElbowAngle: Number(avgAngle.toFixed(2)), avgRepDurationSec: Number(avgDuration.toFixed(2)) };
  }
  
  export function summarizePullups(reps: RepRow[]) {
    if (!reps.length) return { count: 0, avgDipDuration: 0 };
    const avgDipDuration = reps.reduce((a, r) => a + (r.dip_duration_sec ?? 0), 0) / reps.length;
    return { count: reps.length, avgDipDuration: Number(avgDipDuration.toFixed(2)) };
  }
  
  export function summarizeSitups(reps: RepRow[]) {
    if (!reps.length) return { count: 0, avgAngleChange: 0 };
    const avgChange = reps.reduce((a, r) => a + (r.angle_change ?? 0), 0) / reps.length;
    return { count: reps.length, avgAngleChange: Number(avgChange.toFixed(2)) };
  }
  
  export function summarizeVerticalJump(jumps: VerticalJumpRow[]) {
    if (!jumps.length) return { count: 0, maxHeightCm: 0, avgAirTimeSec: 0 };
    const maxHeight = Math.max(...jumps.map(j => j.jump_height_px));
    const avgAirTime = jumps.reduce((a, j) => a + j.air_time_s, 0) / jumps.length;
    return { count: jumps.length, maxHeightCm: Number((maxHeight * 0.0264).toFixed(2)), avgAirTimeSec: Number(avgAirTime.toFixed(2)) };
  }
  
  export function summarizeShuttle(state: ShuttleState) {
    if (!state.positions.length) return { runs: 0, distanceM: 0 };
    const minX = Math.min(...state.positions);
    const maxX = Math.max(...state.positions);
    return { runs: state.runCount, distanceM: Number(((maxX - minX) * 0.01).toFixed(2)) };
  }
  
  export function summarizeSitReach(state: SitReachState) {
    return { maxReachM: Number((state.maxReachPx * 0.01).toFixed(2)), timeOfMax: Number(state.timeOfMax.toFixed(2)) };
  }
  