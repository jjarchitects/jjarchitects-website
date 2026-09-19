"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  easeInOut,
} from "framer-motion";
import Link from "next/link";
import projects from "@/data/projectsData.json";
import testimonialsData from "@/data/testimonialsData.json";
import businessData from "@/data/businessData.json";
import SocialMedia from "@/components/SocialMedia";
import FrameView from "@/components/FrameView";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

type Project = {
  id: string;
  featured?: boolean;
  thumbnail: string;
  title: string;
  description: string;
  type: string;
  location?: string;
};

function InstructionDot({
  i,
  scrollYProgress,
}: {
  i: number;
  scrollYProgress: MotionValue<number>;
}) {
  // Hook-safe (component owns hooks; not inside a loop in parent)
  const scale = useTransform(
    scrollYProgress,
    [i * 0.1, (i + 1) * 0.1],
    [1, 1.4],
  );
  const opacity = useTransform(
    scrollYProgress,
    [i * 0.1, (i + 1) * 0.1, (i + 2) * 0.1],
    [0.3, 1, 0.3],
  );

  return (
    <motion.div
      style={{ scale, opacity }}
      className="w-1.5 h-1.5 rounded-full bg-white shadow-lg"
    />
  );
}

function CornerGuide({
  i,
  scrollYProgress,
  className,
}: {
  i: number;
  scrollYProgress: MotionValue<number>;
  className: string;
}) {
  const opacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 0.4]);

  return <motion.div key={i} style={{ opacity }} className={className} />;
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonialsData)[number];
}) {
  return (
    <div className="w-72 whitespace-normal inline-block flex-shrink-0">
      <div className="border h-[330px] border-gray-200 p-8 hover:border-copper hover:shadow-lg transition-all duration-300">
        <div className="text-3xl font-light mb-4 text-copper">
          0{testimonial.id}
        </div>
        <h3 className="text-xl font-light mb-2">{testimonial.name}</h3>
        <p className="text-[12px] leading-5 text-gray-600 mb-4">
          {testimonial.title}
        </p>
        <p className="text-sm font-light leading-relaxed">
          {testimonial.testimonial}
        </p>
      </div>
    </div>
  );
}

function ProgressSidebarBar({
  i,
  scrollYProgress,
}: {
  i: number;
  scrollYProgress: MotionValue<number>;
}) {
  const height = useTransform(
    scrollYProgress,
    [0.3 + i * 0.1, 0.4 + i * 0.1],
    [8, 24],
  );
  const backgroundColor = useTransform(
    scrollYProgress,
    [0.3 + i * 0.1, 0.4 + i * 0.1],
    ["rgba(212, 165, 116, 0.3)", "rgba(212, 165, 116, 1)"],
  );

  return (
    <motion.div
      style={{ height, backgroundColor }}
      className="w-1 rounded-full transition-all"
    />
  );
}

