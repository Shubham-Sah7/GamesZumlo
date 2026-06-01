"use client";

import { HoneydewMascot } from "@/components/honeydew-mascot";
import { Scene } from "./index";

interface CompletionScreenProps {
  scene: Scene;
  canvasData: string;
  onCreateAnother: () => void;
}

const COMPLETION_MESSAGES = [
  "Your world is complete.",
  "Great creativity today.",
  "Every creation is unique.",
  "Beautiful work.",
  "You made something special.",
];

export function CompletionScreen({
  scene,
  canvasData,
  onCreateAnother,
}: CompletionScreenProps) {
  const message =
    COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-8">
      {/* Mascot */}
      <div className="mb-6 animate-[fadeIn_0.6s_ease-out]">
        <HoneydewMascot size={100} />
      </div>

      {/* Title */}
      <h1
        className="mb-2 animate-[fadeIn_0.8s_ease-out] text-center text-[28px] font-semibold"
        style={{
          color: "#083F56",
          letterSpacing: "-0.02em",
        }}
      >
        {scene.emoji} {scene.title}
      </h1>

      {/* Message */}
      <p
        className="mb-6 animate-[fadeIn_1s_ease-out] text-center text-[16px]"
        style={{
          color: "#083F56",
          opacity: 0.7,
        }}
      >
        {message}
      </p>

      {/* Canvas Preview */}
      {canvasData && (
        <div className="mb-8 animate-[fadeIn_1.2s_ease-out] overflow-hidden rounded-2xl shadow-lg">
          <img
            src={canvasData}
            alt="Your creation"
            className="h-auto w-full max-w-[400px]"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCreateAnother}
          className="animate-[fadeIn_1.4s_ease-out] rounded-full px-8 py-3 text-[16px] font-semibold transition-all active:scale-95"
          style={{
            backgroundColor: "#76648B",
            color: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(118, 100, 139, 0.3)",
          }}
        >
          Create Another
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="animate-[fadeIn_1.4s_ease-out] rounded-full border-2 px-8 py-3 text-[16px] font-semibold transition-all active:scale-95"
          style={{
            borderColor: "#76648B",
            color: "#76648B",
          }}
        >
          Return Home
        </button>
      </div>

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
