"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Load and shuffle projects on mount
  useEffect(() => {
    const loadedProjects = shuffleArray<Project>(
      (projectsData as any[]).map((project) => ({
        ...project,
        category: project.category || "Uncategorized",
      }))
    );
    setProjects(loadedProjects);
    setFilteredProjects(loadedProjects);

    const timer = setTimeout(
      () => setLoading(false),
      Math.floor(Math.random() * 4001) + 3000
    );

    return () => clearTimeout(timer);
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

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

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
        ease: [0.22, 1, 0.36, 1],
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
        ease: [0.22, 1, 0.36, 1],
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
        ease: [0.22, 1, 0.36, 1],
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
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-8 max-w-7xl mx-auto">
        <ArchitecturalLoader />
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
          {filters.map((filter, index) => (
            <motion.div key={filter} variants={filterVariants}>
              <Link
                href={`/projects?filter=${filter}`}
                className={`block px-4 py-2 border border-carbon-200 text-carbon-300 hover:bg-carbon hover:text-white hover:border-carbon-300 transition-colors duration-300 text-sm md:text-base font-medium ${
                  activeFilter === filter
                    ? "bg-carbon text-white border-carbon"
                    : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleFilterClick(filter);
                  window.history.pushState(
                    {},
                    "",
                    `/projects?filter=${filter}`
                  );
                }}
              >
                {filter}
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
          {filteredProjects.map((project, index) => (
            // <motion.div
            //   key={project.id}
            //   layout
            //   variants={projectCardVariants}
            //   initial="hidden"
            //   animate="visible"
            //   exit="exit"
            //   transition={{
            //     layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
            //   }}
            //   className="relative break-inside-avoid drop-shadow-lg overflow-hidden group mb-4"
            // >
            //   <Link href={`/projects/${project.id}`}>
            //     <motion.div
            //       className="overflow-hidden"
            //       whileHover={{ scale: 1.02 }}
            //       transition={{ duration: 0.4 }}
            //     >
            //       <motion.img
            //         src={project.thumbnail}
            //         alt={project.title}
            //         className="w-full h-auto object-cover grayscale-[95%] group-hover:grayscale-0 transition-all duration-500"
            //         whileHover={{ scale: 1.05 }}
            //         transition={{ duration: 0.5 }}
            //         loading="lazy"
            //       />
            //     </motion.div>

            //     {/* Overlay with slide-up animation */}
            //     <motion.div
            //       initial={{ y: "100%" }}
            //       whileHover={{ y: 0 }}
            //       transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            //       className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-carbon via-carbon/95 to-carbon/80 text-white p-4"
            //     >
            //       <motion.h3
            //         initial={{ opacity: 0, y: 20 }}
            //         whileHover={{ opacity: 1, y: 0 }}
            //         transition={{ duration: 0.3, delay: 0.1 }}
            //         className="text-lg font-semibold mb-2"
            //       >
            //         {project.title}
            //       </motion.h3>
            //       <motion.p
            //         initial={{ opacity: 0, y: 20 }}
            //         whileHover={{ opacity: 1, y: 0 }}
            //         transition={{ duration: 0.3, delay: 0.15 }}
            //         className="text-sm line-clamp-2"
            //       >
            //         {project.description}
            //       </motion.p>

            //       {/* View Project Button */}
            //       <motion.div
            //         initial={{ opacity: 0, x: -20 }}
            //         whileHover={{ opacity: 1, x: 0 }}
            //         transition={{ duration: 0.3, delay: 0.2 }}
            //         className="mt-3 flex items-center gap-2 text-copper text-sm font-medium"
            //       >
            //         View Project
            //         <motion.span
            //           animate={{ x: [0, 5, 0] }}
            //           transition={{ duration: 1.5, repeat: Infinity }}
            //         >
            //           →
            //         </motion.span>
            //       </motion.div>
            //     </motion.div>

            //     {/* Permanent bottom gradient (fallback) */}
            //     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-carbon to-transparent text-white p-4 md:hidden">
            //       <h3 className="text-lg font-semibold">{project.title}</h3>
            //       <p className="text-sm mt-2 line-clamp-2">
            //         {project.description}
            //       </p>
            //     </div>
            //   </Link>

            //   {/* Decorative corner on hover */}
            //   <motion.div
            //     initial={{ opacity: 0, scale: 0 }}
            //     whileHover={{ opacity: 1, scale: 1 }}
            //     transition={{ duration: 0.3 }}
            //     className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-copper pointer-events-none"
            //   />
            // </motion.div>
            <motion.div
              key={project.id}
              layout
              variants={projectCardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              }}
              className="relative break-inside-avoid drop-shadow-lg overflow-hidden group mb-4"
            >
              <Link href={`/projects/${project.id}`}>
                <motion.div
                  className="overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-auto object-cover grayscale-[95%] group-hover:grayscale-0 transition-all duration-500"
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

                  {/* Additional details on hover - Desktop only */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    whileHover={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden md:block overflow-hidden"
                  >
                    <div className="pt-2 border-t border-white/20">
                      <div className="flex items-center justify-between text-xs text-zinc-300 mb-2">
                        <span>{project.type}</span>
                        <span>{project.year}</span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="flex items-center gap-2 text-copper text-sm font-medium"
                      >
                        View Project
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Decorative corner on hover */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-copper pointer-events-none hidden md:block"
                />
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
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🏗️
          </motion.div>
          <h3 className="text-2xl font-light text-carbon mb-2">
            No projects found
          </h3>
          <p className="text-carbon-300">Try selecting a different filter</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectsPage;
