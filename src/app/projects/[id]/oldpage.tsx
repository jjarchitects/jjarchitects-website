"use client";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import projectsData from "@/data/projectsData.json";

export default function ProjectPage() {
  const { id } = useParams();
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  // Find project data
  const project = projectsData.find((p) => p.id === id);

  // GSAP animation
  useEffect(() => {
    if (!project) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [project]);

  // Handle 404 case
  if (!project) {
    return notFound();
  }

  return (
    <div
      ref={containerRef}
      className="max-w-6xl w-11/12 mx-auto py-12 space-y-10"
    >
      {/* Back Button */}
      <div>
        <button
          onClick={() => window.history.back()}
          aria-label="Go back"
          className="text-sm text-zinc-500 hover:text-zinc-900 transition flex items-center gap-2 mb-4"
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

      {/* Title */}
      <h1
        ref={titleRef}
        className="text-4xl sm:text-5xl font-bold text-zinc-900 uppercase tracking-wide"
      >
        {project.title}
      </h1>

      {/* Project Meta */}
      <div className="text-zinc-500 font-medium text-base">
        {project.type} · {project.location} · {project.year}
      </div>

      {/* Thumbnail */}
      <div className="w-full h-[400px] md:h-[800px] relative rounded-2xl overflow-hidden shadow-md">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Description */}
      <p className="text-lg text-zinc-700 leading-relaxed">
        {project.description}
      </p>

      {/* VR / 360 Links */}
      {(project.tour360Link || project.vrTourLink) && (
        <div className="flex gap-4 flex-wrap">
          {project.tour360Link && (
            <Link
              href={project.tour360Link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-zinc-800 transition"
            >
              360° Tour
            </Link>
          )}
          {project.vrTourLink && (
            <Link
              href={project.vrTourLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-zinc-800 transition"
            >
              VR Experience
            </Link>
          )}
        </div>
      )}

      {/* Image Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {project.images.map((src, index) => (
          <div
            key={index}
            className="w-full h-60 relative rounded-xl overflow-hidden shadow"
          >
            <Image
              src={src}
              alt={`${project.title} - image ${index + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
