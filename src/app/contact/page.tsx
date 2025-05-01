"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useForm } from "react-hook-form";
import { Send, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import businessData from "@/data/businessData.json";

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
    <div ref={containerRef} className="w-full bg-white text-carbon py-16">
      {/* Page Content */}
      <div className="max-w-7xl w-11/12 mx-auto px-4. sm:px-6. lg:px-8.">
        {/* Page Title */}
        <div className="md:mb-16. contact-title">
          <h1 className="text-5xl font-light uppercase tracking-wider mb-6 text-[#1b1b1b]">
            CONTACT US
          </h1>
          <div ref={decorRef} className="w-20 h-1 bg-copper mt-6"></div>
        </div>

        <div className="contact-content grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left - Contact Form */}
          <div className="h-fit">
            {submitted ? (
              <div className="success-message h-full flex gap-6 py-10">
                <div className="p-4 mb-6 flex justify-center items-center">
                  <CheckCircle className="w-12 h-12 text-copper" />
                </div>
                <div>
                  <h3 className="text-2xl font-light uppercase tracking-wider mb-4 text-carbon">
                    Message Sent
                  </h3>
                  <p className="text-carbon-300 mb-8 max-w-md">
                    Thank you for reaching out. We&apos;ll review your message
                    and get back to you shortly.
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
                    className="px-6 py-3 bg-carbon text-white hover:bg-carbon-400 transition-colors inline-flex items-center"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 mt-16"
                noValidate
              >
                <div className="form-element">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    id="name"
                    type="text"
                    className="form-input"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-copper-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="form-element">
                  <label htmlFor="email" className="form-label">
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
                    className="form-input"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-copper-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="form-element">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    {...register("subject", {
                      required: "Subject is required",
                    })}
                    id="subject"
                    type="text"
                    className="form-input"
                    placeholder="Project inquiry / Collaboration"
                  />
                  {errors.subject && (
                    <p className="mt-2 text-sm text-copper-600">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="form-element">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    {...register("message", {
                      required: "Message is required",
                    })}
                    id="message"
                    rows={4}
                    placeholder="Tell us about your project..."
                    className="form-input resize-none bg-transparent"
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-copper-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="form-element pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-8 py-3 bg-carbon text-white hover:bg-carbon-400 transition-colors disabled:opacity-50"
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
                <h3 className="text-xl uppercase tracking-wide mb-6 font-light text-carbon">
                  Contact Information
                </h3>
                <p className="text-carbon-300 mb-10 max-w-md">
                  For project inquiries, collaborations or general information,
                  please reach out using the contact details below.
                </p>
              </div>

              <div className="flex items-start space-x-6 contact-info-item">
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
              </div>

              <div className="flex items-start space-x-6 contact-info-item">
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
              </div>

              <div className="flex items-start space-x-6 contact-info-item">
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
                    {/* Pier 15, Embarcadero, San Francisco, <br />
                    California, 94105 */}
                    <address className="not-italic">
                      {businessData.contactDetails.address.street}
                      <br />
                      {businessData.contactDetails.address.city},{" "}
                      {businessData.contactDetails.address.state}{" "}
                      {businessData.contactDetails.address.pinCode}
                    </address>
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="contact-info-item h-64 w-full border border-gray-200">
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
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-sm uppercase tracking-wide text-gray-600 mb-4">
                Follow Us
              </h4>
              <div className="flex gap-4 md:gap-6">
                <div className="w-8 h-8 border border-carbon flex items-center justify-center">
                  <span className="text-sm">IG</span>
                </div>
                <div className="w-8 h-8 border border-carbon flex items-center justify-center">
                  <span className="text-sm">LI</span>
                </div>
                <div className="w-8 h-8 border border-carbon flex items-center justify-center">
                  <span className="text-sm">YT</span>
                </div>
                <div className="w-8 h-8 border border-carbon flex items-center justify-center">
                  <span className="text-sm">FB</span>
                </div>
              </div>
            </div>

            {/* <div className="contact-info-item">
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
