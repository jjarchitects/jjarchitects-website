"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaInstagram,
  FaLinkedinIn,
  FaDribbble,
  FaTwitter,
} from "react-icons/fa";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import businessData from "@/data/businessData.json";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Footer = () => {
  const footerRef = useRef(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const socialRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Footer entrance animation
    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          toggleActions: "play none none none",
        },
      }
    );

    // Links stagger animation
    gsap.fromTo(
      linksRef.current?.children || [],
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: linksRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
      }
    );

    // Social icons float animation
    if (socialRef.current) {
      gsap.to(socialRef.current.children, {
        y: -5,
        duration: 1.5,
        ease: "power1.inOut",
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-gradient-to-b from-taupe-200 to-taupe from-[#DAD6CB]/70. to-[#DAD6CB].// from-zinc-900. to-black. text-zinc-200 pt-10 pb-10 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-carbon-300 to-transparent opacity-30"></div>
      {/* <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500 to-transparent blur-3xl"></div> */}
      {/* <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-tr from-amber-500 to-transparent blur-3xl"></div> */}

      <div className="max-w-7xl mx-auto px-6">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="block">
              <div className="inline-block">
                <h3 className="text-2xl font-light tracking-wider mb-2">
                  <span className="font-medium text-carbon-400">
                    JATAN JOSHI
                  </span>
                </h3>
                <span className="text-xs uppercase tracking-widest text-carbon-400">
                  ARCHITECTS
                </span>
              </div>
            </Link>

            <p className="text-sm text-carbon-300 leading-relaxed max-w-xs">
              Crafting spaces with purpose, vision, and emotion. Creating
              architecture that shapes human experiences and connects with the
              environment.
            </p>

            <div className="pt-4">
              <div ref={socialRef} className="flex items-center gap-5 text-lg">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 transform hover:scale-110"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 transform hover:scale-110"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href="#"
                  aria-label="Dribbble"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 transform hover:scale-110"
                >
                  <FaDribbble />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 transform hover:scale-110"
                >
                  <FaTwitter />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase font-medium tracking-wider text-carbon-400 mb-6">
              Navigation
            </h4>
            <ul ref={linksRef} className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-copper transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-copper transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-copper transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-copper transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase font-medium tracking-wider text-carbon-400 mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${businessData.contactDetails.email}`}
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 flex items-start gap-3 group"
                >
                  <HiOutlineMail className="mt-[6px] text-carbon-300 group-hover:text-copper transition-colors duration-300" />
                  <span>{businessData.contactDetails.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${businessData.contactDetails.phone}`}
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 flex items-start gap-3 group"
                >
                  <HiOutlinePhone className="mt-1 text-carbon-300 group-hover:text-copper transition-colors duration-300" />
                  <span>{businessData.contactDetails.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://google.com/maps/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 flex items-start gap-3 group"
                >
                  <HiOutlineLocationMarker className="mt-1 text-carbon-300 group-hover:text-copper transition-colors duration-300" />
                  <span>
                    {businessData.contactDetails.address.street},{" "}
                    {businessData.contactDetails.address.city},{" "}
                    {businessData.contactDetails.address.state},{" "}
                    {businessData.contactDetails.address.pinCode}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-carbon-200">
          <div className="flex flex-col md:flex-row justify-end items-center text-carbon-300 text-sm">
            <div className="mb-4 md:mb-0">
              © {new Date().getFullYear()} Jatan Joshi Architects. All rights
              reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
