"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, X, Loader2 } from "lucide-react";

function FrameView() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const loadTimeoutRef = useRef(null);

  // Handle iframe load
  const handleLoad = () => {
    setIsLoading(false);
    setLoadError(false);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  };

  // Set a timeout for loading (fallback)
  useEffect(() => {
    loadTimeoutRef.current = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        console.warn("360 tour took too long to load, removing loading screen");
      }
    }, 8000); // 8 second timeout

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [isLoading]);

  // Handle iframe error
  const handleError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  // Browser-level fullscreen API
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      try {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current.webkitRequestFullscreen) {
          await containerRef.current.webkitRequestFullscreen();
        } else if (containerRef.current.mozRequestFullScreen) {
          await containerRef.current.mozRequestFullScreen();
        } else if (containerRef.current.msRequestFullscreen) {
          await containerRef.current.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    } else {
      // Exit fullscreen
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
        setIsFullscreen(false);
      } catch (err) {
        console.error("Error attempting to exit fullscreen:", err);
      }
    }
  };

  // Listen for fullscreen changes (user pressing ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-800 ${
        isFullscreen ? "fullscreen-container" : ""
      }`}
    >
      {/* Header Overlay - Hidden in fullscreen */}
      {!isFullscreen && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 via-black/50 to-transparent backdrop-blur-sm p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-light text-white mb-1">
                360° Virtual Tour
              </h1>
              <p className="text-xs md:text-sm text-zinc-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-copper rounded-full animate-pulse"></span>
                Interactive Experience
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="flex items-center gap-2 bg-copper hover:bg-copper/90 text-white px-4 md:px-6 py-2 md:py-3 transition-all duration-300 shadow-lg hover:shadow-xl rounded-sm"
            >
              <Maximize2 size={18} />
              <span className="hidden md:inline">Fullscreen</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Fullscreen Exit Button - Only visible in fullscreen */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullscreen}
            className="absolute top-6 right-6 z-50 bg-copper hover:bg-copper/90 text-white p-3 rounded-full shadow-2xl transition-all duration-300 group"
          >
            <Minimize2
              size={24}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && !loadError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-30 bg-gradient-to-br from-zinc-900 to-zinc-800 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
            >
              {/* Animated logo/icon */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-16 h-16 mx-auto border-4 border-copper border-t-transparent rounded-full"
              />

              <div>
                <h2 className="text-xl md:text-2xl font-light text-white mb-3">
                  Loading Virtual Tour
                </h2>
                <p className="text-zinc-400 text-sm">
                  Preparing your immersive experience...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {loadError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-gradient-to-br from-zinc-900 to-zinc-800 flex flex-col items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center max-w-md"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <X size={32} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-light text-white mb-3">
                Unable to Load Tour
              </h2>
              <p className="text-zinc-400 text-sm mb-6">
                The 360° virtual tour couldn&apos;t be loaded. Please check your
                internet connection and try again.
              </p>
              <button
                onClick={() => {
                  setLoadError(false);
                  setIsLoading(true);
                  if (iframeRef.current) {
                    iframeRef.current.src = iframeRef.current.src;
                  }
                }}
                className="bg-copper hover:bg-copper/90 text-white px-6 py-3 rounded-sm transition-all duration-300"
              >
                Retry
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iframe Container with Reveal Animation */}
      <motion.div
        initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
        animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
        transition={{
          duration: 1.5,
          delay: 0.5,
          ease: [0.65, 0, 0.35, 1],
        }}
        className="relative w-full h-full"
      >
        <iframe
          ref={iframeRef}
          src="https://jjarchitects-360-tour-01.netlify.app/"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full border-none ${
            isFullscreen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          title="360° Virtual Tour"
          allow="accelerometer; gyroscope; vr; fullscreen"
          loading="eager"
        />
      </motion.div>

      {/* Bottom Info Bar - Hidden in fullscreen */}
      {!isFullscreen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-sm p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-zinc-300">
            <p className="flex items-center gap-2">
              <span className="hidden md:inline">💡</span>
              Enter Full Screen to explore
            </p>
            <div className="flex items-center gap-4 md:gap-6">
              <span className="hidden sm:inline">HD Quality</span>
              <span className="sm:hidden">HD</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Decorative corner elements - Hidden in fullscreen */}
      {!isFullscreen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute top-16 md:top-20 left-4 md:left-8 w-8 h-8 md:w-12 md:h-12 border-t-2 border-l-2 border-copper pointer-events-none"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="absolute top-16 md:top-20 right-4 md:right-8 w-8 h-8 md:w-12 md:h-12 border-t-2 border-r-2 border-copper pointer-events-none"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-16 md:bottom-20 left-4 md:left-8 w-8 h-8 md:w-12 md:h-12 border-b-2 border-l-2 border-copper pointer-events-none"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="absolute bottom-16 md:bottom-20 right-4 md:right-8 w-8 h-8 md:w-12 md:h-12 border-b-2 border-r-2 border-copper pointer-events-none"
          />
        </>
      )}

      {/* Fullscreen hint tooltip */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs z-40"
        >
          Press ESC to exit fullscreen
        </motion.div>
      )}

      {/* Global styles for fullscreen */}
      <style jsx global>{`
        .fullscreen-container {
          width: 100vw !important;
          height: 100vh !important;
        }

        /* Hide scrollbars in fullscreen */
        .fullscreen-container::-webkit-scrollbar {
          display: none;
        }

        .fullscreen-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
}

export default FrameView;
