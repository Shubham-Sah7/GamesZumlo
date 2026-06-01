"use client";

import { HoneydewMascot } from "@/components/honeydew-mascot";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-8">
      {/* Zummi centered */}
      <div className="mb-8">
        <HoneydewMascot size={140} />
      </div>

      {/* Title */}
      <h1
        className="mb-4 text-center text-[28px] font-semibold leading-tight"
        style={{
          color: "#083F56",
          letterSpacing: "-0.02em",
        }}
      >
        Breathing
      </h1>

      {/* Subheading */}
      <p
        className="mb-12 max-w-[320px] text-center text-[16px] leading-relaxed"
        style={{
          color: "#083F56",
          opacity: 0.7,
          lineHeight: "1.6",
        }}
      >
        Follow Zummi and breathe at its pace.
      </p>

      {/* CTA Button */}
      <button
        onClick={onStart}
        className="rounded-full px-12 py-4 text-[17px] font-semibold transition-all active:scale-95"
        style={{
          backgroundColor: "#57A99A",
          color: "#FFFFFF",
          boxShadow: "0 4px 12px rgba(87, 169, 154, 0.3)",
        }}
      >
        Let's Begin
      </button>
    </div>
  );
}
