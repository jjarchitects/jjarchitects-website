import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-[8000px] h-[600px] max-h-screen max-w-screen">
          <Image
            src="/assets/sketch.svg"
            alt="Responsive image"
            fill
            className="object-contain select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
