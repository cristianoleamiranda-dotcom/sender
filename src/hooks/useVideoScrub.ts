import { useEffect, useRef, useCallback } from "react";

export type TransportState = "armed" | "released";

const LERP_TAU = 8;
const SENSITIVITY = 0.00045;
const KEY_SMALL = 0.025;
const KEY_LARGE = 0.12;
const MAX_RATE = 3;
const RATE_RAMP_MAX = 0.5;
const RATE_RAMP_COEF = 0.006;
const RATE_DECAY_STEP = 0.12;
const RATE_DECAY_MS = 120;
const REVERSE_STEP_COEF = 0.08;
const REVERSE_STEP_MIN = 0.02;
const REVERSE_FPS_INTERVAL = 1000 / 12; // ~12fps
const RELEASE_PROGRESS = 0.999;
const REARM_SCROLL_Y = 2;
const VIDEO_ERROR_GRACE_MS = 1500;

interface UseVideoScrubOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  reducedMotion: boolean;
  /** Called each RAF with current interpolation factor k in [0,1] (eased). */
  onFrame?: (k: number) => void;
  /** Called when state changes between armed/released. */
  onStateChange?: (state: TransportState) => void;
}

function ease(x: number): number {
  return x * x * (3 - 2 * x);
}

export function useVideoScrub({
  videoRef,
  reducedMotion,
  onFrame,
  onStateChange,
}: UseVideoScrubOptions) {
  const transportStateRef = useRef<TransportState>("armed");
  const transportProgressRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const targetTimeRef = useRef<number>(0);
  const navigationInProgressRef = useRef<boolean>(false);
  const videoErrorRef = useRef<boolean>(false);
  const videoReadyRef = useRef<boolean>(false);
  const videoDurationRef = useRef<number>(0);

  const rateRef = useRef<number>(1);
  const lastDecayRef = useRef<number>(0);
  const lastReverseSeekRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const releaseRafCountRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);

  const setK = useCallback(
    (ct: number) => {
      const raw = Math.min(1, Math.max(0, (ct - 0.2) / 2.4));
      const k = ease(raw);
      onFrame?.(k);
      return k;
    },
    [onFrame],
  );

  const resetToStart = useCallback(() => {
    const v = videoRef.current;
    transportProgressRef.current = 0;
    currentTimeRef.current = 0;
    targetTimeRef.current = 0;
    rateRef.current = 1;
    releaseRafCountRef.current = 0;
    if (v && v.readyState >= 1) {
      try {
        v.pause();
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
    setK(0);
  }, [videoRef, setK]);

  const arm = useCallback(() => {
    if (transportStateRef.current === "armed") return;
    transportStateRef.current = "armed";
    resetToStart();
    onStateChange?.("armed");
  }, [resetToStart, onStateChange]);

  const release = useCallback(() => {
    if (transportStateRef.current === "released") return;
    transportStateRef.current = "released";
    const v = videoRef.current;
    if (v) {
      try {
        v.pause();
        v.playbackRate = 1;
      } catch {
        /* ignore */
      }
    }
    onStateChange?.("released");
  }, [videoRef, onStateChange]);

  const addProgress = useCallback((delta: number) => {
    if (transportStateRef.current !== "armed") return;
    transportProgressRef.current = Math.min(
      1,
      Math.max(0, transportProgressRef.current + delta),
    );
    // Ramp up rate when moving forward quickly
    if (delta > 0) {
      const inc = Math.min(RATE_RAMP_MAX, Math.abs(delta) * RATE_RAMP_COEF * 80);
      rateRef.current = Math.min(MAX_RATE, rateRef.current + inc);
    }
  }, []);

  const navigateToSection = useCallback(
    (id: string) => {
      navigationInProgressRef.current = true;
      // Hide hero UI immediately
      setK(1);
      transportProgressRef.current = 1;
      targetTimeRef.current = videoDurationRef.current || 0;
      currentTimeRef.current = targetTimeRef.current;
      release();
      history.replaceState(null, "", `#${id}`);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      const clearNav = () => {
        navigationInProgressRef.current = false;
      };
      let scrollEndTimer: number | null = null;
      const onScroll = () => {
        if (scrollEndTimer) window.clearTimeout(scrollEndTimer);
        scrollEndTimer = window.setTimeout(() => {
          window.removeEventListener("scroll", onScroll);
          clearNav();
        }, 200);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.setTimeout(clearNav, 2000);
    },
    [release, setK],
  );

  // Setup video metadata listeners
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      videoReadyRef.current = true;
      videoDurationRef.current = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 0;
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    };
    const onError = () => {
      videoErrorRef.current = true;
      videoReadyRef.current = false;
    };

    if (v.readyState >= 1) onLoaded();
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("error", onError);

    const errTimer = window.setTimeout(() => {
      if (!videoReadyRef.current) {
        videoErrorRef.current = true;
      }
    }, VIDEO_ERROR_GRACE_MS);

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("error", onError);
      window.clearTimeout(errTimer);
    };
  }, [videoRef]);

  // Main RAF loop
  useEffect(() => {
    if (reducedMotion) {
      setK(0);
      return;
    }
    const v = videoRef.current;
    if (!v) return;

    const tick = (t: number) => {
      const dt = lastFrameTimeRef.current ? Math.min(0.05, (t - lastFrameTimeRef.current) / 1000) : 0.016;
      lastFrameTimeRef.current = t;

      // When video is missing/error — simulate a virtual timeline
      const virtualMode = videoErrorRef.current && videoDurationRef.current === 0;
      const virtualDuration = 2.6; // seconds of virtual timeline for UI displacement
      const dur = virtualMode
        ? virtualDuration
        : videoDurationRef.current;

      if (transportStateRef.current === "armed") {
        // Keep document pinned at top while armed
        if (window.scrollY !== 0) {
          window.scrollTo(0, 0);
        }

        // Decay rate
        if (t - lastDecayRef.current > RATE_DECAY_MS) {
          lastDecayRef.current = t;
          rateRef.current = Math.max(1, rateRef.current - RATE_DECAY_STEP);
        }

        targetTimeRef.current = transportProgressRef.current * dur;
        const diff = targetTimeRef.current - currentTimeRef.current;

        // Lerp toward target
        const lerpFactor = 1 - Math.exp(-dt * LERP_TAU);
        currentTimeRef.current += diff * lerpFactor;
        currentTimeRef.current = Math.max(0, Math.min(dur, currentTimeRef.current));

        if (!virtualMode && videoReadyRef.current && dur > 0) {
          const movingForward = diff > 0.01;
          const movingBackward = diff < -0.01;

          if (movingForward) {
            try {
              v.playbackRate = Math.max(1, Math.min(MAX_RATE, rateRef.current));
              if (v.paused) v.play().catch(() => {});
            } catch {
              /* ignore */
            }
            if (Math.abs(v.currentTime - currentTimeRef.current) > 0.25) {
              try {
                v.currentTime = currentTimeRef.current;
              } catch {
                /* ignore */
              }
            } else {
              // Sync ref from video for smoother playback
              currentTimeRef.current = v.currentTime;
            }
          } else if (movingBackward) {
            try {
              if (!v.paused) v.pause();
              v.playbackRate = 1;
            } catch {
              /* ignore */
            }
            if (!v.seeking && t - lastReverseSeekRef.current > REVERSE_FPS_INTERVAL) {
              const step = Math.max(REVERSE_STEP_MIN, REVERSE_STEP_COEF * rateRef.current);
              const next = Math.max(0, currentTimeRef.current - step);
              currentTimeRef.current = next;
              try {
                v.currentTime = next;
                lastReverseSeekRef.current = t;
              } catch {
                /* ignore */
              }
            }
          } else {
            try {
              if (!v.paused) v.pause();
              v.playbackRate = 1;
            } catch {
              /* ignore */
            }
            if (Math.abs(v.currentTime - currentTimeRef.current) > 0.2) {
              try {
                v.currentTime = currentTimeRef.current;
              } catch {
                /* ignore */
              }
            }
          }
        }

        setK(currentTimeRef.current);

        // Release check
        const atEnd = transportProgressRef.current >= RELEASE_PROGRESS;
        if (atEnd) {
          transportProgressRef.current = 1;
          targetTimeRef.current = dur;
          currentTimeRef.current = dur;
          if (!virtualMode) {
            try {
              v.currentTime = Math.min(dur, v.duration || dur);
              v.pause();
            } catch {
              /* ignore */
            }
          }
          setK(dur);
          releaseRafCountRef.current += 1;
          if (releaseRafCountRef.current >= 2) {
            release();
          }
        } else {
          releaseRafCountRef.current = 0;
        }
      } else {
        // Released — native scroll, check for re-arm
        if (
          !navigationInProgressRef.current &&
          window.scrollY <= REARM_SCROLL_Y
        ) {
          arm();
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      lastFrameTimeRef.current = 0;
    };
  }, [videoRef, reducedMotion, setK, release, arm]);

  // Wheel
  useEffect(() => {
    if (reducedMotion) return;
    const onWheel = (e: WheelEvent) => {
      if (navigationInProgressRef.current) return;
      if (transportStateRef.current !== "armed") return;
      e.preventDefault();
      const delta = Math.abs(e.deltaY) * SENSITIVITY * Math.sign(e.deltaY);
      addProgress(delta);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [reducedMotion, addProgress]);

  // Touch
  useEffect(() => {
    if (reducedMotion) return;
    const onTouchStart = (e: TouchEvent) => {
      if (transportStateRef.current !== "armed") return;
      touchStartYRef.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (transportStateRef.current !== "armed") return;
      if (touchStartYRef.current === null) return;
      if (navigationInProgressRef.current) return;
      e.preventDefault();
      const y = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - y;
      touchStartYRef.current = y;
      const delta = Math.abs(deltaY) * SENSITIVITY * Math.sign(deltaY);
      addProgress(delta);
    };
    const onTouchEnd = () => {
      touchStartYRef.current = null;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [reducedMotion, addProgress]);

  // Keyboard
  useEffect(() => {
    if (reducedMotion) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationInProgressRef.current) return;
      if (e.key === "Tab") return;
      const tgt = e.target as HTMLElement | null;
      const isTyping =
        tgt &&
        (tgt.tagName === "INPUT" ||
          tgt.tagName === "TEXTAREA" ||
          tgt.isContentEditable);
      if (isTyping) return;
      if (transportStateRef.current !== "armed") return;

      let delta = 0;
      switch (e.key) {
        case "ArrowDown":
          delta = KEY_SMALL;
          break;
        case "ArrowUp":
          delta = -KEY_SMALL;
          break;
        case "PageDown":
        case " ":
        case "Spacebar":
          delta = KEY_LARGE;
          break;
        case "PageUp":
          delta = -KEY_LARGE;
          break;
        default:
          return;
      }
      e.preventDefault();
      addProgress(delta);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [reducedMotion, addProgress]);

  return { navigateToSection, transportStateRef };
}
