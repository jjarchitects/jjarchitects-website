"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import gsap from "gsap";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact Us", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLUListElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linkRefs = useRef<HTMLUListElement>(null);
  const pathname = usePathname();

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
        duration: 0,
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
      className="bg-stone-200/70 backdrop-blur-lg fixed top-0 left-0 w-full z-50"
    >
      <div className="w-11/12 mx-auto p-2 flex justify-between items-center relative">
        {/* Logo */}
        <Link href="/" ref={logoRef}>
          <div className="relative w-12 h-12 rounded-full">
            <Image
              src="/assets/logo/logo.png"
              className="p-1"
              alt="Logo"
              fill
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul ref={linkRefs} className="hidden md:flex gap-10 text-lg uppercase">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`transition-all duration-300 ease-in-out transform ${
                  item.href === "/"
                    ? pathname === "/" // exact match for home
                      ? "text-primary scale-105 tracking-wider font-semibold"
                      : "text-dark scale-100"
                    : pathname.startsWith(item.href)
                    ? "text-primary scale-105 tracking-wider font-semibold"
                    : "text-dark scale-100"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Icon */}
        <div
          className="md:hidden cursor-pointer. z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* {!isOpen && <LuMenu size={28} />} */}

          {isOpen ? <LuX size={28} /> : <LuMenu size={28} />}
        </div>

        {/* Mobile Menu */}
        <ul
          ref={mobileMenuRef}
          className="absolute top-16 left-0 w-full h-[100dvh] bg-white/90 rounded-b-3xl flex-col items-center justify-start pt-20 pb-10 px-6 gap-12 text-lg z-40 uppercase md:hidden hidden"
        >
          {/* Close Button */}
          {/* <div className="absolute top-5 right-6">
            <LuX
              onClick={() => setIsOpen(!isOpen)}
              size={28}
              className="text-dark hover:text-primary transition-colors cursor-pointer."
            />
          </div> */}

          {/* Navigation Links */}
          {navItems.map((item) => (
            <li key={item.href} className="w-full text-center">
              <Link
                href={item.href}
                className={`transition-all duration-300 ease-in-out transform ${
                  item.href === "/"
                    ? pathname === "/" // exact match for home
                      ? "text-primary scale-105 tracking-wider font-semibold"
                      : "text-dark scale-100"
                    : pathname.startsWith(item.href)
                    ? "text-primary scale-105 tracking-wider font-semibold"
                    : "text-dark scale-100"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
