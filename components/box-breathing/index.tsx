"use client";

import { useState } from "react";
import { WelcomeScreen } from "./welcome-screen";
import { BoxBreathingExperience } from "./box-breathing-experience";
import { CompletionScreen } from "./completion-screen";

type State = "welcome" | "breathing" | "complete";

export function BoxBreathing() {
  const [state, setState] = useState<State>("welcome");

  return (
    <div 
      className="relative w-full overflow-hidden"
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#F0FFF0",
      }}
    >
      {state === "welcome" && <WelcomeScreen onStart={() => setState("breathing")} />}
      {state === "breathing" && <BoxBreathingExperience onComplete={() => setState("complete")} />}
      {state === "complete" && <CompletionScreen onContinue={() => setState("welcome")} />}
    </div>
  );
}
