import businessData from "../data/businessData.json";

interface SocialMediaProps {
  className?: string;
}

function SocialMedia({ className }: SocialMediaProps) {
  return (
    <div className={`col-a-2 pt-4 md:pt-6 ${className}`}>
      <p className="text-base md:text-lg font-light mb-2 md:mb-4">Follow Us</p>
      <div className="flex gap-4 md:gap-6">
        <a
          href={businessData.socialMedia.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-8 h-8 border border-carbon flex items-center justify-center !z-20 group"
        >
          <p className="absolute right-2 top-1 group-hover:right-1 group-hover:top-2 text-sm transition-all duration-300 ease-in-out z-50">
            IG
          </p>
          <div className="absolute opacity-0 group-hover:opacity-100 w-8 h-8 border border-copper top-1 left-1 !z-10 shadow-gray-600 transition-all duration-300 ease-in-out" />
        </a>

        <a
          href={businessData.socialMedia.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-8 h-8 border border-carbon flex items-center justify-center !z-20 group"
        >
          <p className="absolute right-[10px] top-1 group-hover:right-1 group-hover:top-2 text-sm transition-all duration-300 ease-in-out z-50">
            X
          </p>
          <div className="absolute opacity-0 group-hover:opacity-100 w-8 h-8 border border-copper top-1 left-1 !z-10 shadow-gray-600 transition-all duration-300 ease-in-out" />
        </a>

        <a
          href={businessData.socialMedia.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-8 h-8 border border-carbon flex items-center justify-center !z-20 group"
        >
          <p className="absolute right-2 top-1 group-hover:right-1 group-hover:top-2 text-sm transition-all duration-300 ease-in-out z-50">
            LI
          </p>
          <div className="absolute opacity-0 group-hover:opacity-100 w-8 h-8 border border-copper top-1 left-1 !z-10 shadow-gray-600 transition-all duration-300 ease-in-out" />
        </a>

        <a
          href={businessData.socialMedia.pinterest}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-8 h-8 border border-carbon flex items-center justify-center !z-20 group"
        >
          <p className="absolute right-[6px] top-1 group-hover:right-1 group-hover:top-2 text-sm transition-all duration-300 ease-in-out z-50">
            PT
          </p>
          <div className="absolute opacity-0 group-hover:opacity-100 w-8 h-8 border border-copper top-1 left-1 !z-10 shadow-gray-600 transition-all duration-300 ease-in-out" />
        </a>
      </div>
    </div>
  );
}

export default SocialMedia;
