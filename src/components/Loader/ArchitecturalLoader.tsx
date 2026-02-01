"use client";

import React, { useState, useEffect } from "react";

const ArchitecturalLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        return prev + 1;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // Prevent page scrolling while loader is visible
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-white/80 flex items-center justify-center z-30">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Blueprint Container */}
        <div className="relative w-96 h-84 bg-white. border border-slate-400 rounded-2xl. shadow-lg. overflow-hidden">
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
                stroke="#1e293b"
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
                    stroke="#1e293b"
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
                    stroke="#1e293b"
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
                    stroke="#1e293b"
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
                    stroke="#1e293b"
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
                    stroke="#1e293b"
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
                    stroke="#475569"
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
                    stroke="#475569"
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
                    stroke="#475569"
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
                    stroke="#475569"
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
                    stroke="#475569"
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
                    stroke="#475569"
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
                    stroke="#059669"
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
                    stroke="#059669"
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
                    stroke="#059669"
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
                    stroke="#0ea5e9"
                    strokeWidth="2"
                    opacity={progress >= 70 ? 1 : 0}
                    className="transition-opacity duration-500"
                  />

                  <rect
                    x="180"
                    y="18"
                    width="50"
                    height="4"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="2"
                    opacity={progress >= 75 ? 1 : 0}
                    className="transition-opacity duration-500"
                  />

                  <rect
                    x="280"
                    y="18"
                    width="40"
                    height="4"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="2"
                    opacity={progress >= 78 ? 1 : 0}
                    className="transition-opacity duration-500"
                  />

                  <rect
                    x="328"
                    y="100"
                    width="4"
                    height="40"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="2"
                    opacity={progress >= 82 ? 1 : 0}
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
                    stroke="#dc2626"
                    strokeWidth="0.8"
                    opacity={progress >= 90 ? 1 : 0}
                    className="transition-opacity duration-300"
                  />

                  <line
                    x1="20"
                    y1="270"
                    x2="330"
                    y2="270"
                    stroke="#dc2626"
                    strokeWidth="0.8"
                    opacity={progress >= 92 ? 1 : 0}
                    className="transition-opacity duration-300"
                  />

                  {/* Measurement Text */}
                  <text
                    x="8"
                    y="145"
                    fill="#dc2626"
                    fontSize="9"
                    textAnchor="middle"
                    transform="rotate(-90, 8, 145)"
                    opacity={progress >= 95 ? 1 : 0}
                    className="transition-opacity duration-300 font-mono"
                  >
                    12.0m
                  </text>

                  <text
                    x="175"
                    y="285"
                    fill="#dc2626"
                    fontSize="9"
                    textAnchor="middle"
                    opacity={progress >= 97 ? 1 : 0}
                    className="transition-opacity duration-300 font-mono"
                  >
                    15.5m
                  </text>

                  {/* Room Labels */}
                  <text
                    x="75"
                    y="50"
                    fill="#64748b"
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
                    fill="#64748b"
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
                    fill="#64748b"
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
                    fill="#64748b"
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

        {/* Progress Information */}
        <div className="mt-8 text-center">
          <div className="text-slate-700 text-xl font-light mb-4 tracking-widest animate-pulse">
            {/* {phaseLabels[currentPhase]} */}
            Loading...
          </div>

          {/* Progress Bar */}
          {/* <div className="w-96 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-slate-600 to-slate-800 transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-slate-500 text-sm mt-3 font-mono">
            {Math.round(progress)}%
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ArchitecturalLoader;
