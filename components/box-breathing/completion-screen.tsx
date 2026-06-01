"use client";

import { HoneydewMascot } from "@/components/honeydew-mascot";

interface CompletionScreenProps {
  onContinue: () => void;
}

export function CompletionScreen({ onContinue }: CompletionScreenProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-8">
      {/* Zummi centered */}
      <div className="mb-8 animate-[fadeIn_0.6s_ease-out]">
        <HoneydewMascot size={140} />
      </div>

      {/* Title */}
      <h1
        className="mb-3 animate-[fadeIn_0.8s_ease-out] text-center text-[32px] font-semibold"
        style={{
          color: "#083F56",
          letterSpacing: "-0.02em",
        }}
      >
        Heyy...
      </h1>

      {/* Message */}
      <p
        className="mb-12 animate-[fadeIn_1s_ease-out] text-center text-[18px] leading-relaxed"
        style={{
          color: "#083F56",
          opacity: 0.7,
          lineHeight: "1.6",
        }}
      >
        you found a moment of calm
      </p>

      {/* CTA Button */}
      <button
        onClick={onContinue}
        className="animate-[fadeIn_1.2s_ease-out] rounded-full px-12 py-4 text-[17px] font-semibold transition-all active:scale-95"
        style={{
          backgroundColor: "#57A99A",
          color: "#FFFFFF",
          boxShadow: "0 4px 12px rgba(87, 169, 154, 0.3)",
        }}
      >
        Continue
      </button>

      <style jsx>{`
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
