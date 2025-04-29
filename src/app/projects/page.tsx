"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import projectsData from "@/data/projectsData.json";
import Link from "next/link";

const filters = ["All", "Residential", "Commercial", "Interior"];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Define a type for project data based on the JSON structure
type Project = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  // Add other fields as needed
};

const ProjectsPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const filterRefs = useRef<(HTMLLIElement | null)[]>([]);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const decorRef = useRef(null);

  // Initialize with empty array and correct type
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Load and shuffle data on component mount
    setProjects(
      shuffleArray<Project>(
        (projectsData as any[]).map((project) => ({
          ...project,
          category: project.category || "Uncategorized", // Provide a default value for missing fields
        }))
      )
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return; // Don't run animations until content is loaded

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    // Header animations
    tl.from(titleRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
    }).from(
      filterRefs.current,
      {
        opacity: 0,
        x: 30,
        duration: 0.6,
        stagger: 0.1,
      },
      "-=0.4"
    );

    // Create a smoother animation for projects with better performance
    // Use a separate timeline for project animations

    const projectTl = gsap.timeline({
      defaults: {
        ease: "power2.out",
      },
    });

    projectTl.fromTo(
      projectRefs.current,
      {
        y: 100,
        opacity: 0,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: 0.2,
        delay: 1,
        clearProps: "all", // Important for preventing jittering
      }
    );

    gsap.from(decorRef.current, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 0.8,
      delay: 0.3,
    });

    return () => {
      tl.kill();
      projectTl.kill();
    };
  }, [loading, projects.length]); // Run when loading changes or projects array changes

  // Filter projects based on the active filter
  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);

    // Animate the filtered projects
    gsap.fromTo(
      ".project-card",
      {
        opacity: 0,
        y: 30,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.05,
        clearProps: "all",
        ease: "power2.out",
      }
    );
  };

  if (loading) {
    return (
      <div className="w-11/12 py-8 max-w-7xl mx-auto">Loading projects...</div>
    );
  }

  return (
    <div ref={containerRef} className="z-10 w-11/12 py-16 max-w-7xl mx-auto">
      <div ref={titleRef} className="mb-16 contact-title">
        <h1 className="text-5xl font-light uppercase tracking-wider mb-6 text-[#1b1b1b]">
          Projects
        </h1>
        <div ref={decorRef} className="w-20 h-1 bg-[#a53838] mt-6"></div>
      </div>

      <div className="flex flex-col md:flex-row justify-end gap-6 mb-10">
        <ul className="flex flex-wrap gap-4 md:gap-6">
          {filters.map((filter, index) => (
            <li
              key={filter}
              ref={(el) => {
                filterRefs.current[index] = el;
              }}
              className={`cursor-pointer. px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-black hover:text-white hover:border-black transition-colors duration-300 text-sm md:text-base font-medium ${
                activeFilter === filter
                  ? "bg-black text-white border-black"
                  : ""
              }`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </li>
          ))}
        </ul>
      </div>

      {/* Project Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 px-4 py-6">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => {
              projectRefs.current[index] = el;
            }}
            className="project-card relative break-inside-avoid rounded-md drop-shadow-lg overflow-hidden group cursor-pointer. mb-4 transform-gpu"
          >
            <Link href={`/projects/${project.id}`}>
              <div className="overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-auto object-cover transform-gpu grayscale-[80%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.05]"
                  loading="lazy"
                />
              </div>
              <div className="p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white transform-gpu">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm mt-2">{project.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
