"use client";

import { HoneydewMascot } from "../honeydew-mascot";

interface FailureScreenProps {
  onRetry: () => void;
  bricksCleared: number;
  timeSpent: number;
}

const COLORS = {
  honeydew: "#D4E8E0",
  lavenderFog: "#76648B",
  deepOcean: "#083F56",
};

export function FailureScreen({ onRetry, bricksCleared, timeSpent }: FailureScreenProps) {
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  const timeText = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <div
      className="h-full flex flex-col items-center justify-center px-8"
      style={{
        background: COLORS.honeydew,
        transition: "opacity 0.8s ease-out",
      }}
    >
      {/* Honeydew Mascot */}
      <div className="mb-8">
        <HoneydewMascot size={120} />
      </div>

      {/* Title - Large and friendly */}
      <h2
        className="text-[36px] font-medium text-center mb-2"
        style={{
          color: COLORS.deepOcean,
          letterSpacing: "-0.02em",
          lineHeight: "1.1",
        }}
      >
        Oops...
      </h2>

      {/* Message - Small and lightweight */}
      <p
        className="text-[14px] text-center mb-8"
        style={{
          color: COLORS.lavenderFog,
          lineHeight: "1.4",
          opacity: 0.85,
        }}
      >
        let's try that again
      </p>

      {/* Stats */}
      {bricksCleared > 0 && (
        <div className="mb-8 flex gap-8">
          <div className="text-center">
            <p
              className="text-[24px] font-medium mb-1"
              style={{ color: COLORS.deepOcean }}
            >
              {bricksCleared}
            </p>
            <p
              className="text-[12px]"
              style={{ color: COLORS.lavenderFog, opacity: 0.7 }}
            >
              Cleared
            </p>
          </div>
          <div className="text-center">
            <p
              className="text-[24px] font-medium mb-1"
              style={{ color: COLORS.deepOcean }}
            >
              {timeText}
            </p>
            <p
              className="text-[12px]"
              style={{ color: COLORS.lavenderFog, opacity: 0.7 }}
            >
              Time
            </p>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={onRetry}
        className="w-full max-w-[340px] text-[16px] font-medium transition-all active:scale-[0.97]"
        style={{
          height: "58px",
          background: COLORS.lavenderFog,
          color: "#FFFFFF",
          borderRadius: "16px",
          letterSpacing: "0.01em",
        }}
      >
        Play Again
      </button>
    </div>
  );
}
