"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useForm } from "react-hook-form";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form submitted:", data);

    // Show success animation
    const formElements = formRef.current?.elements;
    if (formElements) {
      gsap.to(formElements, {
        y: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    setTimeout(() => {
      setSubmitted(true);
      reset();
    }, 600);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animations
      gsap.from(".contact-title", {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".contact-content", {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });

      gsap.from(".form-element", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.6,
        ease: "power2.out",
      });

      gsap.from(".contact-info-item", {
        x: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.6,
        ease: "power2.out",
      });
      gsap.from(decorRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.8,
        delay: 0.3,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const decorRef = useRef(null);

  return (
    <div ref={containerRef} className="w-full bg-white text-gray-900 py-16">
      {/* Page Content */}
      <div className="max-w-7xl w-11/12 mx-auto px-4. sm:px-6. lg:px-8.">
        {/* Page Title */}
        <div className="mb-16 contact-title">
          <h1 className="text-5xl font-light uppercase tracking-wider mb-6 text-[#1b1b1b]">
            CONTACT US
          </h1>
          <div ref={decorRef} className="w-20 h-1 bg-[#a53838] mt-6"></div>
        </div>

        <div className="contact-content grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left - Contact Form */}
          <div>
            {submitted ? (
              <div className="success-message h-full flex flex-col justify-center py-10">
                <div className="p-4 mb-6">
                  <CheckCircle className="w-12 h-12 text-[#a53838]" />
                </div>
                <h3 className="text-2xl font-light uppercase tracking-wider mb-4 text-[#1b1b1b]">
                  Message Sent
                </h3>
                <p className="text-gray-600 mb-8 max-w-md">
                  Thank you for reaching out. We&apos;ll review your message and
                  get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    gsap.to(".success-message", {
                      y: 20,
                      opacity: 0,
                      duration: 0.5,
                      ease: "power2.in",
                      onComplete: () => setSubmitted(false),
                    });
                  }}
                  className="px-6 py-3 bg-[#1b1b1b] text-white hover:bg-gray-800 transition-colors inline-flex items-center"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <div className="form-element">
                  <label
                    htmlFor="name"
                    className="block text-sm text-gray-600 mb-2 uppercase tracking-wide"
                  >
                    Full Name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    id="name"
                    type="text"
                    className="w-full px-4 py-3 bg-transparent border-b border-gray-300 focus:border-[#a53838] focus:outline-none transition-all text-[#1b1b1b]"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-[#a53838]">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="form-element">
                  <label
                    htmlFor="email"
                    className="block text-sm text-gray-600 mb-2 uppercase tracking-wide"
                  >
                    Email Address
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Please enter a valid email address",
                      },
                    })}
                    id="email"
                    type="email"
                    className="w-full px-4 py-3 bg-transparent border-b border-gray-300 focus:border-[#a53838] focus:outline-none transition-all text-[#1b1b1b]"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-[#a53838]">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="form-element">
                  <label
                    htmlFor="subject"
                    className="block text-sm text-gray-600 mb-2 uppercase tracking-wide"
                  >
                    Subject
                  </label>
                  <input
                    {...register("subject", {
                      required: "Subject is required",
                    })}
                    id="subject"
                    type="text"
                    className="w-full px-4 py-3 bg-transparent border-b border-gray-300 focus:border-[#a53838] focus:outline-none transition-all text-[#1b1b1b]"
                    placeholder="Project inquiry / Collaboration"
                  />
                  {errors.subject && (
                    <p className="mt-2 text-sm text-[#a53838]">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="form-element">
                  <label
                    htmlFor="message"
                    className="block text-sm text-gray-600 mb-2 uppercase tracking-wide"
                  >
                    Message
                  </label>
                  <textarea
                    {...register("message", {
                      required: "Message is required",
                    })}
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 bg-transparent border-b border-gray-300 focus:border-[#a53838] focus:outline-none transition-all text-[#1b1b1b] resize-none"
                    placeholder="Tell us about your project..."
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-[#a53838]">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="form-element pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-8 py-3 bg-[#1b1b1b] text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        </svg>
                        SENDING
                      </>
                    ) : (
                      <>
                        SEND MESSAGE
                        <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right - Contact Info */}
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="contact-info-item">
                <h3 className="text-lg uppercase tracking-wide mb-6 font-light text-[#1b1b1b]">
                  Contact Information
                </h3>
                <p className="text-gray-600 mb-10 max-w-md">
                  For project inquiries, collaborations or general information,
                  please reach out using the contact details below.
                </p>
              </div>

              <div className="flex items-start space-x-6 contact-info-item">
                <Mail className="w-5 h-5 mt-1 text-[#a53838]" />
                <div>
                  <h4 className="text-sm uppercase tracking-wide text-gray-600 mb-1">
                    Email
                  </h4>
                  <a
                    href="mailto:contact@jatanjoshi.co.in"
                    className="text-[#1b1b1b] hover:text-[#a53838] transition-colors"
                  >
                    contact@jatanjoshi.co.in
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-6 contact-info-item">
                <Phone className="w-5 h-5 mt-1 text-[#a53838]" />
                <div>
                  <h4 className="text-sm uppercase tracking-wide text-gray-600 mb-1">
                    Phone
                  </h4>
                  <a
                    href="tel:+911234567890"
                    className="text-[#1b1b1b] hover:text-[#a53838] transition-colors"
                  >
                    +91 12345 67890
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-6 contact-info-item">
                <MapPin className="w-5 h-5 mt-1 text-[#a53838]" />
                <div>
                  <h4 className="text-sm uppercase tracking-wide text-gray-600 mb-1">
                    Studio Address
                  </h4>
                  <p className="text-[#1b1b1b]">
                    Pier 15, Embarcadero, San Francisco, <br />
                    California, 94105
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="contact-info-item h-64 w-full border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1081455515937!2d-122.39871622358464!3d37.800552710280966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808580f4199eaf65%3A0x6a79f623fd18f48f!2sExploratorium!5e0!3m2!1sen!2sus!4v1682450282609!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              ></iframe>
            </div>

            {/* Social Media */}
            <div className="contact-info-item">
              <h4 className="text-sm uppercase tracking-wide text-gray-600 mb-4">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-2 border border-gray-300 text-[#1b1b1b] hover:border-[#a53838] hover:text-[#a53838] hover:bg-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 border border-gray-300 text-[#1b1b1b] hover:border-[#a53838] hover:text-[#a53838] hover:bg-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 border border-gray-300 text-[#1b1b1b] hover:border-[#a53838] hover:text-[#a53838] hover:bg-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
