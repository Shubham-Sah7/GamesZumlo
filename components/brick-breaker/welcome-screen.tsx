"use client";

import { HoneydewWelcomeScreen } from "../honeydew-welcome-screen";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <HoneydewWelcomeScreen
      title="Brick Breaker"
      description="Sometimes our thoughts build walls in front of us. Break through them one block at a time and make space for clarity."
      onStart={onStart}
    />
  );
}
