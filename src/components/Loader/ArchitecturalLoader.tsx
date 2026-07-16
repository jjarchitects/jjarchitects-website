"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, easeInOut } from "framer-motion";

const STAGES = [
  { at: 0, label: "Sketching the foundation" },
  { at: 20, label: "Raising structural walls" },
  { at: 40, label: "Furnishing the interior" },
  { at: 65, label: "Fitting doors & windows" },
  { at: 85, label: "Finalizing the drawings" },
];

const getStageLabel = (progress: number) => {
  const stage = [...STAGES].reverse().find((s) => progress >= s.at);
  return stage?.label ?? STAGES[0].label;
};

// easeInOutCubic — mirrors the site's standard easing for the draw-in.
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const ArchitecturalLoader = ({ onComplete }: { onComplete?: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const completedRef = useRef(false);

  // Draws the full blueprint over ~1.3s with a smooth eased curve.
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setReducedMotion(true);
      setProgress(100);
      return;
    }

    let frame: number;
    let start: number | null = null;
    const duration = 1300;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const linear = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(linear);
      setProgress(Math.round(eased * 100));
      if (linear < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Hold briefly on the completed drawing, then fade out and signal done.
  useEffect(() => {
    if (progress < 100 || completedRef.current) return;
    completedRef.current = true;
    const holdTimeout = setTimeout(
      () => setIsExiting(true),
      reducedMotion ? 100 : 350
    );
    return () => clearTimeout(holdTimeout);
  }, [progress, reducedMotion]);

  useEffect(() => {
    if (!isExiting) return;
    const exitTimeout = setTimeout(
      () => onComplete?.(),
      reducedMotion ? 150 : 450
    );
    return () => clearTimeout(exitTimeout);
  }, [isExiting, onComplete, reducedMotion]);

  // Prevent page scrolling while loader is visible
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const stageLabel = progress >= 100 ? "Ready" : getStageLabel(progress);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: reducedMotion ? 0.15 : 0.45, ease: easeInOut }}
      className="fixed inset-0 w-screen h-screen bg-white/95 backdrop-blur-sm flex items-center justify-center z-30"
    >
      <span className="sr-only">Loading, {progress}% complete</span>

      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(27, 27, 27, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(27, 27, 27, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeInOut }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        {/* Brand eyebrow */}
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-copper-500" />
          <span className="text-xs font-light uppercase tracking-[0.3em] text-copper-500">
            JJ Architects
          </span>
          <span className="h-px w-8 bg-copper-500" />
        </div>

        {/* Blueprint Container */}
        <div className="relative">
          {/* Decorative corner brackets */}
          <span className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-copper-500/40" />
          <span className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-copper-500/40" />
          <span className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-copper-500/40" />
          <span className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-copper-500/40" />

          <div className="relative w-[22rem] h-[19rem] sm:w-96 sm:h-[21rem] bg-white border border-carbon-300 overflow-hidden">
            <div className="absolute inset-4">
              {/* Complex Floor Plan SVG */}
              <svg className="w-full h-full" viewBox="0 0 350 280">
                {/* Outer Building Perimeter */}
                <rect
                  x="20"
                  y="20"
                  width="310"
                  height="240"
                  fill="none"
                  stroke="#1b1b1b"
                  strokeWidth="2.5"
                  strokeDasharray="1100"
                  strokeDashoffset={progress < 20 ? 1100 - progress * 55 : 0}
                  className="transition-all duration-100 ease-linear"
                />

                {/* Main Structural Walls */}
                {progress >= 20 && (
                  <>
                    {/* Vertical Main Wall */}
                    <line
                      x1="140"
                      y1="20"
                      x2="140"
                      y2="260"
                      stroke="#1b1b1b"
                      strokeWidth="2.5"
                      strokeDasharray="240"
                      strokeDashoffset={
                        progress < 40 ? 240 - (progress - 20) * 12 : 0
                      }
                      className="transition-all duration-100 ease-linear"
                    />

                    {/* Horizontal Dividers */}
                    <line
                      x1="20"
                      y1="80"
                      x2="330"
                      y2="80"
                      stroke="#1b1b1b"
                      strokeWidth="2.5"
                      strokeDasharray="310"
                      strokeDashoffset={
                        progress < 40 ? 310 - (progress - 20) * 15.5 : 0
                      }
                      className="transition-all duration-100 ease-linear"
                    />

                    <line
                      x1="20"
                      y1="180"
                      x2="330"
                      y2="180"
                      stroke="#1b1b1b"
                      strokeWidth="2.5"
                      strokeDasharray="310"
                      strokeDashoffset={
                        progress < 40 ? 310 - (progress - 20) * 15.5 : 0
                      }
                      className="transition-all duration-100 ease-linear"
                    />

                    {/* Additional Vertical Walls */}
                    <line
                      x1="220"
                      y1="80"
                      x2="220"
                      y2="180"
                      stroke="#1b1b1b"
                      strokeWidth="2"
                      strokeDasharray="100"
                      strokeDashoffset={
                        progress < 40 ? 100 - (progress - 20) * 5 : 0
                      }
                      className="transition-all duration-100 ease-linear"
                    />

                    <line
                      x1="280"
                      y1="180"
                      x2="280"
                      y2="260"
                      stroke="#1b1b1b"
                      strokeWidth="2"
                      strokeDasharray="80"
                      strokeDashoffset={
                        progress < 40 ? 80 - (progress - 20) * 4 : 0
                      }
                      className="transition-all duration-100 ease-linear"
                    />
                  </>
                )}

                {/* Interior Layout Elements */}
                {progress >= 40 && (
                  <>
                    {/* Kitchen Island */}
                    <rect
                      x="160"
                      y="90"
                      width="50"
                      height="30"
                      fill="none"
                      stroke="#8a8a8a"
                      strokeWidth="1.5"
                      strokeDasharray="160"
                      strokeDashoffset={
                        progress < 65 ? 160 - (progress - 40) * 6.4 : 0
                      }
                      className="transition-all duration-100 ease-linear"
                    />

                    {/* Bathroom Fixtures */}
                    <rect
                      x="25"
                      y="85"
                      width="40"
                      height="20"
                      fill="none"
                      stroke="#8a8a8a"
                      strokeWidth="1.5"
                      strokeDasharray="120"
                      strokeDashoffset={
                        progress < 65 ? 120 - (progress - 40) * 4.8 : 0
                      }
                      className="transition-all duration-100 ease-linear"
                    />

                    {/* Bathtub */}
                    <rect
                      x="75"
                      y="85"
                      width="50"
                      height="20"
                      fill="none"
                      stroke="#8a8a8a"
                      strokeWidth="1.5"
                      strokeDasharray="140"
                      strokeDashoffset={
                        progress < 65 ? 140 - (progress - 40) * 5.6 : 0
                      }
                      className="transition-all duration-100 ease-linear"
                    />

                    {/* Bedroom Furniture */}
                    <rect
                      x="25"
                      y="200"
                      width="60"
                      height="40"
                      fill="none"
                      stroke="#8a8a8a"
                      strokeWidth="1.5"
                      strokeDasharray="200"
                      strokeDashoffset={
                        progress < 65 ? 200 - (progress - 40) * 8 : 0
                      }
                      className="transition-all duration-100 ease-linear"
                    />

                    {/* Living Room Sofa */}
                    <rect
                      x="160"
                      y="200"
                      width="80"
                      height="35"
                      fill="none"
                      stroke="#8a8a8a"
                      strokeWidth="1.5"
                      strokeDasharray="230"
                      strokeDashoffset={
                        progress < 65 ? 230 - (progress - 40) * 9.2 : 0
                      }
                      className="transition-all duration-100 ease-linear"
                    />

                    {/* Dining Table */}
                    <circle
                      cx="300"
                      cy="130"
                      r="25"
                      fill="none"
                      stroke="#8a8a8a"
                      strokeWidth="1.5"
                      strokeDasharray="157"
                      strokeDashoffset={
                        progress < 65 ? 157 - (progress - 40) * 6.28 : 0
                      }
                      className="transition-all duration-100 ease-linear"
                    />
                  </>
                )}

                {/* Doors and Windows */}
                {progress >= 65 && (
                  <>
                    {/* Main Entrance Door */}
                    <path
                      d="M 20 120 A 25 25 0 0 1 45 95"
                      fill="none"
                      stroke="#a55838"
                      strokeWidth="2"
                      strokeDasharray="39.3"
                      strokeDashoffset={
                        progress < 85 ? 39.3 - (progress - 65) * 1.965 : 0
                      }
                      className="transition-all duration-100 ease-linear"
                    />

                    {/* Interior Doors */}
                    <path
                      d="M 140 140 A 20 20 0 0 1 160 120"
                      fill="none"
                      stroke="#a55838"
                      strokeWidth="1.5"
                      strokeDasharray="31.4"
                      strokeDashoffset={
                        progress < 85 ? 31.4 - (progress - 65) * 1.57 : 0
                      }
                      className="transition-all duration-100 ease-linear"
                    />

                    <path
                      d="M 100 180 A 15 15 0 0 1 115 165"
                      fill="none"
                      stroke="#a55838"
                      strokeWidth="1.5"
                      strokeDasharray="23.6"
                      strokeDashoffset={
                        progress < 85 ? 23.6 - (progress - 65) * 1.18 : 0
                      }
                      className="transition-all duration-100 ease-linear"
                    />

                    {/* Windows */}
                    <rect
                      x="40"
                      y="18"
                      width="40"
                      height="4"
                      fill="none"
                      stroke="#1b1b1b"
                      strokeWidth="2"
                      opacity={progress >= 70 ? 0.55 : 0}
                      className="transition-opacity duration-500"
                    />

                    <rect
                      x="180"
                      y="18"
                      width="50"
                      height="4"
                      fill="none"
                      stroke="#1b1b1b"
                      strokeWidth="2"
                      opacity={progress >= 75 ? 0.55 : 0}
                      className="transition-opacity duration-500"
                    />

                    <rect
                      x="280"
                      y="18"
                      width="40"
                      height="4"
                      fill="none"
                      stroke="#1b1b1b"
                      strokeWidth="2"
                      opacity={progress >= 78 ? 0.55 : 0}
                      className="transition-opacity duration-500"
                    />

                    <rect
                      x="328"
                      y="100"
                      width="4"
                      height="40"
                      fill="none"
                      stroke="#1b1b1b"
                      strokeWidth="2"
                      opacity={progress >= 82 ? 0.55 : 0}
                      className="transition-opacity duration-500"
                    />
                  </>
                )}

                {/* Dimensions and Annotations */}
                {progress >= 85 && (
                  <>
                    {/* Dimension Lines */}
                    <line
                      x1="15"
                      y1="20"
                      x2="15"
                      y2="260"
                      stroke="#a55838"
                      strokeWidth="0.8"
                      opacity={progress >= 90 ? 0.7 : 0}
                      className="transition-opacity duration-300"
                    />

                    <line
                      x1="20"
                      y1="270"
                      x2="330"
                      y2="270"
                      stroke="#a55838"
                      strokeWidth="0.8"
                      opacity={progress >= 92 ? 0.7 : 0}
                      className="transition-opacity duration-300"
                    />

                    {/* Measurement Text */}
                    <text
                      x="8"
                      y="145"
                      fill="#a55838"
                      fontSize="9"
                      textAnchor="middle"
                      transform="rotate(-90, 8, 145)"
                      opacity={progress >= 95 ? 0.85 : 0}
                      className="transition-opacity duration-300 font-mono"
                    >
                      12.0m
                    </text>

                    <text
                      x="175"
                      y="285"
                      fill="#a55838"
                      fontSize="9"
                      textAnchor="middle"
                      opacity={progress >= 97 ? 0.85 : 0}
                      className="transition-opacity duration-300 font-mono"
                    >
                      15.5m
                    </text>

                    {/* Room Labels */}
                    <text
                      x="75"
                      y="50"
                      fill="#8a8a8a"
                      fontSize="10"
                      textAnchor="middle"
                      opacity={progress >= 98 ? 1 : 0}
                      className="transition-opacity duration-300 font-light"
                    >
                      BATHROOM
                    </text>

                    <text
                      x="280"
                      y="50"
                      fill="#8a8a8a"
                      fontSize="10"
                      textAnchor="middle"
                      opacity={progress >= 98 ? 1 : 0}
                      className="transition-opacity duration-300 font-light"
                    >
                      KITCHEN
                    </text>

                    <text
                      x="70"
                      y="225"
                      fill="#8a8a8a"
                      fontSize="10"
                      textAnchor="middle"
                      opacity={progress >= 98 ? 1 : 0}
                      className="transition-opacity duration-300 font-light"
                    >
                      BEDROOM
                    </text>

                    <text
                      x="220"
                      y="225"
                      fill="#8a8a8a"
                      fontSize="10"
                      textAnchor="middle"
                      opacity={progress >= 98 ? 1 : 0}
                      className="transition-opacity duration-300 font-light"
                    >
                      LIVING ROOM
                    </text>
                  </>
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Progress Information */}
        <div className="flex w-64 flex-col items-center gap-3">
          <div className="flex items-baseline gap-1 tabular-nums">
            <span className="text-4xl font-extralight text-carbon-500">
              {progress}
            </span>
            <span className="text-lg font-extralight text-carbon-400">%</span>
          </div>

          <div className="h-0.5 w-full overflow-hidden bg-carbon-200">
            <div
              className="h-full bg-copper-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div
            aria-hidden="true"
            className="text-xs font-light uppercase tracking-widest text-carbon-400"
          >
            {stageLabel}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ArchitecturalLoader;
