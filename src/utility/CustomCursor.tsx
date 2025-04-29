"use client";

import { useEffect, useState } from "react";

export default function AutoCADCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent): void => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {/* Main Crosshair */}
      <div className="w-12 h-12 -translate-x-1/2 -translate-y-1/2 relative">
        {/* Horizontal line */}
        <div className="absolute top-1/2 left-0 h-px w-full bg-blue-500" />

        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 w-px h-full bg-blue-500" />

        {/* Center dot */}
        <div
          className={`absolute left-1/2 top-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full ${
            isClicking ? "bg-red-500" : "bg-blue-500"
          }`}
        />

        {/* Tick marks */}
        <div className="absolute left-1/2 top-0 w-px h-1 bg-blue-500" />
        <div className="absolute left-1/2 bottom-0 w-px h-1 bg-blue-500" />
        <div className="absolute top-1/2 left-0 h-px w-1 bg-blue-500" />
        <div className="absolute top-1/2 right-0 h-px w-1 bg-blue-500" />

        {/* Outer circle (only visible when clicking) */}
        {isClicking && (
          <div className="absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 border border-red-500 rounded-full animate-ping opacity-50" />
        )}

        {/* Coordinates display (AutoCAD-like) */}
        <div className="absolute top-6 left-6 text-xs text-blue-500 whitespace-nowrap bg-white bg-opacity-80 px-1 rounded">
          X:{Math.round(position.x)} Y:{Math.round(position.y)}
        </div>
      </div>
    </div>
  );
}
