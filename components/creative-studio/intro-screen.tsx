"use client";

import { useState } from "react";
import { HoneydewMascot } from "@/components/honeydew-mascot";
import { Scene, SCENES } from "./index";

interface IntroScreenProps {
  onStart: (scene: Scene) => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const [selectedScene, setSelectedScene] = useState<Scene>(SCENES[0]);

  return (
    <div className="flex h-full w-full flex-col items-center px-6 py-4">
      {/* Header */}
      <div className="mb-6 flex flex-col items-center">
        <HoneydewMascot size={80} />
        <h1
          className="mt-4 text-center text-[24px] font-semibold"
          style={{
            color: "#083F56",
            letterSpacing: "-0.02em",
          }}
        >
          Creative Studio
        </h1>
        <p
          className="mt-2 text-center text-[14px]"
          style={{
            color: "#083F56",
            opacity: 0.7,
          }}
        >
          Choose a world to create
        </p>
      </div>

      {/* Scene Grid */}
      <div className="mb-6 grid w-full max-w-[500px] grid-cols-2 gap-3 overflow-y-auto">
        {SCENES.map((scene) => (
          <button
            key={scene.id}
            onClick={() => setSelectedScene(scene)}
            className="flex flex-col items-center rounded-2xl p-4 transition-all active:scale-95"
            style={{
              backgroundColor:
                selectedScene.id === scene.id
                  ? "rgba(87, 169, 154, 0.15)"
                  : "rgba(255, 255, 255, 0.5)",
              border: `2px solid ${
                selectedScene.id === scene.id ? "#57A99A" : "#B8CBBE"
              }`,
            }}
          >
            <div className="mb-2 text-[32px]">{scene.emoji}</div>
            <p
              className="text-center text-[13px] font-medium"
              style={{ color: "#083F56" }}
            >
              {scene.title}
            </p>
          </button>
        ))}
      </div>

      {/* Selected Challenge */}
      <div className="mb-6 w-full max-w-[500px] rounded-2xl bg-white/60 p-4 text-center">
        <p
          className="text-[18px] font-semibold"
          style={{ color: "#083F56", letterSpacing: "-0.01em" }}
        >
          {selectedScene.challenge}
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={() => onStart(selectedScene)}
        className="rounded-full px-12 py-4 text-[17px] font-semibold transition-all active:scale-95"
        style={{
          backgroundColor: "#76648B",
          color: "#FFFFFF",
          boxShadow: "0 4px 12px rgba(118, 100, 139, 0.3)",
        }}
      >
        Start Creating
      </button>
    </div>
  );
}
