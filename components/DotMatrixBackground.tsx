import React, { useEffect, useState } from "react";

// Greyscale dot colors
const GREYS = [
  "#222",
  "#333",
  "#444",
  "#666",
  "#888",
  "#aaa",
  "#ccc"
];

const DOT_SIZE = 6;
const DOT_GAP = 20;

function getGrey(idx: number) {
  return GREYS[idx % GREYS.length];
}

const DotMatrixBackground: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    function updateSize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const cols = Math.ceil(dimensions.width / DOT_GAP);
  const rows = Math.ceil(dimensions.height / DOT_GAP);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none"
      style={{ background: "#000", overflow: "hidden" }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.18 }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          const color = getGrey(i + row);
          // Optionally animate with a subtle pulsate
          const delay = ((row + col) % 7) * 0.2;
          return (
            <circle
              key={i}
              cx={col * DOT_GAP + DOT_GAP / 2}
              cy={row * DOT_GAP + DOT_GAP / 2}
              r={DOT_SIZE / 2}
              fill={color}
              style={{
                filter: `drop-shadow(0 0 4px ${color})`,
                animation: `dotPulse 2.4s cubic-bezier(.4,0,.2,1) infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </svg>
      <style jsx global>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DotMatrixBackground;
