"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import gsap from "gsap";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linkRefs = useRef(null);
  const pathname = usePathname();

  // Handle scroll effect
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate on mount
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, {
        ease: "power3.out",
        y: -100,
        delay: 0.1,
        duration: 1,
        opacity: 0,
      });

      gsap.from(linkRefs.current, {
        ease: "power3.out",
        y: -100,
        delay: 0.2,
        duration: 1,
        opacity: 0,
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Mobile menu toggle animation
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;

    if (isOpen) {
      gsap.fromTo(
        menu,
        { y: -30, opacity: 0, display: "none" },
        {
          y: 0,
          opacity: 1,
          display: "flex",
          duration: 0.5,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        menu.children,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.05, delay: 0.1 }
      );
    } else {
      gsap.to(menu, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(menu, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  return (
    <nav
      ref={navRef}
      // className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      //   scrolled
      //     ? "py-2 bg-gray-200/80 backdrop-blur-md shadow-lg"
      //     : "py-4 bg-gray-50 backdrop-blur-sm"
      // }`}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 backdrop-blur-sm ${
        scrolled ? "py-2 bg-taupe/60 shadow-lg" : "py-3 bg-taupe"
      }`}
    >
      <div className="w-11/12 max-w-7xl mx-auto flex justify-between items-center relative">
        {/* Logo */}
        <Link href="/" className="relative z-50 block">
          <div className="relative flex items-center w-50 h-[60px]">
            {/* Large logo */}
            <div
              className={`absolute top-0 left-0 transition-opacity duration-300 ease-in-out ${
                scrolled ? "opacity-0" : "opacity-100"
              }`}
            >
              <Image
                src="/assets/logo/logo.png"
                alt="Logo"
                width={170}
                height={80}
                className="object-contain"
                priority
              />
            </div>

            {/* Small logo */}
            <div
              className={` transition-opacity duration-300 ease-in-out ${
                scrolled ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src="/assets/logo/logo-s.png"
                alt="Logo"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul
          ref={linkRefs}
          className="hidden md:flex gap-10 text-carbon font-light tracking-wide"
        >
          {navItems.map((item) => (
            <li key={item.href} className="relative group text-lg uppercase">
              <Link
                href={item.href}
                className={`transition-all duration-300 ease-in-out inline-block py-1 cursor-none ${
                  (item.href === "/" && pathname === "/") ||
                  (item.href !== "/" && pathname.startsWith(item.href))
                    ? "text-copper font-medium tracking-wider scale-105"
                    : "text-carbon group-hover:text-copper"
                }`}
              >
                {item.label}
                <span
                  className={`block h-[2px] transition-all duration-300 ease-out mt-2 ${
                    (item.href === "/" && pathname === "/") ||
                    (item.href !== "/" && pathname.startsWith(item.href))
                      ? "w-full bg-copper"
                      : "w-0 group-hover:w-full bg-copper"
                  }`}
                ></span>
              </Link>
            </li>
          ))}
        </ul>

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
        <div
          ref={mobileMenuRef}
          className="fixed top-0 left-0 w-full h-[100dvh] bg-carbon flex-col items-center justify-center gap-12 text-lg md:hidden hidden"
        >
          <ul className="flex flex-col items-center gap-10 -mt-10">
            {navItems.map((item) => (
              <li key={item.href} className="w-full text-center text-2xl">
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
