"use client";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projectsData from "@/data/projectsData.json";

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
      <div className="fixed top-6 left-6 z-40">
        <button
          onClick={() => window.history.back()}
          aria-label="Go back"
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-zinc-800 px-4 py-2 rounded-full shadow-md hover:bg-white transition"
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
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative w-full h-[calc(100vh-65px)] overflow-hidden"
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
          <div className="max-w-4xl">
            <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-indigo-600/90">
              {project.type}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-6xl font-bold mb-4 tracking-tight. font-heading">
              {project.title}
            </h1>
            <div className="flex items-center gap-3 text-base font-mono">
              <span>{project.location}</span>
              <span className="w-1 h-1 rounded-full bg-white/70"></span>
              <span>{project.year}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Project Info */}
      <section className="bg-white py-20 px-6">
        <div ref={infoRef} className="max-w-10/12 mx-auto space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-zinc-900">
              About the Project
            </h2>
            <p className="text-xl leading-relaxed text-zinc-700 text-justify">
              {project?.aboutProject}
            </p>
          </div>

          {/* VR / 360 Links */}
          {(project.tour360Link || project.vrTourLink) && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-zinc-900">
                Virtual Experience
              </h2>
              <div className="flex flex-wrap gap-4">
                {project.tour360Link && (
                  <Link
                    href={project.tour360Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-3 bg-zinc-900 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition overflow-hidden"
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
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                )}
                {project.vrTourLink && (
                  <Link
                    href={project.vrTourLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-3 bg-zinc-900 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition overflow-hidden"
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
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-zinc-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 mb-12 text-center">
            Project Gallery
          </h2>

          <div
            ref={galleryRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {project.images.map((src, index) => (
              <div
                key={index}
                className="group relative aspect-square rounded-xl overflow-hidden shadow-lg cursor-pointer."
                onClick={() => openLightbox(index)}
              >
                <div className="absolute inset-0 bg-zinc-200 animate-pulse z-0"></div>
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
                  <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-zinc-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
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
      <section className="bg-zinc-100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white rounded-2xl shadow-lg">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">
                Continue Exploring
              </h2>
              <p className="text-zinc-600 mb-4">
                Discover more amazing projects in the portfolio
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg transition shadow-md"
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
                    className="inline-flex items-center gap-2 bg-white border border-zinc-300 hover:border-indigo-600 hover:text-indigo-600 text-zinc-700 px-5 py-3 rounded-lg transition shadow-sm"
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
              <div className="relative w-full md:w-1/3 aspect-square rounded-xl overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-zinc-200 animate-pulse"></div>
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
                <div className="absolute inset-0 bg-stone-800/20 hover:bg-indigo-600/0 transition-colors duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-white font-medium text-lg truncate">
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
