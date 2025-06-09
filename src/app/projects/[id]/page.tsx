"use client";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projectsData from "@/data/projectsData.json";
import { Calendar1, Fullscreen, Layers, MapPin, Square } from "lucide-react";

export default function ProjectPage() {
  const { id } = useParams();
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  // Next project suggestion - find a related project
  const currentIndex = projectsData.findIndex((p) => p.id === id);
  const nextProject = projectsData[(currentIndex + 1) % projectsData.length];

  // Find project data
  const project = projectsData.find((p) => p.id === id);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!project) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.from(heroRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Staggered info section animation
      if (infoRef.current) {
        gsap.from(infoRef.current.children, {
          y: 30,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: infoRef.current,
            start: "top 80%",
          },
        });
      }

      // Gallery animations
      if (galleryRef.current) {
        gsap.from(galleryRef.current.children, {
          y: 50,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 75%",
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [project]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    interface KeyboardEventWithKey extends KeyboardEvent {
      key: string;
    }

    const handleKeyDown = (e: KeyboardEventWithKey): void => {
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

  // Handle 404 case
  if (!project) {
    return notFound();
  }

  interface OpenLightboxFunction {
    (index: number): void;
  }

  const openLightbox: OpenLightboxFunction = (index) => {
    setActiveImage(index);
    setImageLoading(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setActiveImage(null);
    document.body.style.overflow = "";
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

  return (
    <div ref={containerRef} className="relative">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-[#a53838] z-50 transition-all duration-150"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Back Button */}
      {/* <div className="fixed top-6 left-6 z-40">
        <button
          onClick={() => window.history.back()}
          aria-label="Go back"
          className="flex items-center mt-16 gap-2 bg-white/80 backdrop-blur-sm text-zinc-800 px-4 py-2 rounded-full shadow-md hover:bg-white transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div> */}

      {/* Hero Section */}
      <section
        ref={heroRef}
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
              <div className="bg-carbon/60 backdrop-blur-sm rounded-sm p-5 mx-auto">
                <div className="mb-9 text-4xl font-light. tracking-wider">
                  {project.title}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Category */}
                  <div className="flex items-center">
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
                  </div>

                  {/* Location */}
                  {project.location && (
                    <div className="flex items-center">
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
                    </div>
                  )}

                  {/* Area */}
                  {project.area && (
                    <div className="flex items-center">
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
                    </div>
                  )}

                  {/* Year */}
                  {project.year && (
                    <div className="flex items-center">
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* <div
          // onClick={scrollToProjects}
          className="text-white absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20 animate-bounce"
        >
          <p className="text-xs tracking-widest mb-1. opacity-70">SCROLL</p>
          <ChevronDown size={20} className="scroll-indicator opacity-70" />
        </div> */}
      </section>

      {/* Project Info */}
      <section className="bg-white py-20 px-6">
        <div ref={infoRef} className="mx-auto space-y-12">
          {project.aboutProject && (
            <div className="space-y-6">
              {/* <h2 className="text-3xl font-bold text-zinc-900"> */}
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-carbon">
                About the Project
              </h2>
              <p className="text-xl leading-relaxed text-carbon-400 font-light text-justify">
                {project?.aboutProject}
              </p>
            </div>
          )}

          {/* VR / 360 Links */}
          {(project.tour360Link || project.vrTourLink) && (
            <div className="space-y-6">
              <h2 className="text-3xl tracking-tight text-carbon">
                Virtual Experience
              </h2>
              <div className="flex flex-wrap gap-4">
                {project.tour360Link && (
                  <Link
                    href={project.tour360Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-3 bg-carbon text-white px-6 py-3 rounded-lg. hover:bg-copper transition overflow-hidden"
                  >
                    <span className="relative z-10">Experience 360° Tour</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-copper-500 to-copper-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                )}
                {project.vrTourLink && (
                  <Link
                    href={project.vrTourLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-3 bg-carbon text-white px-6 py-3 hover:bg-copper transition overflow-hidden"
                  >
                    <span className="relative z-10">VR Experience</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-copper-500 to-copper-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-taupe-100 py-20 px-6">
        <div className="max-w-6xl. mx-auto">
          <h2 className="mb-12 text-4xl md:text-5xl font-light tracking-tight text-carbon">
            Project Gallery
          </h2>

          <div
            ref={galleryRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {project.images.map((src, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden shadow-lg rounded-sm"
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
                    // Remove animation once image is loaded
                    const parentElement = (e.target as HTMLElement)
                      .parentElement;
                    parentElement
                      ?.querySelector(".animate-pulse")
                      ?.classList.remove("animate-pulse");
                  }}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                  <div className="w-12 h-12 bg-white/70 flex items-center justify-center">
                    <Fullscreen />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Lightbox */}
      {activeImage !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white z-10"
            aria-label="Close lightbox"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white z-10 hover:bg-white/10 p-2 rounded-full transition-colors"
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="relative w-full h-full max-w-5xl max-h-screen p-8 flex items-center justify-center">
            {/* Loading spinner */}
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            )}

            <Image
              src={project.images[activeImage]}
              alt={`${project.title} - image ${activeImage + 1}`}
              fill
              sizes="90vw"
              className={`object-contain transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={handleImageLoad}
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white z-10 hover:bg-white/10 p-2 rounded-full transition-colors"
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white">
            {activeImage + 1} / {project.images.length}
          </div>

          {/* Keyboard navigation hint */}
          <div className="absolute bottom-6 right-6 flex items-center gap-3">
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
          </div>
        </div>
      )}

      {/* Continue Exploring - Improved version with light background */}
      <section className="bg-taupe-200/20 py-16 px-6">
        <div className="max-w-6xl. mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-taupe-200 rounded-sm shadow-lg">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl tracking-tight text-carbon mb-2">
                Continue Exploring
              </h2>
              <p className="text-carbon-300 font-light mb-6">
                Discover more amazing projects in the portfolio
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 bg-copper-600 hover:bg-copper-700 text-white px-5 py-3 transition shadow-md"
                >
                  <span>View All Projects</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>

                {nextProject && (
                  <Link
                    href={`/projects/${nextProject.id}`}
                    className="inline-flex items-center gap-2 bg-taupe-100 border border-taupe-600 hover:border-taupe-800 hover:text-stone-600 text-taupe-800 px-5 py-3 transition shadow-sm"
                  >
                    <span>Next Project</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </div>

            {nextProject && (
              <div className="relative w-full md:w-1/3 aspect-square rounded-sm overflow-hidden shadow-md">
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
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
