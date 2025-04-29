"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import projectsData from "@/data/projectsData.json";
import Link from "next/link";

const filters = ["All", "Residential", "Commercial", "Interior"];

async function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return await shuffled;
}

console.log(projectsData);

const projectImages = [
  {
    src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    alt: "Modern House Exterior",
  },
  {
    src: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8",
    alt: "Minimalist Kitchen",
  },
  {
    src: "https://images.unsplash.com/photo-1524026986132-000404263b59",
    alt: "Cozy Living Room",
  },
  {
    src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
    alt: "Luxury Bathroom",
  },
  {
    src: "  https://plus.unsplash.com/premium_photo-1680382578857-c331ead9ed51",
    alt: "Work Studio",
  },
  {
    src: "https://images.unsplash.com/photo-1502005097973-6a7082348e28",
    alt: "Work Studio",
  },
  {
    src: "https://images.unsplash.com/photo-1701602443009-99dd109ac543",
    alt: "Work Studio",
  },
  {
    src: "https://images.unsplash.com/photo-1663811397302-8268848ca312",
    alt: "Work Studio",
  },
  {
    src: "https://images.unsplash.com/photo-1520587393050-c5298e1a8486",
    alt: "Work Studio",
  },
];

const ProjectsPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const filterRefs = useRef<HTMLLIElement[]>([]);
  const [loading, setLoading] = useState(true);

  const [shuffledImages, setShuffledImages] = useState(projectsData);

  useEffect(() => {
    setShuffledImages(shuffleArray(projectsData));
    setLoading(false);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(filterRefs.current, {
        opacity: 0,
        x: 90,
        duration: 1,
        stagger: 0.18,
        ease: "power2.out",
        delay: 0.1,
      });
    }, containerRef);

    // animation of photos
    gsap.from(".project-image", {
      clipPath: "inset(100% 0% 0% 0%)",
      opacity: 0,
      duration: 1.3,
      stagger: 0.3,
      ease: "power3.out",
      delay: 0.5,
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="z-10 w-11/12 py-8 max-w-7xl mx-auto">
      <h2
        ref={titleRef}
        className="text-5xl md:text-5xl font-semibold uppercase tracking-wider mb-4 text-dark"
      >
        Projects
      </h2>

      <div className="flex flex-col md:flex-row justify-end gap-6 mb-10">
        <ul className="flex flex-wrap gap-4 md:gap-6">
          {filters.map((filter, index) => (
            <li
              key={filter}
              ref={(el) => {
                if (el) filterRefs.current[index] = el;
              }}
              className="cursor-pointer. px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-black hover:text-white hover:border-black transition-colors duration-300 text-sm md:text-base font-medium"
            >
              {filter}
            </li>
          ))}
        </ul>
      </div>

      {/* Example Project Grid Placeholder */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 px-4 py-6">
        {console.log(shuffledImages)}
        {!loading &&
          shuffledImages.map((project) => (
            <div
              key={project.id}
              className="project-image relative break-inside-avoid rounded-md drop-shadow-lg overflow-hidden group cursor-pointer."
            >
              <Link href={`/projects/${project.id}`}>
                {/* eslint-disable-next-line @next/next/no-project-element */}
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full break-inside-avoid object-cover grayscale-[80%] group-hover:grayscale-0 transition-all duration-300 group-hover:scale-[1.1]"
                />
                <div className="p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white">
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
