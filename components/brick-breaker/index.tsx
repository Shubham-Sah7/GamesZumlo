"use client";

import { useState } from "react";
import { WelcomeScreen } from "./welcome-screen";
import { GameExperience } from "./game-experience";
import { CompletionScreen } from "./completion-screen";

type GameState = "welcome" | "playing" | "complete";

export function BrickBreaker() {
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [bricksCleared, setBricksCleared] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const handleStart = () => {
    setGameState("playing");
  };

  const handleComplete = (cleared: number, time: number) => {
    setBricksCleared(cleared);
    setTimeSpent(time);
    setGameState("complete");
  };

  const handleContinue = () => {
    // Reset and go back to welcome
    setGameState("welcome");
    setBricksCleared(0);
    setTimeSpent(0);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F0FFF0]">
      {gameState === "welcome" && <WelcomeScreen onStart={handleStart} />}

      {gameState === "playing" && <GameExperience onComplete={handleComplete} />}

      {gameState === "complete" && (
        <CompletionScreen
          onContinue={handleContinue}
          bricksCleared={bricksCleared}
          timeSpent={timeSpent}
        />
      )}
    </div>
  );
}
