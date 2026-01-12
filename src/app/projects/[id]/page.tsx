"use client";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  easeInOut,
} from "framer-motion";
import projectsData from "@/data/projectsData.json";
import {
  Calendar1,
  Fullscreen,
  Layers,
  MapPin,
  Square,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ProjectPage() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Next project suggestion
  const currentIndex = projectsData.findIndex((p) => p.id === id);
  const nextProject = projectsData[(currentIndex + 1) % projectsData.length];

  // Find project data
  const project = projectsData.find((p) => p.id === id);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (activeImage === null) return;

      if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImage, project?.images.length]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (activeImage !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeImage]);

  if (!project) {
    return notFound();
  }

  const openLightbox = (index: number) => {
    setActiveImage(index);
    setImageLoading(true);
  };

  const closeLightbox = () => {
    setActiveImage(null);
  };

  const nextImage = () => {
    setImageLoading(true);
    setActiveImage((prev) =>
      (prev ?? 0) === project.images.length - 1 ? 0 : (prev ?? 0) + 1
    );
  };

  const prevImage = () => {
    setImageLoading(true);
    setActiveImage((prev) =>
      (prev ?? 0) === 0 ? project.images.length - 1 : (prev ?? 0) - 1
    );
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Animation variants
  const heroVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: easeInOut,
      },
    },
  };

  const infoContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const infoItemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: easeInOut,
      },
    },
  };

  const galleryContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const galleryItemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: easeInOut,
      },
    },
  };

  return (
    <div className="relative">
      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 h-1 bg-copper z-50 origin-left"
      />

      {/* Hero Section */}
      <motion.section
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full h-[calc(100vh-60px)] overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white z-10">
          <div className="absolute bottom-2 left-0 right-0 z-10">
            <div className="mx-auto px-4">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 1,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-carbon/60 backdrop-blur-sm rounded-sm p-5 mx-auto"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mb-9 text-4xl font-light tracking-wider"
                >
                  {project.title}
                </motion.div>

                <motion.div
                  variants={infoContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  {/* Category */}
                  <motion.div
                    variants={infoItemVariants}
                    className="flex items-center"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center mr-3">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white/60 text-xs uppercase mb-1">
                        Category
                      </div>
                      <div className="text-white font-medium">
                        {project.type}
                      </div>
                    </div>
                  </motion.div>

                  {/* Location */}
                  {project.location && (
                    <motion.div
                      variants={infoItemVariants}
                      className="flex items-center"
                    >
                      <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center mr-3">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white/60 text-xs uppercase mb-1">
                          Location
                        </div>
                        <div className="text-white font-medium">
                          {project.location}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Area */}
                  {project.area && (
                    <motion.div
                      variants={infoItemVariants}
                      className="flex items-center"
                    >
                      <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center mr-3">
                        <Square className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white/60 text-xs uppercase mb-1">
                          Area
                        </div>
                        <div className="text-white font-medium">
                          {project.area}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Year */}
                  {project.year && (
                    <motion.div
                      variants={infoItemVariants}
                      className="flex items-center"
                    >
                      <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center mr-3">
                        <Calendar1 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white/60 text-xs uppercase mb-1">
                          Year
                        </div>
                        <div className="text-white font-medium">
                          {project.year}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Project Info */}
      <section className="bg-white py-20 px-6">
        <motion.div
          variants={infoContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto space-y-12"
        >
          {/* About Project Section */}
          <motion.div variants={infoItemVariants} className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-carbon">
              About the Project
            </h2>
            <p className="text-xl leading-relaxed text-carbon-400 font-light text-justify">
              {project.description}
            </p>
          </motion.div>

          {/* VR / 360 Links */}
          {(project.tour360Link || project.vrTourLink) && (
            <motion.div variants={infoItemVariants} className="space-y-6">
              <h2 className="text-3xl tracking-tight text-carbon">
                Virtual Experience
              </h2>
              <div className="flex flex-wrap gap-4">
                {project.tour360Link && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={project.tour360Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center gap-3 bg-carbon text-white px-6 py-3 hover:bg-copper transition overflow-hidden"
                    >
                      <span className="relative z-10">
                        Experience 360° Tour
                      </span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="relative z-10"
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                )}
                {project.vrTourLink && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={project.vrTourLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center gap-3 bg-carbon text-white px-6 py-3 hover:bg-copper transition overflow-hidden"
                    >
                      <span className="relative z-10">VR Experience</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="relative z-10"
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section className="bg-taupe-100 py-20 px-6">
        <div className="mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-4xl md:text-5xl font-light tracking-tight text-carbon"
          >
            Project Gallery
          </motion.h2>

          <motion.div
            variants={galleryContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {project.images.map((src, index) => (
              <motion.div
                key={index}
                variants={galleryItemVariants}
                whileHover={{ scale: 1.02 }}
                className="group relative aspect-square overflow-hidden shadow-lg rounded-sm cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="absolute inset-0 bg-carbon-200 animate-pulse z-0"></div>
                <Image
                  src={src}
                  alt={`${project.title} - image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110 z-10"
                  onLoad={(e) => {
                    const parentElement = (e.target as HTMLElement)
                      .parentElement;
                    parentElement
                      ?.querySelector(".animate-pulse")
                      ?.classList.remove("animate-pulse");
                  }}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center z-20"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1 }}
                    className="w-12 h-12 bg-white/90 flex items-center justify-center rounded-full"
                  >
                    <Fullscreen className="w-6 h-6 text-carbon" />
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Image Lightbox */}
      <AnimatePresence>
        {activeImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white z-10 hover:bg-white/10 p-2 rounded-full transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </motion.button>

            {/* Previous Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.1 }}
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white z-10 hover:bg-white/10 p-2 rounded-full transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-12 h-12" />
            </motion.button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full max-w-5xl max-h-screen p-8 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Loading spinner */}
              <AnimatePresence>
                {imageLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-0"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={project.images[activeImage]}
                  alt={`${project.title} - image ${activeImage + 1}`}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  onLoad={handleImageLoad}
                />
              </motion.div>
            </motion.div>

            {/* Next Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.1 }}
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white z-10 hover:bg-white/10 p-2 rounded-full transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-12 h-12" />
            </motion.button>

            {/* Image Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-lg"
            >
              {activeImage + 1} / {project.images.length}
            </motion.div>

            {/* Keyboard navigation hint */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-6 right-6 flex items-center gap-3"
            >
              <div className="text-white/70 flex items-center gap-1 text-sm">
                <span className="px-2 py-1 bg-white/10 rounded">←</span>
                <span className="hidden sm:inline">Previous</span>
              </div>
              <div className="text-white/70 flex items-center gap-1 text-sm">
                <span className="px-2 py-1 bg-white/10 rounded">→</span>
                <span className="hidden sm:inline">Next</span>
              </div>
              <div className="text-white/70 flex items-center gap-1 text-sm">
                <span className="px-2 py-1 bg-white/10 rounded">Esc</span>
                <span className="hidden sm:inline">Close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Exploring */}
      <section className="bg-taupe-200/20 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-between p-8 bg-taupe-200 rounded-sm shadow-lg"
          >
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl tracking-tight text-carbon mb-2">
                Continue Exploring
              </h2>
              <p className="text-carbon-300 font-light mb-6">
                Discover more amazing projects in the portfolio
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 bg-copper-600 hover:bg-copper-700 text-white px-5 py-3 transition shadow-md"
                  >
                    <span>View All Projects</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>

                {nextProject && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={`/projects/${nextProject.id}`}
                      className="inline-flex items-center gap-2 bg-taupe-100 border border-taupe-600 hover:border-taupe-800 hover:text-stone-600 text-taupe-800 px-5 py-3 transition shadow-sm"
                    >
                      <span>Next Project</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>

            {nextProject && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative w-full md:w-1/3 aspect-square rounded-sm overflow-hidden shadow-md"
              >
                <div className="absolute inset-0 bg-taupe-100 animate-pulse"></div>
                <Image
                  src={nextProject.thumbnail}
                  alt={nextProject.title}
                  fill
                  sizes="(max-width: 768px) 90vw, 33vw"
                  className="object-cover"
                  onLoad={(e) => {
                    const parentElement = (e.target as HTMLElement)
                      .parentElement;
                    parentElement
                      ?.querySelector(".animate-pulse")
                      ?.classList.remove("animate-pulse");
                  }}
                />
                <div className="absolute inset-0 bg-black/10 hover:bg-indigo-600/0 transition-colors duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-white leading-tight text-xl truncate">
                    {nextProject.title}
                  </h3>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
