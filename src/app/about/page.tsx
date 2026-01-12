"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const data = {
  name: "Jatan Joshi",
  aboutJatanJoshi:
    "Jatan Joshi is a passionate architect whose journey began with a childhood love for drawing and art. Growing up in a family connected to the construction industry, he was naturally drawn to the world of building and design. After completing his Architecture degree from SVIT Vasad, Jatan honed his expertise working with dynamic teams across Gujarat&apos;s metro cities, including Ahmedabad and Vadodara. With over 7 years of experience in diverse architectural projects, he founded his practice in 2018 in Bhuj-Kutch, bringing metropolitan design sensibilities to his hometown while serving clients across India.",
  ourPractice:
    "Jatan Joshi Architects, established in 2018 and based in the historic city of Bhuj-Kutch, Gujarat, is a comprehensive architectural practice specializing in Architectural Planning, Liaison Services, Construction, Interior Design, and Turnkey Projects. While rooted in the cultural heritage of Kutch, our practice extends its services pan-India, combining local wisdom with contemporary design excellence.",
  ourPhilosophy:
    "Every home represents a family&apos;s dreams, and we consider ourselves privileged to be part of that journey. Our design philosophy centers on creating spaces that seamlessly blend visual appeal with practical functionality. We believe architecture should respond to its context – whether honoring traditional Gujarati elements or embracing modern aesthetics that our clients desire.\n \n Each project begins with understanding the site&apos;s unique climate, cultural context, and the client&apos;s vision. We foster a strong connection with nature in our designs, ensuring that every space we create brings comfort, liveliness, and well-being to its inhabitants. Our work reflects deep cultural values while thoughtfully shaping how people interact with their surroundings.",
  ourExpertise:
    "While we embrace versatility across project types, residential architecture holds a special place in our practice. From intimate bungalows to luxurious penthouses, we&apos;ve crafted diverse living spaces that reflect our clients&apos; lifestyles and aspirations. Our portfolio spans various scales and typologies: *Residential Projects*: Bungalows, apartments, penthouses, and custom homes *Commercial Ventures*: Clinics, shopping complexes, offices, resorts, and restaurants Cultural & Event Spaces: Including our notable work on the entrance design for Vibrant Gujarat, the state&apos;s premier annual event held in Gandhinagar",
  ourApproach:
    "Drawing from extensive experience in Gujarat&apos;s metropolitan markets, we bring a unique perspective to every project. Our approach balances contemporary design trends with timeless architectural principles, ensuring each creation remains relevant and cherished for years to come. We understand that while modern aesthetics are often preferred, the soul of good architecture lies in its ability to enhance daily life.",
  outTeam:
    "*Mr. Jatan Joshi* - Principal Architect & Founder \n *Mr. Rahul Salat* - Senior Architect\n *Mrs. Shuchi Gor* - Interior Design Curator\n \n Together, we form a collaborative team dedicated to transforming architectural dreams into reality. Our collective expertise spans design conceptualization, project execution, and interior curation, ensuring seamless delivery from vision to completion.",
  ourCommitment:
    "From our base in Bhuj-Kutch, we serve clients across India, bringing the same dedication and attention to detail to every project, regardless of scale or location. Whether you&apos;re envisioning a contemporary family home or a commercial space that makes a statement, we&apos;re here to create environments that not only meet your needs but exceed your expectations. At Jatan Joshi Architects, we don&apos;t just design buildings – we craft experiences, preserve dreams, and create lasting legacies in brick, stone, and space.",
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
  const sectionsRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect for sections
  const { scrollYProgress } = useScroll({
    target: sectionsRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Animation variants
  const titleVariants = {
    hidden: { y: -40, opacity: 0 },
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

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const textItemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const imageVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const sectionVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.98 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const decorLineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="bg-white text-carbon z-10 w-11/12 py-16 mx-auto">
      {/* Page Title */}
      <div className="mb-12">
        <motion.h1
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl font-light uppercase tracking-wider mb-6 text-[#1b1b1b]"
        >
          About us
        </motion.h1>
        <motion.div
          variants={decorVariants}
          initial="hidden"
          animate="visible"
          className="w-20 h-1 bg-copper mt-6 origin-left"
        />
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 md:gap-16">
          {/* Text Content */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="lg:w-1/2 space-y-6"
          >
            <motion.h3
              variants={textItemVariants}
              className="text-2xl md:text-3xl font-semibold text-copper"
            >
              Who Is {data.name}?
            </motion.h3>
            <motion.p
              variants={textItemVariants}
              className="text-base md:text-lg leading-relaxed text-carbon-400 text-justify"
            >
              {data.aboutJatanJoshi}
            </motion.p>

            <motion.div
              variants={textItemVariants}
              className="relative pl-5 border-l-2 border-copper/40 my-10 text-justify"
            >
              <p className="text-lg md:text-xl italic text-carbon/80 font-light">
                &quot;Great design isn&apos;t about trends. It&apos;s about
                solving real problems with clarity and care.&quot;
              </p>
              <p className="text-right text-sm text-copper mt-3">
                — {data.name}
              </p>
            </motion.div>
          </motion.div>

          {/* Image */}
          <div className="lg:w-1/3 flex flex-col gap-12">
            <motion.div
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative w-full max-w-[20rem] mx-auto"
            >
              {/* Top-left decorative border */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 0.3, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute -top-4 -left-4 w-full h-full border-2 border-copper pointer-events-none"
              />

              {/* Image with hover effect */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden shadow-lg"
              >
                <Image
                  src="/assets/aboutus/jatan-joshi.jpg"
                  alt="Jatan Joshi"
                  width={400}
                  height={533}
                  className="w-full h-auto object-cover"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                />
              </motion.div>

              {/* Bottom-right decorative border */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 0.3, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -bottom-4 -right-4 w-3/5 h-2/5 border-2 border-copper pointer-events-none"
              />
            </motion.div>
          </div>
        </div>

        {/* Additional Sections with Parallax */}
        <motion.div
          ref={sectionsRef}
          style={{ y: parallaxY }}
          className="mt-16 space-y-12"
        >
          {/* Team Section */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h3 className="text-2xl md:text-3xl font-semibold text-copper mb-2">
              Our Team
            </motion.h3>
            <motion.div
              variants={decorLineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-16 h-0.5 bg-copper mb-4 origin-left"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base md:text-lg leading-relaxed text-carbon-400 text-justify"
            >
              {data.outTeam.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {parseBold(line.trim())}
                  <br />
                </React.Fragment>
              ))}
            </motion.p>
          </motion.div>
          {/* Example for Our Practice section (currently commented out in original) */}
          {/* 
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h3 className="text-2xl md:text-3xl font-semibold text-copper mb-2">
              Our Practice
            </motion.h3>
            <motion.div
              variants={decorLineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-16 h-0.5 bg-copper mb-4 origin-left"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base md:text-lg leading-relaxed text-carbon-400 text-justify"
            >
              {data.ourPractice}
            </motion.p>
          </motion.div>
          */}
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
