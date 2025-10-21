"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Maximize2,
  MousePointer2,
  Move,
} from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import projects from "@/data/projectsData.json";
import testimonialsData from "@/data/testimonialsData.json";
import businessData from "@/data/businessData.json";
import SocialMedia from "@/components/SocialMedia";
import { useRouter } from "next/navigation";
import FrameView from "@/components/FrameView";

export default function Home() {
  const router = useRouter();
  const [hoveredImage, setHoveredImage] = useState<
    null | "image1" | "image2" | "image3" | "image4"
  >(null);
  const [featuredProjects] = useState<Project[]>(
    projects.filter((project) => project.featured).slice(0, 5) as Project[]
  );
  const [activeProject, setActiveProject] = useState(featuredProjects[0].id);

  const heroRef = useRef(null);
  const projectsRef = useRef<HTMLElement>(null);

  const containerRef = useRef(null);

  // Track scroll progress of this specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth width expansion
  const width = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["45%", "70%", "100%", "100%", "100%"]
  );

  // Subtle scale with smoother curve
  const scale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0.92, 0.96, 1, 1, 0.98]
  );

  // Opacity with longer fade
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.4, 1, 1, 0.6]
  );

  // Border radius - smooth transition
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5],
    ["32px", "12px", "0px"]
  );

  // Y-axis movement for floating effect
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -50]);

  // Header opacity - fades out as section expands
  const headerOpacity = useTransform(scrollYProgress, [0, 0.42], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -30]);

  // Instructions fade based on scroll
  const instructionsOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.6],
    [1, 1, 1, 0]
  );

  // Progress indicator
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Parallax transforms for different speeds
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, 20]);

  const goToAbout = () => {
    router.push("/about");
  };

  // Auto-rotate featured projects
  useEffect(() => {
    if (featuredProjects.length === 0) return;

    let index = 0;

    const interval = setInterval(() => {
      setActiveProject(featuredProjects[index].id);
      index = (index + 1) % featuredProjects.length;
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProjects]);

  // Smooth scroll to projects
  const scrollToProjects = () => {
    if (projectsRef.current) {
      projectsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Animation variants
  const heroContentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        delay: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const heroImageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        delay: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fadeInLeftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fadeInRightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const staggerItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Scroll indicator bounce animation
  const scrollIndicatorVariants = {
    animate: {
      y: [0, 10, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <main className="bg-white text-carbon">
      {/* Hero Section with Split Layout */}
      <section
        ref={heroRef}
        className="min-h-screen relative flex flex-col lg:flex-row overflow-hidden"
      >
        {/* Left Column */}
        <div className="absolute top-0 left-0 w-full lg:w-4/12 md:h-screen z-10 flex items-center justify-center p-8">
          <motion.div
            variants={heroContentVariants}
            initial="hidden"
            animate="visible"
            className="hero-content"
          >
            <div className="max-w-xl">
              <h1 className="text-5xl md:text-5xl xlg:!text-7xl font-light tracking-tighter mb-6 leading-tight text-carbon-300">
                REDEFINING <br />
                <span>ARCHITECTURAL</span>
                <br />
                BOUNDARIES
              </h1>
              <div className="w-16 h-1 bg-copper mb-8"></div>
              <div className="h-5 md:h-[40px]"></div>
              <div className="flex space-x-6">
                <button
                  onClick={scrollToProjects}
                  className="border-b-2 border-carbon pb-1 pr-1 flex items-center gap-2 hover:border-copper hover:text-copper transition-all duration-300"
                >
                  View Projects <ArrowRight size={16} />
                </button>
                <button
                  onClick={goToAbout}
                  className="border-b-2 border-transparent pb-1 pr-1 flex items-center gap-2 hover:border-copper hover:text-copper transition-all duration-300"
                >
                  About Studio <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Visual Elements */}
        <div className="absolute top-[45%] md:top-0 h-1/2 md:right-0 w-full lg:w-8/12 md:h-screen bg-taupe-100/30 overflow-hidden">
          {/* Abstract Architectural Elements with Parallax */}
          <motion.div
            initial={{ opacity: 0, y: 100 }} // Coming from bottom
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: parallaxY1 }}
            className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 border-2 border-copper"
          />
          <motion.div
            initial={{ opacity: 0, y: -100 }} // Coming from top
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: parallaxY2 }}
            className="absolute top-1/3 right-1/4 w-32 h-32 md:w-80 md:h-80 bg-taupe-300"
          />

          {/* Main Image - Delayed after boxes */}
          <div className="absolute bottom-[21rem] md:bottom-0 md:right-0 inset-0 flex items-center justify-center">
            <motion.div
              initial={{
                clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", // Start as vertical line on left
                opacity: 0,
                scale: 1.05,
              }}
              animate={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", // Expand to full width
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1.8,
                delay: 1.2, // Starts AFTER boxes settle (0.3 + 1.2 = 1.5s total)
                ease: [0.65, 0, 0.35, 1],
                opacity: { duration: 1.5, delay: 1.2 },
                scale: { duration: 2, delay: 1.2 },
              }}
              className="hero-image-container bg-white/60 mt-0 md:mt-0 relative w-full h-full md:w-5/5 md:h-full overflow-hidden"
            >
              <motion.img
                initial={{
                  scale: 1.15,
                  filter: "blur(10px) brightness(1.2)",
                }}
                animate={{
                  scale: 1,
                  filter: "blur(0px) brightness(1)",
                }}
                transition={{
                  duration: 2.2,
                  delay: 1.5, // Starts slightly after container
                  ease: [0.22, 1, 0.36, 1],
                }}
                src={`/assets/home_sketch.png`}
                alt="Architectural sketch"
                className="object-contain select-none pointer-events-none p-4 md:p-0 grayscale opacity-80"
              />
            </motion.div>

            {/* Subtle reveal line effect */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 0] }}
              transition={{
                duration: 1.8,
                delay: 1.2,
                ease: [0.65, 0, 0.35, 1],
                opacity: { duration: 1.8, times: [0, 0.3, 1] },
              }}
              className="absolute inset-0 border-l-4 border-copper origin-left pointer-events-none"
              style={{ width: "2px", left: 0 }}
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          variants={scrollIndicatorVariants}
          animate="animate"
          onClick={scrollToProjects}
          className="absolute bottom-18 left-1/2 transform -translate-x-1/2 flex-col items-center z-20 hidden md:flex cursor-pointer"
        >
          <p className="text-xs tracking-widest mb-1 opacity-70">SCROLL</p>
          <ChevronDown size={20} className="scroll-indicator opacity-70" />
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <section
        ref={projectsRef}
        className="py-32 px-8 bg-gradient-to-b from-zinc-50 to-white mb-[12rem]"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUpVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-16"
          >
            {/* Left Column - Project Navigation */}
            <div className="lg:col-span-5">
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-px bg-copper"></div>
                  <span className="text-sm font-medium tracking-wider text-copper uppercase">
                    Featured Work
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {featuredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`group p-6 transition-all duration-500 ease-out border-l-4 shadow-md cursor-pointer ${
                      activeProject === project.id
                        ? "bg-taupe-200 shadow-xl shadow-zinc-200 border-l-copper border-r border-t border-b border-carbon-100"
                        : "hover:bg-zinc-100/50 hover:shadow-lg border-l-zinc-200 hover:border-l-zinc-300"
                    }`}
                    onClick={() => setActiveProject(project.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-zinc-400">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <div
                          className={`w-16 h-px transition-all duration-300 ${
                            activeProject === project.id
                              ? "bg-copper"
                              : "bg-zinc-200 group-hover:bg-zinc-300"
                          }`}
                        ></div>
                      </div>
                      <div
                        className={`w-2 h-2 transition-all duration-300 ${
                          activeProject === project.id
                            ? "bg-copper shadow-lg shadow-copper/30"
                            : "bg-zinc-300 group-hover:bg-zinc-400"
                        }`}
                      ></div>
                    </div>

                    <h3
                      className={`text-xl md:text-2xl font-light mb-4 transition-colors duration-300 ${
                        activeProject === project.id
                          ? "text-zinc-900"
                          : "text-zinc-700 group-hover:text-zinc-900"
                      }`}
                    >
                      {project.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-zinc-400 mb-1 text-xs uppercase tracking-wide">
                          Category
                        </p>
                        <p className="text-zinc-600 font-medium">
                          {project.type}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-400 mb-1 text-xs uppercase tracking-wide">
                          Year
                        </p>
                        <p className="text-zinc-600 font-medium">
                          {project.year}
                        </p>
                      </div>
                    </div>

                    <motion.div
                      initial={false}
                      animate={{
                        height: activeProject === project.id ? "auto" : 0,
                        opacity: activeProject === project.id ? 1 : 0,
                      }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-zinc-600 font-light leading-relaxed mb-4">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-zinc-400 text-sm">
                          {project.location}
                        </p>
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-copper hover:text-copper-600 flex items-center gap-2 group/link font-medium text-sm"
                        >
                          View Project
                          <ArrowRight
                            size={16}
                            className="group-hover/link:translate-x-1 transition-transform duration-300"
                          />
                        </Link>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column - Project Image Display */}
            <div className="lg:col-span-7 lg:sticky lg:top-5 h-fit">
              <div className="h-screen flex items-center">
                <div className="relative w-full h-[80vh] overflow-hidden shadow-2xl shadow-zinc-900/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200"></div>

                  {featuredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{
                        opacity: activeProject === project.id ? 1 : 0,
                        scale: activeProject === project.id ? 1 : 1.05,
                      }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority={activeProject === project.id}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-carbon-500/50 via-transparent to-transparent"></div>

                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="bg-carbon/60 backdrop-blur-sm shadow-lg p-6">
                          <h4 className="text-xl font-light text-white mb-2">
                            {project.title}
                          </h4>
                          <p className="text-carbon-200 text-sm">
                            {project.type} • {project.year}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                  <div className="flex justify-center gap-3 mt-8">
                    {featuredProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => setActiveProject(project.id)}
                        className={`w-2 h-2 transition-all duration-300 ${
                          activeProject === project.id
                            ? "bg-copper w-8"
                            : "bg-zinc-300 hover:bg-zinc-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 360 View Frame */}
      <section
        ref={containerRef}
        className="relative min-h-full  md:min-h-[160vh] flex items-center justify-center bg-gradient-to-b from-zinc-50 via-white to-zinc-50 overflow-hidden"
      >
        {/* Ambient background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-copper/5 via-transparent to-transparent" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                       linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Floating Header */}
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="absolute top-24 left-1/2 transform -translate-x-1/2 text-center z-20 pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-12 h-px bg-gradient-to-r from-transparent via-copper to-transparent"
              />
              <span className="text-xs tracking-[0.3em] text-copper uppercase font-medium">
                Immersive Experience
              </span>
              <motion.div
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-12 h-px bg-gradient-to-r from-copper via-copper to-transparent"
              />
            </div>
            <h2 className="text-4xl md:text-6xl font-extralight text-zinc-800 tracking-tight">
              Step Inside
            </h2>
            <p className="text-zinc-500 mt-3 text-sm font-light tracking-wide">
              Navigate through space in stunning detail
            </p>
          </motion.div>
        </motion.div>

        {/* Main Container - Sticky positioning */}
        <div className="sticky top-0 w-full h-screen flex items-center justify-center px-4 md:px-8">
          <motion.div
            style={{
              width,
              scale,
              opacity,
              borderRadius,
              y,
            }}
            className="relative mx-auto shadow-2xl shadow-zinc-900/20 bg-white"
          >
            {/* Aspect ratio wrapper */}
            <div
              className="relative w-full overflow-hidden"
              style={{ paddingBottom: "56.25%" }}
            >
              {/* Iframe container */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800">
                <FrameView />
              </div>

              {/* Progress dots indicator */}
              <motion.div
                style={{ opacity: instructionsOpacity }}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 pointer-events-none"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    style={{
                      scale: useTransform(
                        scrollYProgress,
                        [i * 0.1, (i + 1) * 0.1],
                        [1, 1.4]
                      ),
                      opacity: useTransform(
                        scrollYProgress,
                        [i * 0.1, (i + 1) * 0.1, (i + 2) * 0.1],
                        [0.3, 1, 0.3]
                      ),
                    }}
                    className="w-1.5 h-1.5 rounded-full bg-white shadow-lg"
                  />
                ))}
              </motion.div>

              {/* Top progress bar */}
              <motion.div
                style={{
                  opacity: useTransform(scrollYProgress, [0.4, 0.6], [0, 1]),
                }}
                className="absolute top-0 left-0 right-0 h-1 bg-zinc-800/20"
              >
                <motion.div
                  style={{ width: progressWidth }}
                  className="h-full bg-gradient-to-r from-copper via-amber-500 to-copper"
                />
              </motion.div>

              {/* Corner accent elements - visible when expanded */}
              <motion.div
                style={{
                  opacity: useTransform(scrollYProgress, [0.4, 0.6], [0, 0.4]),
                }}
                className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-copper pointer-events-none"
              />
              <motion.div
                style={{
                  opacity: useTransform(scrollYProgress, [0.4, 0.6], [0, 0.4]),
                }}
                className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-copper pointer-events-none"
              />
              <motion.div
                style={{
                  opacity: useTransform(scrollYProgress, [0.4, 0.6], [0, 0.4]),
                }}
                className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-copper pointer-events-none"
              />
              <motion.div
                style={{
                  opacity: useTransform(scrollYProgress, [0.4, 0.6], [0, 0.4]),
                }}
                className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-copper pointer-events-none"
              />
            </div>
          </motion.div>
        </div>

        {/* Side navigation indicators */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0.3, 0.5], [0, 1]),
          }}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden xl:block pointer-events-none"
        >
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                style={{
                  height: useTransform(
                    scrollYProgress,
                    [0.3 + i * 0.1, 0.4 + i * 0.1],
                    [8, 24]
                  ),
                  backgroundColor: useTransform(
                    scrollYProgress,
                    [0.3 + i * 0.1, 0.4 + i * 0.1],
                    ["rgba(212, 165, 116, 0.3)", "rgba(212, 165, 116, 1)"]
                  ),
                }}
                className="w-1 rounded-full transition-all"
              />
            ))}
          </div>
        </motion.div>

        {/* Right side text */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0.3, 0.5], [0, 1]),
            x: useTransform(scrollYProgress, [0.3, 0.5], [50, 0]),
          }}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 hidden xl:block pointer-events-none"
        >
          <div className="text-xs text-zinc-400 tracking-[0.3em] [writing-mode:vertical-lr] rotate-180">
            INTERACTIVE TOUR
          </div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="relative py-20 md:py-40">
        <div className="absolute inset-0 z-0">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            <div className="bg-gray-50"></div>
            <div className="bg-white"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            <motion.div
              variants={fadeInLeftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="md:col-span-5 philosophy-text"
            >
              <div className="mb-8 md:mb-12">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="w-8 h-px bg-copper"></div>
                  <span className="text-sm tracking-widest text-copper">
                    OUR APPROACH
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-4 md:mb-8">
                  Design Philosophy
                </h2>
              </div>

              <div className="space-y-4 md:space-y-8 text-justify">
                <p
                  className={`transition-all duration-300 p-3 ${
                    hoveredImage === "image1"
                      ? "bg-copper text-white shadow-lg"
                      : ""
                  }`}
                >
                  We organize spaces through deliberate proximity, allowing
                  related functions to support each other naturally. Gathering
                  points are not afterthoughts; they are connectors —
                  transitional and social anchors that enrich the spatial
                  narrative.
                </p>

                <p
                  className={`transition-all duration-300 p-3 ${
                    hoveredImage === "image3"
                      ? "bg-copper text-white shadow-lg"
                      : ""
                  }`}
                >
                  Beneath the auditorium, what could have been an idle void
                  becomes a deliberate gesture — a porch that invites pause,
                  interaction, and connection. We believe even the underside of
                  architecture holds potential, and when shaped with intent,
                  every shadow can serve a purpose.
                </p>

                <p
                  className={`transition-all duration-300 p-3 ${
                    hoveredImage === "image2"
                      ? "bg-copper text-white shadow-lg"
                      : ""
                  }`}
                >
                  We use architectural elements like colonnades not merely as
                  stylistic choices, but as tools to define boundaries, control
                  visibility, and mediate relationships between users and space.
                  Every line drawn, every void created, is intentional — serving
                  both purpose and perception.
                </p>

                <p
                  className={`transition-all duration-300 ${
                    hoveredImage === "image4"
                      ? "bg-copper text-white font-semibold p-4 shadow-lg transform"
                      : ""
                  }`}
                >
                  Our work reflects a balance between openness and order,
                  movement and pause — where structure guides, but does not
                  dictate. Always, our aim is to design with meaning, clarity,
                  and enduring simplicity.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="md:col-span-7 md:col-start-6 philosophy-images mt-8 md:mt-0"
            >
              <div className="grid grid-cols-12 gap-3 md:gap-6">
                <motion.div
                  variants={staggerItemVariants}
                  className="col-span-8 relative aspect-square duration-300 hover:contrast-110"
                  onMouseEnter={() => setHoveredImage("image1")}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <Image
                    src="/assets/project_4.jpg"
                    alt="Architectural detail"
                    fill
                    className="object-cover z-1 hover:scale-105 duration-300 border-2 border-carbon-300"
                  />
                  <div className="absolute -bottom-2 -right-2 w-56 h-44 bg-copper"></div>
                </motion.div>

                <motion.div
                  variants={staggerItemVariants}
                  className="col-span-4 relative aspect-square duration-300 hover:contrast-110"
                  onMouseEnter={() => setHoveredImage("image2")}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <Image
                    src="/assets/project_2.jpg"
                    alt="Material study"
                    fill
                    className="object-cover hover:scale-105 duration-300 border-l-2 border-b-2 border-carbon-300"
                  />
                </motion.div>

                <motion.div
                  variants={staggerItemVariants}
                  className="col-span-4 relative aspect-square md:m-0 mt-2"
                >
                  <div className="absolute inset-0 border-2 border-carbon-300"></div>
                  <div className="absolute inset-2 sm:inset-4 md:inset-6 bg-gray-100 flex items-center justify-center p-2 sm:p-4">
                    <p className="text-sm sm:text-base md:text-lg font-light italic text-center">
                      &quot;Architecture is the thoughtful making of
                      space.&quot;
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={staggerItemVariants}
                  className="col-span-8 relative md:m-0 mt-2 duration-300 hover:contrast-110"
                  onMouseEnter={() => setHoveredImage("image3")}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <Image
                    src="/assets/project_1.jpg"
                    alt="Design process"
                    fill
                    className="object-cover hover:scale-105 duration-300 border-t-2 border-l-2 border-carbon-300"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials - Infinite Marquee */}
      <section className="py-24 overflow-hidden">
        <motion.div
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mb-16 px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-copper"></div>
              <span className="text-sm tracking-widest text-copper">
                RECOGNITION & PRAISE
              </span>
            </div>
            <h2 className="text-4xl font-light tracking-tight">
              What Clients Say
            </h2>
          </div>
        </motion.div>

        <div className="relative whitespace-nowrap overflow-hidden pb-8">
          <motion.div
            animate={{
              x: ["0%", "-50%"], // Changed order: start at 0%, move to -50%
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 60,
                ease: "linear",
              },
            }}
            className="inline-flex gap-8"
          >
            {/* Render testimonials twice for seamless loop */}
            {[...testimonialsData, ...testimonialsData].map(
              (testimonial, idx) => (
                <div
                  key={`testimonial-${idx}`}
                  className="w-72 whitespace-normal inline-block flex-shrink-0"
                >
                  <div className="border h-[330px] border-gray-200 p-8 hover:border-copper hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl font-light mb-4 text-copper">
                      0{testimonial.id}
                    </div>
                    <h3 className="text-xl font-light mb-2">
                      {testimonial.name}
                    </h3>
                    <p className="text-[12px] leading-5 text-gray-600 mb-4">
                      {testimonial.title}
                    </p>
                    <p className="text-sm font-light leading-relaxed">
                      {testimonial.testimonial}
                    </p>
                  </div>
                </div>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative py-16 sm:py-24 md:py-32">
        <div className="absolute inset-0 z-0">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            <div className="bg-taupe-100"></div>
            <div className="bg-white hidden md:block"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <motion.div
              variants={fadeInLeftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-light text-carbon mb-4 md:mb-8 leading-tight">
                Ready to create something extraordinary?
              </h2>
              <div className="w-16 h-1 bg-copper mb-4 md:mb-8"></div>
              <p className="text-base sm:text-lg font-light text-carbon-300 mb-6 md:mb-12 max-w-md">
                Let&apos;s collaborate on your next architectural vision and
                push the boundaries of what&apos;s possible.
              </p>
              <Link
                href="/contact"
                className="bg-copper text-white px-8 py-3 md:px-12 md:py-4 hover:bg-copper-600 transition-all duration-300 flex items-center gap-3 w-fit"
              >
                Get in Touch <ExternalLink size={18} />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInRightVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex items-center justify-center bg-white text-carbon md:bg-transparent p-6 md:p-0 mt-8 md:mt-0"
            >
              <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-md">
                <div className="col-span-2">
                  <p className="text-base md:text-lg font-light mb-2">
                    Visit Us
                  </p>
                  <a
                    href={`${businessData.contactDetails.address_link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm"
                  >
                    <address className="not-italic">
                      {businessData.contactDetails.address.street}, <br />
                      {businessData.contactDetails.address.landmark},{" "}
                      {businessData.contactDetails.address.city},{" "}
                      {businessData.contactDetails.address.state}{" "}
                      {businessData.contactDetails.address.pinCode}
                    </address>
                  </a>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-base md:text-lg font-light mb-2">Email</p>
                  <a
                    href={`mailto:${businessData.contactDetails.email}`}
                    className="text-sm"
                  >
                    {businessData.contactDetails.email}
                  </a>
                </div>
                <div>
                  <p className="text-base md:text-lg font-light mb-2">Phone</p>
                  <a
                    href={`tel:${businessData.contactDetails.phone}`}
                    className="text-sm"
                  >
                    {businessData.contactDetails.phone}
                  </a>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <SocialMedia />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Custom CSS */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 640px) {
          .hero-content {
            padding: 0 1rem;
          }
        }
      `}</style>
    </main>
  );
}
