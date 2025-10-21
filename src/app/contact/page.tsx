"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Send, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import businessData from "@/data/businessData.json";
import SocialMedia from "@/components/SocialMedia";
import emailjs from "@emailjs/browser";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const service_id = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
  const template_id = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async () => {
    if (formRef.current) {
      emailjs
        .sendForm(service_id, template_id, formRef.current, publicKey)
        .then(() => {
          setSubmitted(true);
          reset();
        })
        .catch(() => {
          alert("Failed to send message!");
        });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { y: -40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
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

  const contentVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        delay: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const formElementVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const contactInfoVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full bg-white text-carbon py-16"
    >
      <div className="w-11/12 mx-auto px-4">
        {/* Page Title */}
        <div className="md:mb-16">
          <motion.h1
            variants={titleVariants}
            className="text-5xl font-light uppercase tracking-wider mb-6 text-[#1b1b1b]"
          >
            CONTACT US
          </motion.h1>
          <motion.div
            variants={decorVariants}
            className="w-20 h-1 bg-copper mt-6 origin-left"
          />
        </div>

        <motion.div
          variants={contentVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-16"
        >
          {/* Left - Contact Form */}
          <div className="h-fit">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="h-full flex gap-6 py-10"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="p-4 mb-6 flex justify-center items-center"
                  >
                    <CheckCircle className="w-12 h-12 text-copper" />
                  </motion.div>
                  <div>
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="text-2xl font-light uppercase tracking-wider mb-4 text-carbon"
                    >
                      Message Sent
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-carbon-300 mb-8 max-w-md"
                    >
                      Thank you for reaching out. We&apos;ll review your message
                      and get back to you shortly.
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 bg-copper hover:bg-copper-600 text-white transition-colors inline-flex items-center"
                    >
                      Send Another Message
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleSubmit(onSubmit)}
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="space-y-6 mt-16"
                  noValidate
                >
                  <motion.div variants={formElementVariants}>
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      {...register("name", { required: "Name is required" })}
                      id="name"
                      type="text"
                      className="form-input"
                      placeholder="Your name"
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 text-sm text-copper-600"
                        >
                          {errors.name.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={formElementVariants}>
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                      id="email"
                      type="email"
                      className="form-input"
                      placeholder="your@email.com"
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 text-sm text-copper-600"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={formElementVariants}>
                    <label htmlFor="subject" className="form-label">
                      Subject
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      {...register("subject", {
                        required: "Subject is required",
                      })}
                      id="subject"
                      type="text"
                      className="form-input"
                      placeholder="Project inquiry / Collaboration"
                    />
                    <AnimatePresence>
                      {errors.subject && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 text-sm text-copper-600"
                        >
                          {errors.subject.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={formElementVariants}>
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      {...register("message", {
                        required: "Message is required",
                      })}
                      id="message"
                      rows={4}
                      placeholder="Tell us about your project..."
                      className="form-input resize-none bg-transparent"
                    />
                    <AnimatePresence>
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 text-sm text-copper-600"
                        >
                          {errors.message.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div variants={formElementVariants} className="pt-4">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center px-8 py-3 bg-copper hover:bg-copper-600 text-white transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.svg
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="-ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </motion.svg>
                          SENDING
                        </>
                      ) : (
                        <>
                          SEND MESSAGE
                          <Send className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right - Contact Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-12"
          >
            <div className="space-y-8">
              <motion.div variants={contactInfoVariants}>
                <h3 className="text-xl uppercase tracking-wide mb-6 font-light text-carbon">
                  Contact Information
                </h3>
                <p className="text-carbon-300 mb-10 max-w-md">
                  For project inquiries, collaborations or general information,
                  please reach out using the contact details below.
                </p>
              </motion.div>

              <motion.div
                variants={contactInfoVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
                className="flex items-start space-x-6"
              >
                <Mail className="w-5 h-5 mt-1 text-copper" />
                <div>
                  <h4 className="text-sm uppercase tracking-wide text-carbon-300 mb-1">
                    Email
                  </h4>
                  <a
                    href={`mailto:${businessData.contactDetails.email}`}
                    className="text-carbon hover:text-copper transition-colors"
                  >
                    {businessData.contactDetails.email}
                  </a>
                </div>
              </motion.div>

              <motion.div
                variants={contactInfoVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
                className="flex items-start space-x-6"
              >
                <Phone className="w-5 h-5 mt-1 text-copper" />
                <div>
                  <h4 className="text-sm uppercase tracking-wide text-carbon-300 mb-1">
                    Phone
                  </h4>
                  <a
                    href={`tel:${businessData.contactDetails.phone}`}
                    className="text-carbon hover:text-copper transition-colors"
                  >
                    {businessData.contactDetails.phone}
                  </a>
                </div>
              </motion.div>

              <motion.div
                variants={contactInfoVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
                className="flex items-start space-x-6"
              >
                <MapPin className="w-5 h-5 mt-1 text-copper" />
                <div>
                  <h4 className="text-sm uppercase tracking-wide text-carbon-300 mb-1">
                    Studio Address
                  </h4>
                  <a
                    href={`${businessData.contactDetails.address_link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-carbon hover:text-copper"
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
              </motion.div>
            </div>

            {/* Map */}
            <motion.div
              variants={contactInfoVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="h-64 w-full border border-gray-200 overflow-hidden"
            >
              <iframe
                src={businessData.contactDetails.map_embedded_link}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              ></iframe>
            </motion.div>

            {/* Social Media */}
            <motion.div variants={contactInfoVariants}>
              <SocialMedia className="uppercase" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
