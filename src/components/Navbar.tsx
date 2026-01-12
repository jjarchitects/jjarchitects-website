"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { filters } from "@/app/constants";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants for navbar items
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: easeInOut,
      },
    },
  };

  const linksVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        delay: 0.2,
        ease: easeInOut,
      },
    },
  };

  // Mobile menu animation variants
  const mobileMenuVariants = {
    hidden: {
      y: -30,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easeInOut,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 backdrop-blur-sm ${
        scrolled ? "py-1 bg-taupe/60 shadow-lg" : "py-2 bg-taupe"
      }`}
    >
      <div className="w-11/12 max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Logo */}
        <Link href="/" className="relative z-50 block">
          <motion.div
            variants={navVariants}
            className="relative flex items-center w-50 h-[60px]"
          >
            {/* Large logo */}
            <div
              className={`z-50 absolute top-0 left-0 transition-opacity duration-100 ease-in-out h-full flex items-center ${
                scrolled ? "opacity-0" : "opacity-100"
              }`}
            >
              <img
                src="/assets/logo/logo.png"
                alt="Logo"
                className="object-contain h-[45px] md:w-full"
              />
            </div>

            {/* Small logo */}
            <div
              className={`transition-opacity absolute top-0 -left-2 duration-200 ease-in-out h-full flex items-center ${
                scrolled ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src="/assets/logo/logo-s.png"
                alt="Logo"
                className="object-contain h-[45px] md:w-full"
              />
            </div>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <motion.ul
          variants={linksVariants}
          className="hidden md:flex gap-16 text-carbon font-light tracking-wide"
        >
          {navItems.map((item) => (
            <li
              key={item.href}
              className="relative group font-medium text-[16px] uppercase"
            >
              {item.label === "Projects" ? (
                <div
                  className={`transition-all duration-300 ease-in-out inline-block py-1 cursor-none relative ${
                    (item.href === "/" && pathname === "/") ||
                    (item.href !== "/" && pathname.startsWith(item.href))
                      ? "text-copper font-bold tracking-wider scale-105"
                      : "text-carbon group-hover:text-copper"
                  }`}
                >
                  <div>{item.label}</div>
                  {item.label === "Projects" && (
                    <div
                      className={`absolute top-full left-0 mt-2 min-w-[200px] z-50 opacity-0 invisible group-hover:opacity-100
                      group-hover:visible transform translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300 
                      ease-out backdrop-blur-xl border border-copper/20 shadow-xl ${
                        scrolled ? "bg-taupe/80" : "bg-taupe/90"
                      }
                    `}
                    >
                      <div className="py-3">
                        {filters.map((filter, index) => (
                          <Link
                            key={filter}
                            href={`/projects?filter=${encodeURIComponent(
                              filter
                            )}`}
                            className={`block w-full px-4 py-2.5 text-sm font-normal normal-case text-carbon/80 hover:text-copper 
                            hover:bg-copper/10 transition-all duration-200 ease-in-out border-l-2 border-transparent 
                            hover:border-copper/30 text-left ${
                              index !== filters.length - 1
                                ? "border-b border-carbon/10"
                                : ""
                            }
                          `}
                          >
                            {filter}
                          </Link>
                        ))}
                      </div>
                      <div className="absolute -top-1 left-6 w-2 h-2 bg-taupe border-l border-t border-copper/20 transform rotate-45" />
                    </div>
                  )}
                  <span
                    className={`block h-[2px] transition-all duration-300 ease-out mt-2 ${
                      (item.href === "/" && pathname === "/") ||
                      (item.href !== "/" && pathname.startsWith(item.href))
                        ? "w-full bg-copper"
                        : "w-0 group-hover:w-full bg-copper"
                    }`}
                  />
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`transition-all duration-300 ease-in-out inline-block py-1 cursor-none relative ${
                    (item.href === "/" && pathname === "/") ||
                    (item.href !== "/" && pathname.startsWith(item.href))
                      ? "text-copper font-bold tracking-wider scale-105"
                      : "text-carbon group-hover:text-copper"
                  }`}
                >
                  <div className="flex items-center gap-2">{item.label}</div>
                  <span
                    className={`block h-[2px] transition-all duration-300 ease-out mt-2 ${
                      (item.href === "/" && pathname === "/") ||
                      (item.href !== "/" && pathname.startsWith(item.href))
                        ? "w-full bg-copper"
                        : "w-0 group-hover:w-full bg-copper"
                    }`}
                  />
                </Link>
              )}
            </li>
          ))}
        </motion.ul>

        {/* Mobile Icon */}
        <div
          className="md:hidden cursor-pointer z-50 text-carbon p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <LuX size={29} className="text-white transition-all duration-300" />
          ) : (
            <LuMenu
              size={29}
              className="text-carbon transition-all duration-300"
            />
          )}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 left-0 w-full h-[100dvh] bg-carbon flex flex-col items-center justify-center gap-12 text-lg md:hidden"
            >
              <ul className="flex flex-col items-center gap-10 -mt-10">
                {navItems.map((item) => (
                  <motion.li
                    key={item.href}
                    variants={mobileItemVariants}
                    className="w-full text-center text-2xl"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`transition-all duration-300 ease-in-out transform inline-block py-2 px-8 ${
                        (item.href === "/" && pathname === "/") ||
                        (item.href !== "/" && pathname.startsWith(item.href))
                          ? "text-copper scale-105 tracking-wider font-medium"
                          : "text-white hover:text-copper/90 hover:tracking-wider"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
