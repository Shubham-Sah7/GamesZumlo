"use client";

import { useEffect, useState } from "react";

interface MascotProps {
  size?: number;
  animate?: "idle" | "breatheIn" | "hold" | "breatheOut" | "celebrate";
  phase?: "inhale" | "hold" | "exhale";
}

export function Mascot({ size = 120, animate = "idle", phase = "inhale" }: MascotProps) {
  const [blink, setBlink] = useState(false);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Continuous smooth animation styles
  const getAnimationStyle = () => {
    switch (animate) {
      case "breatheIn":
        return {
          transform: "scale(1.1)",
          filter: "drop-shadow(0 0 16px rgba(255, 157, 73, 0.35))",
          transition: "all 0.8s ease-out", // Smooth continuous transition
        };
      case "hold":
        return {
          transform: "scale(1.1)",
          filter: "drop-shadow(0 0 16px rgba(255, 157, 73, 0.35))",
          animation: "gentleFloat 4s ease-in-out infinite", // Gentle floating during hold
        };
      case "breatheOut":
        return {
          transform: "scale(1)",
          filter: "drop-shadow(0 0 8px rgba(255, 157, 73, 0.2))",
          transition: "all 1s ease-in", // Smooth continuous transition
        };
      case "celebrate":
        return {
          animation: "bounce 0.6s ease-in-out 2",
        };
      case "idle":
      default:
        return {
          animation: "float 3s ease-in-out infinite",
        };
    }
  };

  return (
    <div style={getAnimationStyle()}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 168 169"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#mascot_clip)">
          {/* Body */}
          <path
            d="M70.4097 0H79.0865C81.0075 1.08483 83.7572 1.29563 85.5965 2.42955C93.1301 7.07392 97.018 15.9247 99.7105 24.0058C100.038 24.9985 101.279 29.5022 101.677 30.0569C102.497 29.9665 105.392 27.0006 106.447 26.3333C113.297 21.9983 119.679 16.1357 127.696 14.1108C159.429 6.0962 175.596 41.8005 157.245 65.087C153.869 69.3745 150.194 73.2231 146.23 76.9998C145.268 77.932 139.999 82.2386 139.932 82.5138C140.637 83.642 154.267 87.2655 156.765 88.8722C163.647 93.2979 166.138 98.5601 167.053 106.35C167.692 111.885 167.388 117.488 166.156 122.922C165.27 126.754 162.601 132.608 159.566 135.357C153.071 141.07 144.638 144.477 136.777 147.866C133.08 149.46 129.104 150.559 125.449 152.29C115.188 157.151 105.03 161.949 94.5226 166.274C92.55 167.088 85.7104 168.139 84.9442 168.656H80.936C80.5302 168.376 78.6732 167.997 78.1062 167.89C74.2314 167.16 70.4619 165.549 67.5447 162.845C62.3833 158.061 58.6492 143.356 58.5596 136.64C46.423 146.033 28.5779 154.699 13.955 145.306C-1.82688 135.248 4.33834 113.411 9.80049 99.1339C11.7478 94.0441 16.3112 87.372 18.5786 82.0915C19.6635 79.5649 22.767 75.6579 24.4719 73.2882C24.0143 73.1722 23.5586 73.0497 23.1046 72.9205C18.3097 71.5377 11.2556 67.3916 7.55329 63.9038C5.27305 61.5369 3.65774 58.8812 2.19153 55.9949C1.24127 54.1242 0.906682 51.174 0 49.6729V41.725C0.371392 41.2488 1.14714 38.5124 1.40525 37.6381C2.73891 33.1211 5.55514 28.6192 9.28385 25.7014C10.6049 24.6676 13.4682 23.4578 14.9672 22.6582C22.3253 18.7335 30.1995 15.8162 37.9191 12.6954C39.5794 11.9611 41.142 10.9263 42.7821 10.1585C49.5142 7.0068 56.3066 3.92168 63.4947 1.95828C64.9783 1.55306 69.2733 0.714856 70.4097 0Z"
            fill="#FF9D49"
          />
          
          {/* Eyes */}
          <path
            d="M103.008 56.4907C104.783 56.2773 107.425 56.6886 109.155 57.0938C113.679 58.1535 117.815 62.405 120.099 66.3143C123.993 73.1498 125.038 81.5601 123.084 89.1723C120.583 98.9181 111.188 107.284 100.696 104.495C94.7117 102.903 91.2129 98.5901 88.225 93.4002C87.9184 96.2455 86.941 99.7148 85.5536 102.221C81.1552 110.165 75.2591 114.207 66.0597 113.84C64.9768 113.677 63.9083 113.429 62.8639 113.099C56.8238 111.169 52.9908 106.714 50.0677 101.137C44.2259 89.9926 46.4461 71.4311 58.4544 65.1734C67.7331 60.3381 77.9724 64.7147 83.1873 73.1496C83.948 74.3802 84.9273 75.3625 85.6258 76.7593C86.4633 71.4967 88.1503 66.6979 91.7233 62.6809C95.1591 58.8184 97.9349 57.2219 103.008 56.4907Z"
            fill="#FEFEFE"
          />
          
          {/* Pupils */}
          <path
            d="M106.427 75.6995C121.53 75.8924 122.48 101.962 107.783 102.57C105.178 102.553 102.657 101.646 100.639 99.9986C92.6105 93.413 94.1843 76.7486 106.427 75.6995Z"
            fill="#033B4F"
            style={{
              transform: blink ? "scaleY(0.1)" : "scaleY(1)",
              transformOrigin: "center",
              transition: "transform 0.15s ease-out",
            }}
          />
          <path
            d="M72.4453 80.9459C78.9272 80.3662 83.5794 86.6262 84.7208 92.3374C86.0234 98.8569 81.9993 106.745 75.164 108.074C72.5621 108.268 69.6421 107.002 67.6425 105.397C61.6223 100.566 60.696 90.6779 65.6224 84.763C67.5062 82.5012 69.4613 81.2489 72.4453 80.9459Z"
            fill="#033B4F"
            style={{
              transform: blink ? "scaleY(0.1)" : "scaleY(1)",
              transformOrigin: "center",
              transition: "transform 0.15s ease-out",
            }}
          />
        </g>
        <defs>
          <clipPath id="mascot_clip">
            <rect width="168" height="168.656" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes gentleFloat {
          0%, 100% {
            transform: scale(1.1) translateY(0px);
          }
          50% {
            transform: scale(1.1) translateY(-4px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
