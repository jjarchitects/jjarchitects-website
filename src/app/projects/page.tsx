"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { SearchX } from "lucide-react";
import projectsData from "@/data/projectsData.json";
import Link from "next/link";
import { filters } from "@/app/constants";
import { useSearchParams } from "next/navigation";
import ArchitecturalLoader from "@/components/Loader/ArchitecturalLoader";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const ProjectsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(filter ? filter : "All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Load and shuffle projects on mount with API fetch
  useEffect(() => {
    let isMounted = true;
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const sourceData =
          data.projects && data.projects.length > 0
            ? data.projects
            : (projectsData as any[]);
        const loadedProjects = shuffleArray<Project>(
          sourceData.map((project: any) => ({
            ...project,
            category: project.category || "Uncategorized",
          }))
        );
        setProjects(loadedProjects);
        setFilteredProjects(
          activeFilter === "All"
            ? loadedProjects
            : loadedProjects.filter((p: any) => p.type === activeFilter)
        );
      })
      .catch((err) => {
        console.error("Failed to load projects from API, using fallback:", err);
        const loadedProjects = shuffleArray<Project>(
          (projectsData as any[]).map((project) => ({
            ...project,
            category: project.category || "Uncategorized",
          }))
        );
        setProjects(loadedProjects);
        setFilteredProjects(loadedProjects);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update active filter from URL
  useEffect(() => {
    setActiveFilter(filter ? filter : "All");
  }, [filter]);

  // Filter projects when active filter changes
  useEffect(() => {
    const filtered =
      activeFilter === "All"
        ? projects
        : projects.filter((project) => project.type === activeFilter);
    setFilteredProjects(filtered);
  }, [activeFilter, projects]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: easeInOut,
      },
    },
  };

  const decorVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: easeInOut,
      },
    },
  };

  const filterVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: easeInOut,
      },
    },
  };

  const projectCardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: easeInOut,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center py-8 max-w-7xl mx-auto">
        <ArchitecturalLoader onComplete={() => setLoading(false)} />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="z-10 w-11/12 py-16 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <div className="mb-16">
        <motion.h1
          variants={titleVariants}
          className="text-5xl font-light uppercase tracking-wider mb-6 text-[#1b1b1b]"
        >
          Projects
        </motion.h1>
        <motion.div
          variants={decorVariants}
          className="w-20 h-1 bg-copper mt-6 origin-left"
        />
      </div>

      {/* Filter Section */}
      <motion.div
        variants={containerVariants}
        className="flex flex-col md:flex-row justify-end gap-6 mb-10"
      >
        <div className="flex flex-wrap gap-4 md:gap-6">
          {filters.map((filterOption) => (
            <motion.div key={filterOption} variants={filterVariants}>
              <Link
                href={`/projects?filter=${filterOption}`}
                aria-current={activeFilter === filterOption ? "true" : undefined}
                className={`block px-4 py-2 border border-carbon-200 text-carbon-300 hover:bg-carbon hover:text-white hover:border-carbon-300 transition-colors duration-300 text-sm md:text-base font-medium ${
                  activeFilter === filterOption
                    ? "bg-carbon text-white border-carbon"
                    : ""
                }`}
              >
                {filterOption}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Project Grid with Layout Animation */}
      <motion.div
        layout
        className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 px-4 py-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              variants={projectCardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                layout: { duration: 0.4, ease: easeInOut },
              }}
              className="relative break-inside-avoid drop-shadow-lg overflow-hidden group mb-4"
            >
              <Link
                href={`/projects/${project.id}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2"
              >
                <motion.div
                  className="overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-auto object-cover grayscale-[95%] group-hover:grayscale-0 group-focus-within:grayscale-0 transition-all duration-500"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    loading="lazy"
                  />
                </motion.div>

                {/* Always visible title and description */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-carbon to-transparent text-white p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm line-clamp-2 mb-3">
                    {project.description}
                  </p>

                  {/* Additional details on hover/focus - Desktop only */}
                  <div className="hidden md:block overflow-hidden max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 group-focus-within:max-h-32 group-focus-within:opacity-100 transition-all duration-300 ease-in-out">
                    <div className="pt-2 border-t border-white/20">
                      <div className="flex items-center justify-between text-xs text-zinc-300 mb-2">
                        <span>{project.type}</span>
                        <span>{project.year}</span>
                      </div>
                      <div className="flex items-center gap-2 text-copper text-sm font-medium">
                        View Project
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative corner on hover/focus */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-copper pointer-events-none hidden md:block opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-20"
        >
          <SearchX
            size={48}
            strokeWidth={1}
            className="mx-auto mb-6 text-carbon-200"
          />
          <h3 className="text-2xl font-light text-carbon mb-2">
            No projects found
          </h3>
          <p className="text-carbon-300 mb-6">
            Try selecting a different filter
          </p>
          <Link
            href="/projects?filter=All"
            className="inline-block px-6 py-2.5 border border-carbon-200 text-carbon-300 hover:bg-carbon hover:text-white hover:border-carbon-300 transition-colors duration-300 text-sm font-medium"
          >
            View all projects
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectsPage;
