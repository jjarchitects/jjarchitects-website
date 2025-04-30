"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const AboutPage = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef(null);
  const statsSectionRef = useRef(null);
  const statsItems = useRef<(HTMLSpanElement | null)[]>([]);
  const decorRef = useRef(null);

  // Register ScrollTrigger plugin
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  // Animation sequence
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animations
      const mainTl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });

      // Title and subtitle animation
      mainTl
        .from(titleRef.current, {
          y: -40,
          opacity: 0,
          duration: 0.8,
        })
        .from(
          subtitleRef.current,
          {
            y: -20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.5"
        )
        .from(
          decorRef.current,
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.8,
          },
          "-=0.4"
        );

      // Content section animation
      if (textRef.current) {
        gsap.from(textRef.current.querySelectorAll("p"), {
          y: 30,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }

      // Image animation
      gsap.fromTo(
        imageRef.current,
        {
          y: 40,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Stats section animation
      gsap.from(statsSectionRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: statsSectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Stats counter animation
      statsItems.current.forEach((item) => {
        // const value = parseInt(item.getAttribute("data-value"), 10);
        gsap.from(item, {
          textContent: 0,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          stagger: 0.2,
          scrollTrigger: {
            trigger: statsSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate: function () {
            if (item) {
              item.textContent = Math.ceil(
                Number(this.targets()[0].textContent)
              ).toString();
            }
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className=" bg-white text-carbon z-10 w-11/12 py-16 max-w-7xl mx-auto"
    >
      <div ref={titleRef} className="mb-12 contact-title">
        <h1 className="text-5xl font-light uppercase tracking-wider mb-6 text-[#1b1b1b]">
          About us
        </h1>
        <div ref={decorRef} className="w-20 h-1 bg-copper mt-6"></div>
      </div>

      {/* Hero Section */}

      {/* Content Section */}
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 md:gap-16">
          {/* Text Content */}
          <div ref={textRef} className="lg:w-1/2 space-y-6">
            <h3 className="text-2xl md:text-3xl font-semibold text-copper">
              Who Is John Doe?
            </h3>
            <p className="text-base md:text-lg leading-relaxed text-carbon-400 text-justify">
              John Doe is a passionate architect and designer with a strong
              focus on sustainable innovation, user-centered design, and modern
              aesthetics. With over a decade of experience crafting immersive
              spaces, John&#39;s vision bridges timeless elegance with
              contemporary function.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-carbon-400 text-justify">
              At the heart of every project lies a story—one that John
              translates into every line, curve, and texture. Whether it&#39;s a
              residential haven or a public installation, his work is a fusion
              of form, functionality, and emotion.
            </p>
            <div className="relative pl-5 border-l-2 border-copper/40 my-10 text-justify">
              <p className="text-lg md:text-xl italic text-carbon/80 font-light">
                &quot;Architecture is not about building the impossible, which
                we can do if we have enough money and enough tools and enough
                computers. It&apos;s about building what is appropriate and
                about attaining beauty through such an approach.&quot;
              </p>
              <p className="text-right text-sm text-copper mt-3">— John Doe</p>
            </div>
          </div>

          {/* Image and Stats */}
          <div className="lg:w-1/2 flex flex-col items-center gap-12">
            {/* Image with decorative elements */}
            <div ref={imageRef} className="relative w-full max-w-md mx-auto">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-copper opacity-30"></div>
              <div className="relative overflow-hidden">
                <Image
                  src="/assets/aboutus/john-doe.png"
                  alt="John Doe"
                  width={500}
                  height={600}
                  className="w-full object-cover h-auto shadow-lg transition-all duration-700 ease-in-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100  transition-opacity duration-300"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-2/3 h-1/2 border-2 border-copper opacity-30"></div>
            </div>

            {/* Stats Section */}
            {/* <div
              ref={statsSectionRef}
              className="w-full grid grid-cols-2 gap-4 mt-8"
            >
              <div className="bg-[#f8f8f8] p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <span
                  ref={(el) => {
                    statsItems.current[0] = el;
                  }}
                  data-value="12"
                  className="text-4xl font-bold text-[#a53838]"
                >
                  7
                </span>
                <span className="text-sm uppercase tracking-wider text-[#1b1b1b]/70 mt-1">
                  Years Experience
                </span>
              </div>

              <div className="bg-[#f8f8f8] p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <span
                  ref={(el) => {
                    statsItems.current[1] = el;
                  }}
                  data-value="75"
                  className="text-4xl font-bold text-[#a53838]"
                >
                  45
                </span>
                <span className="text-sm uppercase tracking-wider text-[#1b1b1b]/70 mt-1">
                  Projects Completed
                </span>
              </div>


              <div className="bg-[#f8f8f8] p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <span
                  ref={(el) => (statsItems.current[2] = el)}
                  data-value="18"
                  className="text-4xl font-bold text-[#a53838]"
                >
                  18
                </span>
                <span className="text-sm uppercase tracking-wider text-[#1b1b1b]/70 mt-1">
                  Awards Won
                </span>
              </div>


              <div className="bg-[#f8f8f8] p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <span
                  ref={(el) => (statsItems.current[3] = el)}
                  data-value="9"
                  className="text-4xl font-bold text-[#a53838]"
                >
                  9
                </span>
                <span className="text-sm uppercase tracking-wider text-[#1b1b1b]/70 mt-1">
                  Countries
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Approach Section */}
      {/* <div className="w-full bg-[#f8f8f8] py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                Our <span className="text-[#a53838]">Approach</span>
              </h3>
              <div className="w-16 h-1 bg-[#a53838] mb-6"></div>
              <p className="text-base md:text-lg leading-relaxed text-[#1b1b1b]/80">
                We believe in architecture that responds to its context,
                embraces sustainability, and creates meaningful experiences for
                those who inhabit it.
              </p>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px]">
                <div className="w-12 h-12 flex items-center justify-center border border-[#a53838]/20 rounded-md mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#a53838]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg text-[#1b1b1b] mb-2">
                  Human-Centered
                </h4>
                <p className="text-[#1b1b1b]/70 text-sm">
                  We design spaces that enhance human experiences and
                  connections.
                </p>
              </div>

              <div className="bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px]">
                <div className="w-12 h-12 flex items-center justify-center border border-[#a53838]/20 rounded-md mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#a53838]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg text-[#1b1b1b] mb-2">
                  Sustainable
                </h4>
                <p className="text-[#1b1b1b]/70 text-sm">
                  Creating environmentally responsible designs for future
                  generations.
                </p>
              </div>

              <div className="bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px]">
                <div className="w-12 h-12 flex items-center justify-center border border-[#a53838]/20 rounded-md mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#a53838]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg text-[#1b1b1b] mb-2">
                  Innovative
                </h4>
                <p className="text-[#1b1b1b]/70 text-sm">
                  Exploring new ideas, materials and techniques to push
                  boundaries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AboutPage;
