"use client";

import { useState } from "react";
import { IntroScreen } from "./intro-screen";
import { CreativeCanvas } from "./creative-canvas";
import { CompletionScreen } from "./completion-screen";

type State = "intro" | "creating" | "complete";

export interface Scene {
  id: string;
  title: string;
  challenge: string;
  emoji: string;
  baseImage: string;
}

export const SCENES: Scene[] = [
  {
    id: "dream-planet",
    title: "Dream Planet",
    challenge: "Create Your Dream Planet",
    emoji: "🪐",
    baseImage: "/scenes/planet.svg",
  },
  {
    id: "magical-garden",
    title: "Magical Garden",
    challenge: "Design a Magical Garden",
    emoji: "🌸",
    baseImage: "/scenes/garden.svg",
  },
  {
    id: "cozy-corner",
    title: "Cozy Reading Corner",
    challenge: "Build a Cozy Reading Corner",
    emoji: "📚",
    baseImage: "/scenes/reading.svg",
  },
  {
    id: "treehouse",
    title: "Fantasy Treehouse",
    challenge: "Decorate a Fantasy Treehouse",
    emoji: "🏡",
    baseImage: "/scenes/treehouse.svg",
  },
  {
    id: "underwater",
    title: "Underwater Kingdom",
    challenge: "Create an Underwater Kingdom",
    emoji: "🐠",
    baseImage: "/scenes/underwater.svg",
  },
  {
    id: "space-station",
    title: "Space Station",
    challenge: "Design a Space Station",
    emoji: "🚀",
    baseImage: "/scenes/space.svg",
  },
  {
    id: "dragon-home",
    title: "Dragon's Home",
    challenge: "Build a Dragon's Home",
    emoji: "🐉",
    baseImage: "/scenes/dragon.svg",
  },
  {
    id: "sky-island",
    title: "Sky Islands",
    challenge: "Create Floating Sky Islands",
    emoji: "☁️",
    baseImage: "/scenes/sky.svg",
  },
];

export function CreativeStudio() {
  const [state, setState] = useState<State>("intro");
  const [selectedScene, setSelectedScene] = useState<Scene>(SCENES[0]);
  const [canvasData, setCanvasData] = useState<string>("");

  const handleStart = (scene: Scene) => {
    setSelectedScene(scene);
    setState("creating");
  };

  const handleFinish = (data: string) => {
    setCanvasData(data);
    setState("complete");
  };

  const handleCreateAnother = () => {
    setState("intro");
    setCanvasData("");
  };

  return (
    <div 
      className="relative h-screen w-full overflow-hidden" 
      style={{ 
        backgroundColor: "#F0FFF0",
      }}
    >
      {state === "intro" && <IntroScreen onStart={handleStart} />}
      {state === "creating" && (
        <CreativeCanvas scene={selectedScene} onFinish={handleFinish} />
      )}
      {state === "complete" && (
        <CompletionScreen
          scene={selectedScene}
          canvasData={canvasData}
          onCreateAnother={handleCreateAnother}
        />
      )}
    </div>
  );
}
