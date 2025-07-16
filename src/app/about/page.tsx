"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const data = {
  name: "Jatan Joshi",
  aboutJatanJoshi:
    "Jatan Joshi is a passionate architect whose journey began with a childhood love for drawing and art. Growing up in a family connected to the construction industry, he was naturally drawn to the world of building and design. After completing his Architecture degree from SVIT Vasad, Jatan honed his expertise working with dynamic teams across Gujarat's metro cities, including Ahmedabad and Vadodara. With over 7 years of experience in diverse architectural projects, he founded his practice in 2018 in Bhuj-Kutch, bringing metropolitan design sensibilities to his hometown while serving clients across India.",
  ourPractice:
    "Jatan Joshi Architects, established in 2018 and based in the historic city of Bhuj-Kutch, Gujarat, is a comprehensive architectural practice specializing in Architectural Planning, Liaison Services, Construction, Interior Design, and Turnkey Projects. While rooted in the cultural heritage of Kutch, our practice extends its services pan-India, combining local wisdom with contemporary design excellence.",
  ourPhilosophy:
    "Every home represents a family's dreams, and we consider ourselves privileged to be part of that journey. Our design philosophy centers on creating spaces that seamlessly blend visual appeal with practical functionality. We believe architecture should respond to its context – whether honoring traditional Gujarati elements or embracing modern aesthetics that our clients desire.\n \n Each project begins with understanding the site's unique climate, cultural context, and the client's vision. We foster a strong connection with nature in our designs, ensuring that every space we create brings comfort, liveliness, and well-being to its inhabitants. Our work reflects deep cultural values while thoughtfully shaping how people interact with their surroundings.",
  ourExpertise:
    "While we embrace versatility across project types, residential architecture holds a special place in our practice. From intimate bungalows to luxurious penthouses, we've crafted diverse living spaces that reflect our clients' lifestyles and aspirations. Our portfolio spans various scales and typologies: *Residential Projects*: Bungalows, apartments, penthouses, and custom homes *Commercial Ventures*: Clinics, shopping complexes, offices, resorts, and restaurants Cultural & Event Spaces: Including our notable work on the entrance design for Vibrant Gujarat, the state's premier annual event held in Gandhinagar",
  ourApproach:
    "Drawing from extensive experience in Gujarat's metropolitan markets, we bring a unique perspective to every project. Our approach balances contemporary design trends with timeless architectural principles, ensuring each creation remains relevant and cherished for years to come. We understand that while modern aesthetics are often preferred, the soul of good architecture lies in its ability to enhance daily life.",
  outTeam:
    "*Mr. Jatan Joshi* - Principal Architect & Founder \n *Mr. Rahul Salat* - Senior Architect\n *Mrs. Shuchi Gor* - Interior Design Curator\n \n Together, we form a collaborative team dedicated to transforming architectural dreams into reality. Our collective expertise spans design conceptualization, project execution, and interior curation, ensuring seamless delivery from vision to completion.",
  ourCommitment:
    "From our base in Bhuj-Kutch, we serve clients across India, bringing the same dedication and attention to detail to every project, regardless of scale or location. Whether you're envisioning a contemporary family home or a commercial space that makes a statement, we're here to create environments that not only meet your needs but exceed your expectations. At Jatan Joshi Architects, we don't just design buildings – we craft experiences, preserve dreams, and create lasting legacies in brick, stone, and space.",
};

