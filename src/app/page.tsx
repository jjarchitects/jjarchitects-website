"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";
import projects from "@/data/projectsData.json";
import testimonialsData from "@/data/testimonialsData.json";
import businessData from "@/data/businessData.json";
import SocialMedia from "@/components/SocialMedia";

export default function Home() {
  // const [isLoaded, setIsLoaded] = useState(false);
  const [activeProject, setActiveProject] = useState("project-1");
  const [featuredProjects] = useState<Project[]>(
    projects.filter((project) => project.featured).slice(0, 5) as Project[]
  );
  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const marqueeRef = useRef(null);

  // Register GSAP plugins
  useEffect(() => {
    const registerScrollTo = async () => {
      const ScrollToPlugin = (await import("gsap/dist/ScrollToPlugin"))
        .ScrollToPlugin;
      gsap.registerPlugin(ScrollToPlugin);
    };

    registerScrollTo();
  }, []);

  // Initial animations and setup
  useEffect(() => {
    // setIsLoaded(true);

    // GSAP timeline for hero section animations
    const heroTl = gsap.timeline();

    heroTl
      .fromTo(
        ".hero-content",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.3 }
      )
      .fromTo(
        ".hero-image-container",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.1 },
        "-=0.8"
      );

    // Parallax scrolling effect with GSAP
    const parallaxElements = document.querySelectorAll(".parallax");

    parallaxElements.forEach((element) => {
      const speed = element.getAttribute("data-speed");

      gsap.to(element, {
        y: () => window.innerHeight * parseFloat(speed || "0"),
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // Project section animations
    gsap.from(".featured-work-header", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: {
        trigger: ".featured-work-header",
        start: "top 80%",
      },
    });

    // Awards marquee animation with GSAP
    gsap.to(marqueeRef.current, {
      x: "-50%",
      duration: 30,
      repeat: -1,
      ease: "none",
    });

    // Clean up ScrollTrigger on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Project animations when active project changes
  useEffect(() => {
    // Animate project details
    gsap.fromTo(
      `.project-${activeProject}`,
      { opacity: 0.5 },
      { opacity: 1, duration: 0.4 }
    );

    // Other projects fade out
    projects.forEach((project) => {
      if (project.id !== activeProject) {
        gsap.to(`.project-${project.id}`, { opacity: 0.5, duration: 0.4 });
      }
    });

    // Animate project images
    gsap.to(`.project-image-overlay-${activeProject}`, {
      yPercent: 0,
      duration: 0.7,
      ease: "power3.out",
    });

    gsap.to(`.project-image-${activeProject}`, {
      opacity: 1,
      duration: 0.7,
    });

    // Hide other project images
    projects.forEach((project) => {
      if (project.id !== activeProject) {
        gsap.to(`.project-image-overlay-${project.id}`, {
          yPercent: 100,
          duration: 0.7,
          ease: "power3.out",
        });

        gsap.to(`.project-image-${project.id}`, {
          opacity: 0,
          duration: 0.7,
        });
      }
    });
  }, [activeProject]);

  const scrollToProjects = () => {
    if (projectsRef.current) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: projectsRef.current },
        ease: "power3.inOut",
      });
    }
  };

  return (
    <main className="bg-white text-carbon overflow-hidden">
      {/* Hero Section with Split Layout */}
      <section
        ref={heroRef}
        className="min-h-screen relative flex flex-col lg:flex-row"
      >
        {/* Left Column */}
        <div className="absolute top-0 left-0 w-full lg:w-4/12 md:h-screen z-10 flex items-center justify-center p-8">
          <div className="hero-content">
            <div className="max-w-xl">
              <h1 className="text-5xl md:text-5xl xlg:!text-7xl font-light tracking-tighter mb-6 leading-tight text-carbon-300">
                REDEFINING <br />
                <span>ARCHITECTURAL</span>
                <br /> BOUNDARIES
              </h1>
              <div className="w-16 h-1 bg-copper mb-8"></div>
              {/* <p className="text-lg md:text-xl max-w-md mb-12 font-light leading-relaxed">
                Creating spaces where minimalism meets functionality, where
                every line has purpose, and every void tells a story.
              </p> */}
              <div className="h-5 md:h-[40px]"></div>
              <div className="flex space-x-6">
                <button
                  onClick={scrollToProjects}
                  className="border-b-2 border-carbon pb-1 pr-1 flex items-center gap-2 hover:border-copper hover:text-copper transition-all duration-300"
                >
                  View Projects <ArrowRight size={16} />
                </button>
                <Link
                  href="/about"
                  className="border-b-2 border-transparent pb-1 pr-1 flex items-center gap-2 hover:border-copper hover:text-copper transition-all duration-300"
                >
                  About Studio <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Visual Elements */}
        <div className="absolute top-[45%] md:top-0 h-1/2 md:right-0 w-full lg:w-8/12 md:h-screen bg-taupe-100. overflow-hidden">
          {/* Abstract Architectural Elements */}
          <div
            className="absolute top-1/3 md:top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 border-2 border-copper parallax"
            data-speed="-0.05"
          ></div>
          <div
            className="absolute right-26 top-30 md:top-2/6 md:right-1/4 w-30 h-30 md:w-80 md:h-80 bg-taupe-300 parallax"
            data-speed="0.02"
          ></div>

          {/* Main Image */}
          <div className="absolute bottom-[21rem] md:bottom-0 md:right-0 inset-0 flex items-center justify-center">
            {/* <div className="hero-image-container relative w-5/5 h-5/5 md:w-4/5 md:h-3/5">
              <Image
                src="/assets/sketch.svg"
                alt="Architectural sketch"
                fill
                className="object-contain select-none pointer-events-none p-4 md:p-0"
                priority
              />
            </div> */}

            <div className="hero-image-container bg-white/60 mt-0 md:mt-0 relative w-full h-full md:w-5/5 md:h-full">
              <img
                src={`/assets/home_sketch.png`}
                alt="Architectural sketch"
                className="object-contain select-none pointer-events-none p-4 md:p-0 grayscale opacity-70"
              />
            </div>
          </div>

          {/* Decorative Grid */}
          {/* <div className="absolute inset-0 grid grid-cols-8 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-full border-l border-gray-200"></div>
            ))}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-full border-t border-gray-200"></div>
            ))}
          </div> */}
        </div>

        {/* Scroll Indicator */}
        <div
          onClick={scrollToProjects}
          className="absolute bottom-18 left-1/2 transform -translate-x-1/2 flex-col items-center z-20 animate-bounce hidden md:flex"
        >
          <p className="text-xs tracking-widest mb-1 opacity-70">SCROLL</p>
          <ChevronDown size={20} className="scroll-indicator opacity-70" />
        </div>
      </section>

      {/* Featured Projects Section - Interactive Gallery */}
      <section ref={projectsRef} className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column - Project Info */}
            <div className="lg:col-span-5 lg:sticky top-32 self-start">
              <div className="mb-16 featured-work-header">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-px bg-copper"></div>
                  <span className="text-sm tracking-widest text-copper">
                    FEATURED WORK
                  </span>
                </div>
                {/* <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-16">
                  Selected Projects
                </h2> */}
              </div>

              {/* <div className="lg:col-span-7">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 h-[70vh] relative">
                    <div
                      className={`absolute inset-0 bg-gray-100 transform project-image-overlay-1`}
                      style={{
                        transform: `translateY(0%)`,
                      }}
                    ></div>
                    <div
                      className={`absolute inset-0 project-image-1`}
                      style={{ opacity: 1 }}
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
                      className={`absolute inset-0 bg-gray-100 transform project-image-overlay-2`}
                      style={{
                        transform: `translateY(100%)`,
                      }}
                    ></div>
                    <div
                      className={`absolute inset-0 project-image-2`}
                      style={{ opacity: 0 }}
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
                      className={`absolute inset-0 bg-gray-100 transform project-image-overlay-3`}
                      style={{
                        transform: `translateY(100%)`,
                      }}
                    ></div>
                    <div
                      className={`absolute inset-0 project-image-3`}
                      style={{ opacity: 0 }}
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
                      className={`absolute inset-0 bg-gray-100 transform project-image-overlay-4`}
                      style={{
                        transform: `translateY(100%)`,
                      }}
                    ></div>
                    <div
                      className={`absolute inset-0 project-image-4`}
                      style={{ opacity: 0 }}
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
              </div> */}

              {/* ---------------------------------------------------------------------------------------------------------------- */}

              <div className="space-y-24">
                {featuredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`project-${project.id}`}
                    onClick={() => setActiveProject(project.id)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-sm font-light">
                        {(index + 1).toString()?.padStart(2, "0")}
                      </span>
                      <div
                        className={`w-12 h-px ${
                          activeProject === project.id
                            ? "bg-copper"
                            : "bg-carbon-200"
                        }`}
                      ></div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-light mb-4">
                      {project.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-carbon-300 mb-1">Category</p>
                        <p>{project.type}</p>
                      </div>
                      <div>
                        <p className="text-carbon-300 mb-1">Year</p>
                        <p>{project.year}</p>
                      </div>
                      <div>
                        <p className="text-carbon-300 mb-1">Location</p>
                        <p>{project.location}</p>
                      </div>
                    </div>
                    <p className="mt-6 font-light max-w-md">
                      {project.description}
                    </p>
                    <Link
                      href={`/projects/${project.id}`}
                      className="mt-6 text-copper flex items-center gap-2 group"
                    >
                      View Project
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        <ArrowRight size={18} />
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Project Images */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-12 gap-4">
                {featuredProjects.map((project, index) => (
                  <div
                    key={index}
                    className={`${
                      index === 1
                        ? "col-span-6"
                        : index === 2
                        ? "col-span-6"
                        : "col-span-12"
                    } h-[70vh] relative`}
                  >
                    <div className={`absolute inset-0 project-image-1`}>
                      <Image
                        src={project.thumbnail}
                        alt="Monolithic Residence"
                        fill
                        className={`object-cover absolute inset-0 project-image-1 transition-all duration-300 ease-in-out ${
                          activeProject === project.id
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    </div>
                  </div>
                ))}

                {/* <div className="col-span-12 h-[70vh] relative">
                  <div
                    className={`absolute inset-0 bg-gray-100 transform project-image-overlay-1`}
                    style={{
                      transform: `translateY(0%)`,
                    }}
                  ></div>
                  <div
                    className={`absolute inset-0 project-image-1`}
                    style={{ opacity: 1 }}
                  >
                    <Image
                      src="/assets/project_1.jpg"
                      alt="Monolithic Residence"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="col-span-7 h-[50vh] relative">
                  <div
                    className={`absolute inset-0 bg-gray-100 transform project-image-overlay-2`}
                    style={{
                      transform: `translateY(100%)`,
                    }}
                  ></div>
                  <div
                    className={`absolute inset-0 project-image-2`}
                    style={{ opacity: 0 }}
                  >
                    <Image
                      src="/assets/project_2.jpg"
                      alt="Canvas Gallery"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="col-span-5 h-[60vh] relative">
                  <div
                    className={`absolute inset-0 bg-gray-100 transform project-image-overlay-3`}
                    style={{
                      transform: `translateY(100%)`,
                    }}
                  ></div>
                  <div
                    className={`absolute inset-0 project-image-3`}
                    style={{ opacity: 0 }}
                  >
                    <Image
                      src="/assets/project_3.jpg"
                      alt="Floating Pavilion"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="col-span-12 h-[70vh] relative">
                  <div
                    className={`absolute inset-0 bg-gray-100 transform project-image-overlay-4`}
                    style={{
                      transform: `translateY(100%)`,
                    }}
                  ></div>
                  <div
                    className={`absolute inset-0 project-image-4`}
                    style={{ opacity: 0 }}
                  >
                    <Image
                      src="/assets/project_2.jpg"
                      alt="Urban Oasis Tower"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section with Full-Width Design */}
      <section className="relative py-20 md:py-40">
        <div className="absolute inset-0 z-0">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            <div className="bg-gray-50"></div>
            <div className="bg-white"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            <div className="md:col-span-5 philosophy-text">
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

              <div className="space-y-4 md:space-y-8">
                <p className="text-base md:text-lg font-light">
                  We believe in the transformative power of space—how it shapes
                  experiences, influences emotions, and defines cultures.
                </p>
                <p className="text-base md:text-lg font-light">
                  Our minimalist approach distills architecture to its essential
                  elements, creating environments that are both timeless and
                  forward-thinking.
                </p>
                {/* <div className="pt-4 md:pt-8">
                  <button className="border-b-2 border-carbon pb-1 pr-1 flex items-center gap-2 hover:border-copper hover:text-copper transition-all duration-300">
                    About Our Process <ArrowRight size={16} />
                  </button>
                </div> */}
              </div>
            </div>

            <div className="md:col-span-7 md:col-start-6 philosophy-images mt-8 md:mt-0">
              <div className="grid grid-cols-12 gap-3 md:gap-6">
                <div className="col-span-8 relative aspect-square">
                  <Image
                    src="/assets/project_1.jpg"
                    alt="Architectural detail"
                    fill
                    className="object-cover z-1"
                  />
                  {/* <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-12 h-12 sm:w-24 sm:h-24 bg-[#a53838]"></div> */}
                  <div className="absolute -bottom-3 -right-3 w-56 h-44 bg-copper"></div>
                </div>
                <div className="col-span-4 relative aspect-square">
                  <Image
                    src="/assets/project_2.jpg"
                    alt="Material study"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="col-span-5 relative aspect-square md:m-0 mt-2">
                  <div className="absolute inset-0 border-2 border-carbon"></div>
                  <div className="absolute inset-2 sm:inset-4 md:inset-6 bg-gray-100 flex items-center justify-center p-2 sm:p-4">
                    <p className="text-sm sm:text-base md:text-lg font-light italic text-center">
                      &quot;Architecture is the thoughtful making of
                      space.&quot;
                    </p>
                  </div>
                </div>
                <div className="col-span-7 relative aspect-square md:m-0 mt-2">
                  <Image
                    src="/assets/project_3.jpg"
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
        <div className="mb-16 px-8 awards-section">
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
        </div>

        <div className="relative whitespace-nowrap overflow-x-hidden pb-8">
          <div ref={marqueeRef} className="inline-flex gap-8 pl-8">
            {testimonialsData.map((testimonial) => (
              <div
                key={testimonial.id}
                className="w-72 whitespace-normal inline-block"
              >
                <div className="border h-[330px] border-gray-200 p-8">
                  <div className="text-3xl font-light mb-4">
                    0{testimonial.id}
                  </div>
                  <h3 className="text-xl font-light mb-2.">
                    {testimonial.name}
                  </h3>
                  <p className="text-[12px] leading-5 text-gray-600 mb-4">
                    {testimonial.title}
                  </p>
                  <p className="text-sm font-light">
                    {testimonial.testimonial}
                  </p>
                </div>
              </div>
            ))}

            {/* Duplicate items for seamless loop */}
            {testimonialsData.map((testimonial) => (
              <div
                key={testimonial.id}
                className="w-72 whitespace-normal inline-block"
              >
                <div className="border h-[330px] border-gray-200 p-8">
                  <div className="text-3xl font-light mb-4">
                    0{testimonial.id}
                  </div>
                  <h3 className="text-xl font-light mb-2.">
                    {testimonial.name}
                  </h3>
                  <p className="text-[12px] leading-5 text-gray-600 mb-4">
                    {testimonial.title}
                  </p>
                  <p className="text-sm font-light">
                    {testimonial.testimonial}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA with Split Design */}
      <section className="relative py-16 sm:py-24 md:py-32 contact-section">
        <div className="absolute inset-0 z-0">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            <div className="bg-taupe-100 bg-gradient-to-t. from-zinc-900 to-black"></div>
            <div className="bg-white hidden md:block"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="contact-left">
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
                className="bg-copper text-white px-8 py-3 md:px-12 md:py-4 hover:bg-copper-600 transition-all duration-300 flex items-center gap-3 w-fit"
              >
                Get in Touch <ExternalLink size={18} />
              </Link>
            </div>

            <div className="flex items-center justify-center contact-right bg-white text-carbon md:bg-transparent p-6 md:p-0 mt-8 md:mt-0">
              <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-md">
                <div className="col-span-2">
                  <p className="text-base md:text-lg font-light mb-2">
                    Visit Us
                  </p>
                  <a
                    href={`${businessData.contactDetails.address_link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm"
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
                <div>
                  <p className="text-base md:text-lg font-light mb-2">Email</p>
                  <a
                    href={`mailto:${businessData.contactDetails.email}`}
                    className="text-sm"
                  >
                    {businessData.contactDetails.email}
                  </a>
                </div>
                <div>
                  <p className="text-base md:text-lg font-light mb-2">Phone</p>
                  <a
                    href={`tel:${businessData.contactDetails.phone}`}
                    className="text-sm"
                  >
                    {businessData.contactDetails.phone}
                  </a>
                </div>
                <SocialMedia />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional GSAP animations for scroll sections */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          // Additional GSAP animations to be applied after component mount
          document.addEventListener('DOMContentLoaded', () => {
            // Scroll indicator pulsing animation
            gsap.to('.scroll-indicator', {
              y: 10,
              duration: 1.2,
              repeat: -1,
              yoyo: true,
              ease: "power2.inOut"
            });
            
            // Philosophy section animations
            gsap.from('.philosophy-text', {
              x: -50,
              opacity: 0,
              duration: 1,
              scrollTrigger: {
                trigger: '.philosophy-text',
                start: 'top 70%'
              }
            });
            
            gsap.from('.philosophy-images > div', {
              y: 50,
              opacity: 0,
              duration: 1,
              stagger: 0.2,
              scrollTrigger: {
                trigger: '.philosophy-images',
                start: 'top 70%'
              }
            });
            
            // Awards section animations
            gsap.from('.awards-section', {
              y: 30,
              opacity: 0,
              duration: 0.8,
              scrollTrigger: {
                trigger: '.awards-section',
                start: 'top 80%'
              }
            });
            
            // Contact section animations
            gsap.from('.contact-left', {
              x: -50,
              opacity: 0,
              duration: 1,
              scrollTrigger: {
                trigger: '.contact-section',
                start: 'top 70%'
              }
            });
            
            gsap.from('.contact-right', {
              x: 50,
              opacity: 0,
              duration: 1,
              scrollTrigger: {
                trigger: '.contact-section',
                start: 'top 70%'
              }
            });
          });
        `,
        }}
      />

      {/* Custom CSS for hiding scrollbar but allowing scroll */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Extra Responsive Styles */
        @media (max-width: 640px) {
          .hero-content {
            padding: 0 1rem;
          }
        }
      `}</style>
    </main>
  );
}
