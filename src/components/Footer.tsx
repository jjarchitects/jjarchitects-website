"use client";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import businessData from "@/data/businessData.json";
import { motion, easeInOut } from "framer-motion";

const Footer = () => {
  // Footer entrance animation variant
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: easeInOut,
      },
    },
  };

  // Links stagger animation variants
  const linksContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const linkItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: easeInOut,
      },
    },
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="relative bg-gradient-to-b from-taupe-200 to-taupe text-zinc-200 pt-10 pb-10 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-carbon-300 to-transparent opacity-30"></div>

      <div className="w-11/12 max-w-7xl mx-auto px-6">
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
              <div className="flex items-center gap-5 text-lg">
                <motion.a
                  href={businessData.socialMedia.instagram}
                  target="_blank"
                  aria-label="Instagram"
                  rel="noopener noreferrer"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 transform hover:scale-110"
                >
                  <FaInstagram />
                </motion.a>
                {/* <motion.a
                  animate="animate"
                  transition={{ delay: 0.2 }}
                  href={businessData.socialMedia.twitter}
                  target="_blank"
                  aria-label="Twitter"
                  rel="noopener noreferrer"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 transform hover:scale-110"
                >
                  <FaXTwitter />
                </motion.a> */}
                <motion.a
                  href={businessData.socialMedia.linkedin}
                  target="_blank"
                  aria-label="LinkedIn"
                  rel="noopener noreferrer"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 transform hover:scale-110"
                >
                  <FaLinkedinIn />
                </motion.a>
                <motion.a
                  href={businessData.socialMedia.facebook}
                  target="_blank"
                  aria-label="Facebook"
                  rel="noopener noreferrer"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 transform hover:scale-110"
                >
                  <FaFacebook />
                </motion.a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase font-medium tracking-wider text-carbon-400 mb-6">
              Navigation
            </h4>
            <motion.ul
              variants={linksContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-4"
            >
              <motion.li variants={linkItemVariants}>
                <Link
                  href="/"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-copper transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Home
                </Link>
              </motion.li>
              <motion.li variants={linkItemVariants}>
                <Link
                  href="/projects"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-copper transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Projects
                </Link>
              </motion.li>
              <motion.li variants={linkItemVariants}>
                <Link
                  href="/about"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-copper transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  About Us
                </Link>
              </motion.li>
              <motion.li variants={linkItemVariants}>
                <Link
                  href="/contact"
                  className="text-carbon-300 hover:text-copper transition-colors duration-300 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-copper transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  Contact
                </Link>
              </motion.li>
            </motion.ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase font-medium tracking-wider text-carbon-400 mb-6">
              Contact
            </h4>
            <div className="grid gap-4">
              <a
                href={`mailto:${businessData.contactDetails.email}`}
                className="text-carbon-300 hover:text-copper transition-colors duration-300 flex items-start gap-3 group"
              >
                <HiOutlineMail
                  size={16}
                  className="mt-[6px] text-carbon-300 group-hover:text-copper transition-colors duration-300"
                />
                <span>{businessData.contactDetails.email}</span>
              </a>

              <a
                href={`tel:${businessData.contactDetails.phone}`}
                className="text-carbon-300 hover:text-copper transition-colors duration-300 flex items-start gap-3 group"
              >
                <HiOutlinePhone
                  size={16}
                  className="mt-1 text-carbon-300 group-hover:text-copper transition-colors duration-300"
                />
                <span>{businessData.contactDetails.phone}</span>
              </a>

              <a
                href={businessData.contactDetails.address_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-carbon-300 hover:text-copper transition-colors duration-300 flex items-start gap-3 group"
              >
                <HiOutlineLocationMarker
                  size={26}
                  className="mt-1 text-carbon-300 group-hover:text-copper transition-colors duration-300"
                />
                <span className="not-italic leading-relaxed">
                  {businessData.contactDetails.address.street},{" "}
                  {businessData.contactDetails.address.landmark},{" "}
                  {businessData.contactDetails.address.city},{" "}
                  {businessData.contactDetails.address.state}{" "}
                  {businessData.contactDetails.address.pinCode}
                </span>
              </a>
            </div>
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
    </motion.footer>
  );
};

export default Footer;
