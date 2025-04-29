"use client";
import { FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";

const WhatsAppButton = () => {
  // WhatsApp Business parameters
  const phoneNumber = "+919601451268";
  const businessName = "JJ Architects";
  const message =
    "Hey! Looking forward to discussing my project with you. Let's chat about transforming my space into something truly special.";

  // For the pulse animation
  const [isPulsing, setIsPulsing] = useState(false);

  // Create subtle pulse effect every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Try different URL structure for WhatsApp Business
  // Note: For proper business name display, you need to be registered with WhatsApp Business API
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-30 group"
      aria-label={`Chat with ${businessName} on WhatsApp`}
    >
      <div className="relative">
        {/* Main button with improved animation */}
        <div
          className={`
          bg-green-500 hover:bg-green-600 text-white 
          p-3 rounded-full shadow-lg 
          transition-all duration-300
          hover:shadow-xl hover:scale-105
          flex items-center justify-center
          ${isPulsing ? "scale-110" : "scale-100"}
        `}
        >
          <FaWhatsapp size={28} className="text-white" />
        </div>

        {/* Improved tooltip */}
        <div
          className="absolute bottom-full right-0 mb-3 
                      opacity-0 group-hover:opacity-100 
                      transition-all duration-300 transform 
                      translate-y-1 group-hover:translate-y-0"
        >
          <div
            className="bg-white text-green-700 text-sm font-medium 
                        py-2 px-4 rounded-lg shadow-md whitespace-nowrap"
          >
            Chat with {businessName}
            <div
              className="h-2 w-2 bg-white transform rotate-45 
                          absolute -bottom-1 right-5"
            ></div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;
