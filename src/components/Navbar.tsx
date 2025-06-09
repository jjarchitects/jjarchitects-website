"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import gsap from "gsap";
import { filters } from "@/app/constants";

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
        scrolled ? "py-1 bg-taupe/60 shadow-lg" : "py-2 bg-taupe"
      }`}
    >
      <div className="w-11/12 max-w-7xl. mx-auto flex justify-between items-center relative">
        {/* Logo */}
        <Link href="/" className="relative z-50 block">
          <div className="relative flex items-center w-50 h-[60px]">
            {/* Large logo */}
            <div
              className={`z-50 absolute top-0 left-0 transition-opacity duration-100 ease-in-out ${
                scrolled ? "opacity-0" : "opacity-100"
              }`}
            >
              <img
                src="/assets/logo/logo.png"
                alt="Logo"
                className="object-contain. h-[55px] md:w-full"
              />
            </div>

            {/* Small logo */}
            <div
              className={`transition-opacity absolute top-0 -left-2 duration-200 ease-in-out ${
                scrolled ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src="/assets/logo/logo-s.png"
                alt="Logo"
                className="object-contain. h-[55px] md:w-full"
              />
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        {/* <ul
          ref={linkRefs}
          className="hidden md:flex gap-16 text-carbon font-light tracking-wide"
        >
          {navItems.map((item) => (
            <li
              key={item.href}
              className="relative group font-medium text-[16px] uppercase"
            >
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
                ></span>

                {item.label === "Projects" && (
                  <div
                    className={`hidden group-hover:flex absolute px-3  flex-col justify-between backdrop-blur-xl ${
                      scrolled
                        ? "py-3. mt-4 bg-taupe/60 shadow-lg"
                        : "py-3 mt-5 bg-taupe"
                    }`}
                  >
                    {filters.map((filter) => (
                      <Link
                        key={filter}
                        href={`/projects?filter=${filter}`}
                        className="block text-carbon/80 hover:text-copper transition-colors duration-300"
                      >
                        {filter}
                      </Link>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul> */}

        <ul
          ref={linkRefs}
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
                      className={` absolute top-full left-0 mt-2 min-w-[200px] z-50 opacity-0 invisible group-hover:opacity-100
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
