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
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [hoveredImage, setHoveredImage] = useState<
    null | "image1" | "image2" | "image3" | "image4"
  >(null);
  // const [isLoaded, setIsLoaded] = useState(false);
  const [featuredProjects] = useState<Project[]>(
    projects.filter((project) => project.featured).slice(0, 5) as Project[]
  );
  const [activeProject, setActiveProject] = useState(featuredProjects[0].id);
  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const marqueeRef = useRef(null);

  const goToAbout = () => {
    router.push("/about");
  };

  useEffect(() => {
    if (featuredProjects.length === 0) return;

    let index = 0;

    const interval = setInterval(() => {
      setActiveProject(featuredProjects[index].id);
      index = (index + 1) % featuredProjects.length;
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProjects]);

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
    <main className="bg-white text-carbon">
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
              <div className="h-5 md:h-[40px]"></div>
              <div className="flex space-x-6">
                <button
                  onClick={scrollToProjects}
                  className="border-b-2 border-carbon pb-1 pr-1 flex items-center gap-2 hover:border-copper hover:text-copper transition-all duration-300"
                >
                  View Projects <ArrowRight size={16} />
                </button>
                <button
                  // href="/about"
                  onClick={goToAbout}
                  className="border-b-2 border-transparent pb-1 pr-1 flex items-center gap-2 hover:border-copper hover:text-copper transition-all duration-300"
                >
                  About Studio <ArrowRight size={16} />
                </button>
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
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-full border-l border-gray-200"></div>
            ))}
            {[...Array(6)].map((_, i) => (
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

      {/* Featured Projects Section - Modern Interactive Gallery */}
      <section
        ref={projectsRef}
        className="py-32 px-8 bg-gradient-to-b from-zinc-50 to-white mb-[12rem]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column - Project Navigation (Scrollable) */}
            <div className="lg:col-span-5">
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-px bg-copper"></div>
                  <span className="text-sm font-medium tracking-wider text-copper uppercase sticky top-0">
                    Featured Work
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {featuredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`group p-6 transition-all duration-500 ease-out border-l-4 shadow-md ${
                      activeProject === project.id
                        ? "bg-taupe-200 shadow-xl shadow-zinc-200 border-l-copper border-r border-t border-b border-carbon-100"
                        : "hover:bg-zinc-100/50 hover:shadow-lg border-l-zinc-200 hover:border-l-zinc-300"
                    }`}
                    onClick={() => setActiveProject(project.id)}
                  >
                    {/* Project Number & Status Indicator */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-zinc-400">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <div
                          className={`w-16 h-px transition-all duration-300 ${
                            activeProject === project.id
                              ? "bg-copper"
                              : "bg-zinc-200 group-hover:bg-zinc-300"
                          }`}
                        ></div>
                      </div>
                      <div
                        className={`w-2 h-2 transition-all duration-300 ${
                          activeProject === project.id
                            ? "bg-copper shadow-lg shadow-copper/30"
                            : "bg-zinc-300 group-hover:bg-zinc-400"
                        }`}
                      ></div>
                    </div>

                    {/* Project Title */}
                    <h3
                      className={`text-xl md:text-2xl font-light mb-4 transition-colors duration-300 ${
                        activeProject === project.id
                          ? "text-zinc-900"
                          : "text-zinc-700 group-hover:text-zinc-900"
                      }`}
                    >
                      {project.title}
                    </h3>

                    {/* Project Meta Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-zinc-400 mb-1 text-xs uppercase tracking-wide">
                          Category
                        </p>
                        <p className="text-zinc-600 font-medium">
                          {project.type}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-400 mb-1 text-xs uppercase tracking-wide">
                          Year
                        </p>
                        <p className="text-zinc-600 font-medium">
                          {project.year}
                        </p>
                      </div>
                    </div>

                    {/* Project Description - Only show for active */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        activeProject === project.id
                          ? "max-h-32 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-zinc-600 font-light leading-relaxed mb-4">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-zinc-400 text-sm">
                          {project.location}
                        </p>
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-copper hover:text-copper-600 flex items-center gap-2 group/link font-medium text-sm"
                        >
                          View Project
                          <ArrowRight
                            size={16}
                            className="group-hover/link:translate-x-1 transition-transform duration-300"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Project Image Display (Sticky) */}
            <div className="lg:col-span-7 sticky top-5 h-fit">
              <div className="h-screen flex items-center">
                <div className="relative w-full h-[80vh] overflow-hidden shadow-2xl shadow-zinc-900/10">
                  {/* Background gradient for loading state */}
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200"></div>

                  {featuredProjects.map((project) => (
                    <div
                      key={project.id}
                      className={`absolute inset-0 transition-all duration-700 ease-out ${
                        activeProject === project.id
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      }`}
                    >
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority={activeProject === project.id}
                      />

                      {/* Overlay gradient for better text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-carbon-500/50 via-transparent to-transparent"></div>

                      {/* Project title overlay */}
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="bg-carbon/60 backdrop-blur-sm shadow-lg p-6">
                          <h4 className="text-xl font-light text-white mb-2">
                            {project.title}
                          </h4>
                          <p className="text-carbon-200 text-sm">
                            {project.type} • {project.year}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation dots */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                  <div className="flex justify-center gap-3 mt-8">
                    {featuredProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => setActiveProject(project.id)}
                        className={`w-2 h-2 transition-all duration-300 ${
                          activeProject === project.id
                            ? "bg-copper w-8"
                            : "bg-zinc-300 hover:bg-zinc-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
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

              <div className="space-y-4 md:space-y-8 text-justify">
                <p
                  className={`transition-all duration-300 p-3 ${
                    hoveredImage === "image1"
                      ? "bg-copper text-white shadow-lg"
                      : ""
                  }`}
                >
                  We organize spaces through deliberate proximity, allowing
                  related functions to support each other naturally. Gathering
                  points are not afterthoughts; they are connectors —
                  transitional and social anchors that enrich the spatial
                  narrative.
                </p>

                <p
                  className={`transition-all duration-300 p-3 ${
                    hoveredImage === "image3"
                      ? "bg-copper text-white shadow-lg"
                      : ""
                  }`}
                >
                  Beneath the auditorium, what could have been an idle void
                  becomes a deliberate gesture — a porch that invites pause,
                  interaction, and connection. We believe even the underside of
                  architecture holds potential, and when shaped with intent,
                  every shadow can serve a purpose.
                </p>

                <p
                  className={`transition-all duration-300 p-3 ${
                    hoveredImage === "image2"
                      ? "bg-copper text-white shadow-lg"
                      : ""
                  }`}
                >
                  We use architectural elements like colonnades not merely as
                  stylistic choices, but as tools to define boundaries, control
                  visibility, and mediate relationships between users and space.
                  Every line drawn, every void created, is intentional — serving
                  both purpose and perception.
                </p>

                <p
                  className={`transition-all duration-300 ${
                    hoveredImage === "image4"
                      ? "bg-copper text-white font-semibold p-4 shadow-lg transform"
                      : ""
                  }`}
                >
                  Our work reflects a balance between openness and order,
                  movement and pause — where structure guides, but does not
                  dictate. Always, our aim is to design with meaning, clarity,
                  and enduring simplicity.
                </p>
              </div>
            </div>

            <div className="md:col-span-7 md:col-start-6 philosophy-images mt-8 md:mt-0">
              <div className="grid grid-cols-12 gap-3 md:gap-6">
                <div
                  className="col-span-8 relative aspect-square duration-300 hover:contrast-110"
                  onMouseEnter={() => setHoveredImage("image1")}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <Image
                    src="/assets/project_4.jpg"
                    alt="Architectural detail"
                    fill
                    className="object-cover z-1 hover:scale-105 duration-300 border-2 border-carbon-300"
                  />
                  <div className="absolute -bottom-2 -right-2 w-56 h-44 bg-copper"></div>
                </div>

                <div
                  className="col-span-4 relative aspect-square duration-300 hover:contrast-110"
                  onMouseEnter={() => setHoveredImage("image2")}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <Image
                    src="/assets/project_2.jpg"
                    alt="Material study"
                    fill
                    className="object-cover hover:scale-105 duration-300 border-l-2 border-b-2 border-carbon-300"
                  />
                </div>

                <div className="col-span-4 relative aspect-square md:m-0 mt-2">
                  <div className="absolute inset-0 border-2 border-carbon-300"></div>
                  <div className="absolute inset-2 sm:inset-4 md:inset-6 bg-gray-100 flex items-center justify-center p-2 sm:p-4">
                    <p className="text-sm sm:text-base md:text-lg font-light italic text-center">
                      &quot;Architecture is the thoughtful making of
                      space.&quot;
                    </p>
                  </div>
                </div>

                <div
                  className="col-span-8 relative md:m-0 mt-2 duration-300 hover:contrast-110"
                  onMouseEnter={() => setHoveredImage("image3")}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <Image
                    src="/assets/project_1.jpg"
                    alt="Design process"
                    fill
                    className="object-cover hover:scale-105 duration-300 border-t-2 border-l-2 border-carbon-300"
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
                <div className="col-span-2 md:col-span-1">
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
                <div className="col-span-2 md:col-span-1">
                  <SocialMedia />
                </div>
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
