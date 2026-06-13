import { useEffect, useState } from "react";

export default function AIFlip() {
  const [showAema, setShowAema] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAema((prev) => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center h-full">
      <div
        className={`transition-all duration-1000 absolute ${
          showAema
            ? "opacity-0 rotate-y-180 scale-90"
            : "opacity-100 scale-100"
        }`}
      >
        <h1 className="text-[12rem] font-black text-blue-500">
          AI
        </h1>
      </div>

      <div
        className={`transition-all duration-1000 absolute ${
          showAema
            ? "opacity-100 scale-100"
            : "opacity-0 rotate-y-180 scale-90"
        }`}
      >
        <h1 className="text-[10rem] font-black text-white">
          AEMA
        </h1>
      </div>
    </div>
  );
}