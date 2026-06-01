"use client";

import { HoneydewWelcomeScreen } from "../honeydew-welcome-screen";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <HoneydewWelcomeScreen
      title="Brick Breaker"
      description="Sometimes our thoughts pile up like walls in front of us. Break through them one brick at a time and create space for clarity."
      onStart={onStart}
    />
  );
}
