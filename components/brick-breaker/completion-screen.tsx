"use client";

import { HoneydewCompletionScreen } from "../honeydew-completion-screen";

interface CompletionScreenProps {
  onContinue: () => void;
  bricksCleared: number;
  timeSpent: number;
}

export function CompletionScreen({
  onContinue,
  bricksCleared,
  timeSpent,
}: CompletionScreenProps) {
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  const timeText =
    minutes > 0
      ? `${minutes}m ${seconds}s`
      : `${seconds}s`;

  return (
    <HoneydewCompletionScreen
      message="you've broken through the clutter"
      onContinue={onContinue}
      stats={[
        { label: "Bricks Cleared", value: bricksCleared.toString() },
        { label: "Time Spent", value: timeText },
      ]}
    />
  );
}
