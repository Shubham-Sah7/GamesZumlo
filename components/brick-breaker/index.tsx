"use client";

import { useState } from "react";
import { WelcomeScreen } from "./welcome-screen";
import { GameExperience } from "./game-experience";
import { CompletionScreen } from "./completion-screen";
import { FailureScreen } from "./failure-screen";

type GameState = "welcome" | "playing" | "complete" | "failed";

export function BrickBreaker() {
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [bricksCleared, setBricksCleared] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const handleStart = () => {
    setGameState("playing");
    setBricksCleared(0);
    setTimeSpent(0);
  };

  const handleComplete = (cleared: number, time: number) => {
    setBricksCleared(cleared);
    setTimeSpent(time);
    setGameState("complete");
  };

  const handleFailed = (cleared: number, time: number) => {
    setBricksCleared(cleared);
    setTimeSpent(time);
    setGameState("failed");
  };

  const handleContinue = () => {
    // Reset and go back to welcome
    setGameState("welcome");
    setBricksCleared(0);
    setTimeSpent(0);
  };

  const handleRetry = () => {
    // Restart game
    setGameState("playing");
    setBricksCleared(0);
    setTimeSpent(0);
  };

  return (
    <div 
      className="relative h-screen w-full overflow-hidden" 
      style={{ 
        backgroundColor: "#D4E8E0",
      }}
    >
      {gameState === "welcome" && <WelcomeScreen onStart={handleStart} />}

      {gameState === "playing" && (
        <GameExperience 
          onComplete={handleComplete}
          onFailed={handleFailed}
        />
      )}

      {gameState === "complete" && (
        <CompletionScreen
          onContinue={handleContinue}
          bricksCleared={bricksCleared}
          timeSpent={timeSpent}
        />
      )}

      {gameState === "failed" && (
        <FailureScreen
          onRetry={handleRetry}
          bricksCleared={bricksCleared}
          timeSpent={timeSpent}
        />
      )}
    </div>
  );
}
