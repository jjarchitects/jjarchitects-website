"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronDown, Menu, X, ExternalLink } from "lucide-react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeProject, setActiveProject] = useState(1);
  const heroRef = useRef(null);
  const projectsRef = useRef(null);

  // Animation sequences
  useEffect(() => {
    setIsLoaded(true);

    // Parallax scrolling effect
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroElements = document.querySelectorAll(".parallax");

      heroElements.forEach((element) => {
        const speed = element.getAttribute("data-speed");
        element.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const projects = [
    {
      id: 1,
      title: "Monolithic Residence",
      category: "Residential",
      year: "2024",
      location: "Tokyo, Japan",
      description:
        "A minimalist concrete structure that plays with light and shadow throughout the day.",
    },
    {
      id: 2,
      title: "Canvas Gallery",
      category: "Cultural",
      year: "2023",
      location: "Berlin, Germany",
      description:
        "An innovative art space that transforms based on the exhibitions it houses.",
    },
    {
      id: 3,
      title: "Floating Pavilion",
      category: "Public Space",
      year: "2024",
      location: "Copenhagen, Denmark",
      description:
        "A sustainable structure that integrates with its waterfront environment.",
    },
    {
      id: 4,
      title: "Urban Oasis Tower",
      category: "Mixed-Use",
      year: "2023",
      location: "Singapore",
      description:
        "A vertical city concept combining living spaces with extensive greenery.",
    },
  ];

  return (
    <main className="bg-white text-[#1b1b1b] overflow-hidden">
      {/* Hero Section with Split Layout */}
      <section
        ref={heroRef}
        className="min-h-screen relative flex flex-col lg:flex-row"
      >
        {/* Left Column */}
        <div className="absolute top-0 left-0 w-full lg:w-1/2 h-screen z-10 flex items-center justify-center p-8">
          <div
            className={`transition-all duration-1500 delay-300 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="max-w-xl">
              <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-6 leading-tight">
                REDEFINING <br />
                <span className="text-[#a53838]">ARCHITECTURAL</span>
                <br /> BOUNDARIES
              </h1>
              <div className="w-16 h-1 bg-[#a53838] mb-8"></div>
              <p className="text-lg md:text-xl max-w-md mb-12 font-light leading-relaxed">
                Creating spaces where minimalism meets functionality, where
                every line has purpose, and every void tells a story.
              </p>
              <div className="flex space-x-6">
                <button
                  onClick={scrollToProjects}
                  className="border-b-2 border-[#1b1b1b] pb-1 pr-1 flex items-center gap-2 hover:border-[#a53838] hover:text-[#a53838] transition-all duration-300"
                >
                  View Projects <ArrowRight size={16} />
                </button>
                <button className="border-b-2 border-transparent pb-1 pr-1 flex items-center gap-2 hover:border-[#a53838] hover:text-[#a53838] transition-all duration-300">
                  About Studio <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Visual Elements */}
        <div className="absolute top-0 right-0 w-full lg:w-7/12 h-screen bg-gray-50 overflow-hidden">
          {/* Abstract Architectural Elements */}
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-[#a53838] parallax"
            data-speed="-0.05"
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gray-100 parallax"
            data-speed="0.02"
          ></div>

          {/* Main Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`relative w-4/5 h-3/5 transition-all duration-1500 ${
                isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <Image
                src="/assets/sketch.svg"
                alt="Architectural sketch"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Decorative Grid */}
          <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-full border-l border-gray-200"></div>
            ))}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full border-t border-gray-200"></div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
          <p className="text-xs tracking-widest mb-2 opacity-70">SCROLL</p>
          <ChevronDown size={20} className="animate-bounce opacity-70" />
        </div>
      </section>

      {/* Featured Projects Section - Interactive Gallery */}
      <section ref={projectsRef} className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column - Project Info */}
            <div className="lg:col-span-5 lg:sticky top-32 self-start">
              <div className="mb-16">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-px bg-[#a53838]"></div>
                  <span className="text-sm tracking-widest text-[#a53838]">
                    FEATURED WORK
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-16">
                  Selected Projects
                </h2>
              </div>

              <div className="space-y-24">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`cursor-pointer transition-all duration-500 ${
                      activeProject === project.id
                        ? "opacity-100"
                        : "opacity-50"
                    }`}
                    onClick={() => setActiveProject(project.id)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-sm font-light">
                        {project.id.toString().padStart(2, "0")}
                      </span>
                      <div
                        className={`w-12 h-px ${
                          activeProject === project.id
                            ? "bg-[#a53838]"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-light mb-4">
                      {project.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Category</p>
                        <p>{project.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Year</p>
                        <p>{project.year}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Location</p>
                        <p>{project.location}</p>
                      </div>
                    </div>
                    <p className="mt-6 font-light max-w-md">
                      {project.description}
                    </p>
                    <button className="mt-6 text-[#a53838] flex items-center gap-2 group">
                      View Project
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        <ArrowRight size={18} />
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Project Images */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 h-[70vh] relative">
                  <div
                    className="absolute inset-0 bg-gray-100 transform transition-transform duration-700 ease-out"
                    style={{
                      transform: `translateY(${
                        activeProject === 1 ? "0%" : "100%"
                      })`,
                    }}
                  ></div>
                  <div
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      activeProject === 1 ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src="/assets/project-1.jpg"
                      alt="Monolithic Residence"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="col-span-7 h-[50vh] relative">
                  <div
                    className="absolute inset-0 bg-gray-100 transform transition-transform duration-700 ease-out"
                    style={{
                      transform: `translateY(${
                        activeProject === 2 ? "0%" : "100%"
                      })`,
                    }}
                  ></div>
                  <div
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      activeProject === 2 ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src="/assets/project-2.jpg"
                      alt="Canvas Gallery"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="col-span-5 h-[50vh] relative">
                  <div
                    className="absolute inset-0 bg-gray-100 transform transition-transform duration-700 ease-out"
                    style={{
                      transform: `translateY(${
                        activeProject === 3 ? "0%" : "100%"
                      })`,
                    }}
                  ></div>
                  <div
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      activeProject === 3 ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src="/assets/project-3.jpg"
                      alt="Floating Pavilion"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="col-span-12 h-[70vh] relative">
                  <div
                    className="absolute inset-0 bg-gray-100 transform transition-transform duration-700 ease-out"
                    style={{
                      transform: `translateY(${
                        activeProject === 4 ? "0%" : "100%"
                      })`,
                    }}
                  ></div>
                  <div
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      activeProject === 4 ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src="/assets/project-4.jpg"
                      alt="Urban Oasis Tower"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section with Full-Width Design */}
      <section className="relative py-40">
        <div className="absolute inset-0 z-0">
          <div className="grid grid-cols-2 h-full">
            <div className="bg-gray-50"></div>
            <div className="bg-white"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-5">
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-px bg-[#a53838]"></div>
                  <span className="text-sm tracking-widest text-[#a53838]">
                    OUR APPROACH
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8">
                  Design Philosophy
                </h2>
              </div>

              <div className="space-y-8">
                <p className="text-lg font-light">
                  We believe in the transformative power of space—how it shapes
                  experiences, influences emotions, and defines cultures.
                </p>
                <p className="text-lg font-light">
                  Our minimalist approach distills architecture to its essential
                  elements, creating environments that are both timeless and
                  forward-thinking.
                </p>
                <div className="pt-8">
                  <button className="border-b-2 border-[#1b1b1b] pb-1 pr-1 flex items-center gap-2 hover:border-[#a53838] hover:text-[#a53838] transition-all duration-300">
                    About Our Process <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 md:col-start-6">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 relative aspect-square">
                  <Image
                    src="/assets/philosophy-1.jpg"
                    alt="Architectural detail"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#a53838]"></div>
                </div>
                <div className="col-span-4 relative aspect-square">
                  <Image
                    src="/assets/philosophy-2.jpg"
                    alt="Material study"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="col-span-5 relative aspect-square">
                  <div className="absolute inset-0 border-2 border-[#1b1b1b]"></div>
                  <div className="absolute inset-6 bg-gray-100 flex items-center justify-center p-4">
                    <p className="text-lg font-light italic text-center">
                      "Architecture is the thoughtful making of space."
                    </p>
                  </div>
                </div>
                <div className="col-span-7 relative aspect-square">
                  <Image
                    src="/assets/philosophy-3.jpg"
                    alt="Design process"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition - Horizontal Scrolling Section */}
      <section className="py-24 overflow-hidden">
        <div className="mb-16 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-[#a53838]"></div>
              <span className="text-sm tracking-widest text-[#a53838]">
                RECOGNITION
              </span>
            </div>
            <h2 className="text-4xl font-light tracking-tight">
              Awards & Publications
            </h2>
          </div>
        </div>

        <div className="relative whitespace-nowrap overflow-x-auto hide-scrollbar pb-8">
          <div className="inline-flex gap-8 pl-8 animate-marquee">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-72 whitespace-normal inline-block">
                <div className="border border-gray-200 p-8">
                  <div className="text-3xl font-light mb-4">0{i + 1}</div>
                  <h3 className="text-xl font-light mb-2">
                    Award Title {i + 1}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    International Architecture Awards, 202{i + 1}
                  </p>
                  <p className="text-sm font-light">
                    Recognition for excellence in sustainable design and
                    innovation.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA with Split Design */}
      <section className="relative py-32">
        <div className="absolute inset-0 z-0">
          <div className="grid grid-cols-2 h-full">
            <div className="bg-[#1b1b1b]"></div>
            <div className="bg-white"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-6xl font-light text-white mb-8 leading-tight">
                Ready to create something extraordinary?
              </h2>
              <div className="w-16 h-1 bg-[#a53838] mb-8"></div>
              <p className="text-lg font-light text-gray-300 mb-12 max-w-md">
                Let's collaborate on your next architectural vision and push the
                boundaries of what's possible.
              </p>
              <button className="bg-[#a53838] text-white px-12 py-4 hover:bg-[#8c2e2e] transition-all duration-300 flex items-center gap-3">
                Get in Touch <ExternalLink size={18} />
              </button>
            </div>

            <div className="flex items-center justify-center">
              <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                <div className="col-span-2">
                  <p className="text-lg font-light mb-2">Visit Us</p>
                  <p className="text-sm">123 Design District</p>
                  <p className="text-sm">New York, NY 10001</p>
                </div>
                <div>
                  <p className="text-lg font-light mb-2">Email</p>
                  <p className="text-sm">hello@studio.com</p>
                </div>
                <div>
                  <p className="text-lg font-light mb-2">Phone</p>
                  <p className="text-sm">+1 (212) 555-0123</p>
                </div>
                <div className="col-span-2 pt-6">
                  <p className="text-lg font-light mb-4">Follow Us</p>
                  <div className="flex gap-6">
                    <div className="w-8 h-8 border border-[#1b1b1b] flex items-center justify-center">
                      <span className="text-sm">IG</span>
                    </div>
                    <div className="w-8 h-8 border border-[#1b1b1b] flex items-center justify-center">
                      <span className="text-sm">LI</span>
                    </div>
                    <div className="w-8 h-8 border border-[#1b1b1b] flex items-center justify-center">
                      <span className="text-sm">BE</span>
                    </div>
                    <div className="w-8 h-8 border border-[#1b1b1b] flex items-center justify-center">
                      <span className="text-sm">FB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for hiding scrollbar but allowing scroll */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </main>
  );
}