export default function Home() {
  const [hoveredImage, setHoveredImage] = useState<
    null | "image1" | "image2" | "image3" | "image4"
  >(null);

  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(() => {
    return (projects as Project[]).filter((p) => p.featured).slice(0, 10);
  });

  useEffect(() => {
    let isMounted = true;
    fetch("/api/projects?featured=true")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.projects && data.projects.length > 0) {
          setFeaturedProjects(data.projects);
        }
      })
      .catch((err) => {
        console.error("Failed to load dynamic featured projects:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const staggerItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: easeInOut,
      },
    },
  };

  // Scroll progress for 360 section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // 360 section transforms
  const width = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["45%", "70%", "100%", "100%", "100%"],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0.92, 0.96, 1, 1, 0.98],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.4, 1, 1, 0.6],
  );
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5],
    ["32px", "12px", "0px"],
  );
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.42], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -30]);
  const instructionsOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.6],
    [1, 1, 1, 0],
  );
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const scrollToNextSection = () => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleAutoplay = () => {
    if (!swiperInstance) return;
    if (isAutoplay) swiperInstance.autoplay.stop();
    else swiperInstance.autoplay.start();
    setIsAutoplay((v) => !v);
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const slideUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeInOut },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easeInOut },
    },
  };

  const fadeInLeftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: easeInOut },
    },
  };

  const fadeInRightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: easeInOut },
    },
  };

  const scrollIndicatorVariants = {
    animate: {
      y: [0, 10, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <main className="bg-white text-carbon w-full overflow-x-hidden">
      {/* Hero Carousel Section */}
      <section
        ref={heroRef}
        className="relative w-full h-[calc(100vh-60px)] overflow-hidden"
      >
        <Swiper
          key={featuredProjects.map((p) => p.id).join("-") || "hero-swiper"}
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          speed={1200}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet-custom",
            bulletActiveClass: "swiper-pagination-bullet-active-custom",
          }}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
          className="h-full w-full"
        >
          {featuredProjects.map((project, index) => (
            <SwiperSlide key={project.id}>
              <div className="relative h-full w-full">
                {/* Static Background - No Framer Motion */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    priority={index === 0}
                    loading={index === 0 ? undefined : "lazy"}
                    sizes="100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/75 to-transparent" />
                </div>

                {/* Content - Simplified Animations */}
                <div className="relative h-full flex items-center z-10">
                  <div className="container mx-auto px-8 md:px-16 lg:px-24">
                    <div className="max-w-3xl">
                      {/* Subtitle with floating line */}
                      <div className="flex items-center gap-3 mb-6 animate-fadeInUp">
                        <div className="w-16 h-px bg-gradient-to-r from-copper to-transparent" />
                        <span className="text-copper text-sm tracking-[0.3em] uppercase font-medium">
                          {project.type}
                        </span>
                      </div>

                      {/* Title */}
                      <h1 className="text-5xl md:text-5xl lg:text-6xl font-light text-carbon-500 mb-6 tracking-tight leading-none animate-fadeInUp animation-delay-200">
                        {project.title}
                      </h1>

                      {/* Description */}
                      <p className="text-lg md:text-xl text-carbon-400 mb-8 font-light leading-relaxed max-w-2xl animate-fadeInUp animation-delay-400">
                        {project.description}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-6 mb-10 text-sm text-carbon-300 animate-fadeInUp animation-delay-600">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-copper" />
                          <span>{project.location}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex flex-wrap gap-4 animate-fadeInUp animation-delay-800">
                        <Link
                          href="/projects"
                          className="group bg-copper hover:bg-copper-600 text-white px-8 py-4 flex items-center gap-3 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-102"
                        >
                          <span>View Projects</span>
                          <ArrowRight
                            className="group-hover:translate-x-1 transition-transform"
                            size={20}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute top-12 right-12 z-10 pointer-events-none hidden lg:block">
                  <div className="w-32 h-32 border-2 border-copper/30 rounded-full animate-pulse-slow" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Enhanced Navigation Controls - Keep as is */}
        <motion.div
          className="absolute bottom-10 left-0 right-0 z-20 pointer-events-none"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="container mx-auto px-8 md:px-16 lg:px-24">
            <div className="flex items-end justify-between">
              {/* Slide Counter */}
              <motion.div
                className="pointer-events-auto"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
              >
                <div className="flex items-center gap-4 text-carbon-400">
                  <div className="text-4xl font-light">
                    {String(currentSlide + 1).padStart(2, "0")}
                  </div>
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-copper to-transparent" />
                  <div className="text-lg text-carbon-200">
                    {String(featuredProjects.length).padStart(2, "0")}
                  </div>
                </div>
              </motion.div>

              {/* Glassmorphism Controls */}
              <motion.div
                className="flex items-center gap-4 pointer-events-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleAutoplay}
                  aria-label={isAutoplay ? "Pause slideshow" : "Play slideshow"}
                  aria-pressed={isAutoplay}
                  className="w-12 h-12 flex items-center justify-center border-2 border-copper/30 hover:border-copper text-copper hover:text-copper-600 transition-all duration-300 backdrop-blur-sm bg-white/20 shadow-xl hover:shadow-2xl rounded-xl"
                >
                  {isAutoplay ? <Pause size={18} /> : <Play size={18} />}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Previous slide"
                  className="swiper-button-prev-custom w-12 h-12 flex items-center justify-center border-2 border-copper/30 hover:border-copper hover:bg-copper hover:text-white text-copper transition-all duration-300 backdrop-blur-sm bg-white/20 shadow-xl hover:shadow-2xl rounded-xl group"
                >
                  <ChevronLeft
                    className="group-hover:-translate-x-0.5 transition-transform"
                    size={24}
                  />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Next slide"
                  className="swiper-button-next-custom w-12 h-12 flex items-center justify-center bg-gradient-to-r from-copper to-copper-600 text-white hover:from-copper-500 hover:to-copper-700 transition-all duration-300 backdrop-blur-sm shadow-2xl hover:shadow-3xl rounded-xl group"
                >
                  <ChevronRight
                    className="group-hover:translate-x-0.5 transition-transform"
                    size={24}
                  />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Custom Pagination */}
        <div className="swiper-pagination-custom absolute bottom-8 left-8 md:left-16 lg:left-24 z-20"></div>

        {/* Scroll Indicator */}
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={scrollToNextSection}
          aria-label="Scroll to next section"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60 hover:text-copper transition-colors"
          variants={scrollIndicatorVariants}
        >
          <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.button>
      </section>

      {/* 360 View Frame */}
      <section
        ref={containerRef}
        className="relative min-h-full md:min-h-[160vh] flex items-center justify-center bg-gradient-to-b from-zinc-50 via-white to-zinc-50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-copper/5 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="absolute top-24 left-1/2 transform -translate-x-1/2 text-center z-20 pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeInOut }}
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

        <div className="sticky top-0 w-full h-screen flex items-center justify-center px-4 md:px-8">
          <motion.div
            style={{ width, scale, opacity, borderRadius, y }}
            className="relative mx-auto shadow-2xl shadow-zinc-900/20 bg-white"
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ paddingBottom: "56.25%" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800">
                <FrameView />
              </div>

              {/* Instruction dots (hook-safe) */}
              <motion.div
                style={{ opacity: instructionsOpacity }}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 pointer-events-none"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <InstructionDot
                    key={i}
                    i={i}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </motion.div>

              {/* Progress bar */}
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

              {/* Corner guides (hook-safe) */}
              <CornerGuide
                i={0}
                scrollYProgress={scrollYProgress}
                className="absolute w-16 h-16 border-2 border-copper pointer-events-none top-0 left-0 border-b-2"
              />
              <CornerGuide
                i={1}
                scrollYProgress={scrollYProgress}
                className="absolute w-16 h-16 border-2 border-copper pointer-events-none top-0 right-0 border-t-2"
              />
              <CornerGuide
                i={2}
                scrollYProgress={scrollYProgress}
                className="absolute w-16 h-16 border-2 border-copper pointer-events-none bottom-0 left-0 border-l-2"
              />
              <CornerGuide
                i={3}
                scrollYProgress={scrollYProgress}
                className="absolute w-16 h-16 border-2 border-copper pointer-events-none bottom-0 right-0 border-r-2"
              />
            </div>
          </motion.div>
        </div>

        {/* Left progress bars */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0.3, 0.5], [0, 1]) }}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden xl:block pointer-events-none"
        >
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <ProgressSidebarBar
                key={i}
                i={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </motion.div>

        {/* Right label */}
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
                  className="col-span-8 relative aspect-square duration-300 hover:contrast-[1.1]"
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
                  className="col-span-4 relative aspect-square duration-300 hover:contrast-[1.1]"
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
                  onMouseEnter={() => setHoveredImage("image4")}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <div className="absolute inset-0 border-2 border-carbon-300"></div>
                  <div className="absolute inset-2 sm:inset-4 md:inset-6 bg-gray-100 flex items-center justify-center p-2 sm:p-4">
                    <p className="text-sm sm:text-base md:text-lg font-light italic text-center">
                      "Architecture is the thoughtful making of space."
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={staggerItemVariants}
                  className="col-span-8 relative md:m-0 mt-2 duration-300 hover:contrast-[1.1]"
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

      {/* Testimonials */}
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

        <div className="testimonials-marquee relative whitespace-nowrap overflow-hidden pb-8">
          <div className="inline-flex gap-8 animate-marquee motion-reduce:animate-none">
            {testimonialsData.map((testimonial) => (
              <TestimonialCard
                key={`testimonial-${testimonial.id}`}
                testimonial={testimonial}
              />
            ))}
            {/* Duplicate set for a seamless loop; hidden from assistive tech to avoid repeating content */}
            <div aria-hidden="true" className="inline-flex gap-8">
              {testimonialsData.map((testimonial) => (
                <TestimonialCard
                  key={`testimonial-dup-${testimonial.id}`}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>
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
                className="group bg-copper text-white px-8 py-3 md:px-12 md:py-4 hover:bg-copper-600 transition-all duration-300 flex items-center gap-3 w-fit"
              >
                <span>Get in Touch</span>
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={18}
                />
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
                    className="text-sm text-carbon-300 hover:text-copper transition-colors duration-300"
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
                    className="text-sm text-carbon-300 hover:text-copper transition-colors duration-300"
                  >
                    {businessData.contactDetails.email}
                  </a>
                </div>

                <div>
                  <p className="text-base md:text-lg font-light mb-2">Phone</p>
                  <a
                    href={`tel:${businessData.contactDetails.phone}`}
                    className="text-sm text-carbon-300 hover:text-copper transition-colors duration-300"
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

      <style jsx global>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 60s linear infinite;
        }

        .testimonials-marquee:hover .animate-marquee,
        .testimonials-marquee:focus-within .animate-marquee {
          animation-play-state: paused;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </main>
  );
}