const parseBold = (text: string) => {
  const parts = text.split(/(\*[^*]+\*)/);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return <strong key={i}>{part.slice(1, -1)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

const AboutPage = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef(null);
  const decorRef = useRef(null);
  // const statsSectionRef = useRef(null);
  // const statsItems = useRef<(HTMLSpanElement | null)[]>([]);

  // New refs for additional sections
  const sectionsRef = useRef<HTMLDivElement>(null);
  // const practiceRef = useRef<HTMLDivElement>(null);
  // const philosophyRef = useRef<HTMLDivElement>(null);
  // const expertiseRef = useRef<HTMLDivElement>(null);
  // const approachRef = useRef<HTMLDivElement>(null);
  // const commitmentRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

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

      // Animate each section with staggered entrance
      const sectionRefs = [
        // practiceRef.current,
        // philosophyRef.current,
        // expertiseRef.current,
        // approachRef.current,
        // commitmentRef.current,
        teamRef.current,
      ];

      sectionRefs.forEach((section) => {
        if (section) {
          const heading = section.querySelector("h3");
          const content = section.querySelector("p");

          // Create a timeline for each section
          const sectionTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });

          // Animate heading first
          sectionTl
            .from(heading, {
              y: 30,
              opacity: 0,
              duration: 0.8,
              ease: "power2.out",
            })
            // Then animate content with a slight delay
            .from(
              content,
              {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
              },
              "-=0.5"
            )
            // Add a subtle scale animation for visual interest
            .from(
              section,
              {
                scale: 0.98,
                duration: 0.8,
                ease: "power2.out",
              },
              "-=0.8"
            );

          // Add a decorative line animation after heading
          const decorativeLine = document.createElement("div");
          decorativeLine.className = "w-16 h-0.5 bg-copper mt-2 mb-4";
          decorativeLine.style.transform = "scaleX(0)";
          decorativeLine.style.transformOrigin = "left center";

          if (heading && heading.parentNode) {
            heading.parentNode.insertBefore(
              decorativeLine,
              heading.nextSibling
            );

            sectionTl.to(
              decorativeLine,
              {
                scaleX: 1,
                duration: 0.6,
                ease: "power2.out",
              },
              "-=0.6"
            );
          }
        }
      });

      // Add a subtle parallax effect to the entire sections container
      if (sectionsRef.current) {
        gsap.to(sectionsRef.current, {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: sectionsRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Professional subtle hover effects only - no floating animations
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className=" bg-white text-carbon z-10 w-11/12 py-16 mx-auto"
    >
      <div ref={titleRef} className="mb-12 contact-title">
        <h1 className="text-5xl font-light uppercase tracking-wider mb-6 text-[#1b1b1b]">
          About us
        </h1>
        <div ref={decorRef} className="w-20 h-1 bg-copper mt-6"></div>
      </div>

      {/* Hero Section */}

      {/* Content Section */}
      <div className="container. mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 md:gap-16">
          {/* Text Content */}
          <div ref={textRef} className="lg:w-1/2 space-y-6">
            <h3 className="text-2xl md:text-3xl font-semibold text-copper">
              Who Is {data.name}?
            </h3>
            <p className="text-base md:text-lg leading-relaxed text-carbon-400 text-justify">
              {data.aboutJatanJoshi}
            </p>

            <div className="relative pl-5 border-l-2 border-copper/40 my-10 text-justify">
              <p className="text-lg md:text-xl italic text-carbon/80 font-light">
                &quot;Great design isn’t about trends. It’s about solving real
                problems with clarity and care.&quot;
              </p>
              <p className="text-right text-sm text-copper mt-3">
                — {data.name}
              </p>
            </div>
          </div>

          {/* Image */}

          <div className="lg:w-1/3 flex flex-col gap-12">
            {/* Image with decorative elements */}
            <div
              ref={imageRef}
              className="relative w-full max-w-[20rem] mx-auto"
            >
              {" "}
              {/* made smaller */}
              {/* Top-left decorative border */}
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-copper opacity-30 pointer-events-none"></div>
              {/* Image with hover effect */}
              <div className="relative overflow-hidden shadow-lg transition-transform duration-500 ease-in-out hover:scale-105">
                <Image
                  src="/assets/aboutus/jatan-joshi.jpg"
                  alt="Jatan Joshi"
                  width={400} // reduced from 600
                  height={533} // maintain aspect ratio
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              {/* Bottom-right decorative border */}
              <div className="absolute -bottom-4 -right-4 w-3/5 h-2/5 border-2 border-copper opacity-30 pointer-events-none"></div>
            </div>
          </div>
        </div>

        <div ref={sectionsRef} className="mt-16 space-y-12">
          {/* <div ref={practiceRef}>
            <h3 className="text-2xl md:text-3xl font-semibold text-copper mb-6">
              Our Practice
            </h3>
            <p className="text-base md:text-lg leading-relaxed text-carbon-400 text-justify">
              {data.ourPractice}
            </p>
          </div>

          <div ref={philosophyRef}>
            <h3 className="text-2xl md:text-3xl font-semibold text-copper mb-6">
              Our Philosophy
            </h3>
            <p className="text-base md:text-lg leading-relaxed text-carbon-400 text-justify">
              {data.ourPhilosophy.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {parseBold(line.trim())}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>

          <div ref={expertiseRef}>
            <h3 className="text-2xl md:text-3xl font-semibold text-copper mb-6">
              Our Expertise
            </h3>
            <p className="text-base md:text-lg leading-relaxed text-carbon-400 text-justify">
              {data.ourExpertise.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {parseBold(line.trim())}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>

          <div ref={approachRef}>
            <h3 className="text-2xl md:text-3xl font-semibold text-copper mb-6">
              Our Approach
            </h3>
            <p className="text-base md:text-lg leading-relaxed text-carbon-400 text-justify">
              {data.ourApproach.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {parseBold(line.trim())}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div> */}

          <div ref={teamRef}>
            <h3 className="text-2xl md:text-3xl font-semibold text-copper mb-6">
              Our Team
            </h3>
            <p className="text-base md:text-lg leading-relaxed text-carbon-400 text-justify">
              {data.outTeam.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {parseBold(line.trim())}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>

          {/* <div ref={commitmentRef}>
            <h3 className="text-2xl md:text-3xl font-semibold text-copper mb-6">
              Our Commitment
            </h3>
            <p className="text-base md:text-lg leading-relaxed text-carbon-400 text-justify">
              {data.ourCommitment.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {parseBold(line.trim())}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
