"use client";

import { useEffect, useRef, useState } from "react";

export default function AutoCADCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.maxTouchPoints > 0
    );
  }, []);

  useEffect(() => {
    // Mutate the DOM directly instead of going through React state, so
    // moving the mouse doesn't trigger a re-render on every event.
    const move = (e: MouseEvent): void => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
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
      ref={cursorRef}
      className={`${
        isTouch ? "hidden" : "block"
      } pointer-events-none fixed top-0 left-0 z-[9999]`}
    >
      {/* Main Crosshair */}
      <div className="w-12 h-12 -translate-x-1/2 -translate-y-1/2 relative">
        {/* Horizontal line */}
        <div
          className={`absolute top-1/2 left-0 h-px w-full ${
            isClicking ? "bg-carbon" : "bg-copper"
          }`}
        />
        {/* Vertical line */}
        <div
          className={`absolute left-1/2 top-0 w-px h-full  ${
            isClicking ? "bg-carbon" : "bg-copper"
          }`}
        />
        {/* Center dot */}
        <div
          className={`absolute left-1/2 top-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full ${
            isClicking ? "bg-carbon" : "bg-copper"
          }`}
        />
        {/* Tick marks */}
        <div className="absolute left-1/2 top-0 w-px h-1 bg-copper" />
        <div className="absolute left-1/2 bottom-0 w-px h-1 bg-copper" />
        <div className="absolute top-1/2 left-0 h-px w-1 bg-copper" />
        <div className="absolute top-1/2 right-0 h-px w-1 bg-copper" />
        {/* Outer circle (only visible when clicking) */}
        {isClicking && (
          <div className="absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 border border-black rounded-full animate-ping opacity-50" />
        )}
        {/* Coordinates display (AutoCAD-like) */}
        {/* Hidden Right Now */}
        {/* <div className="absolute top-6 left-6 text-xs text-red-400 whitespace-nowrap bg-white/30 bg-opacity-80 px-1 rounded">
          X:{Math.round(position.x)} Y:{Math.round(position.y)}
        </div> */}
      </div>
    </div>
  );
}
