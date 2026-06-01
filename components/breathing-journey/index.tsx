"use client"

import { useState } from "react"
import { WelcomeScreen } from "./welcome-screen"
import { BreathingExperience } from "./breathing-experience"
import { CompletionScreen } from "./completion-screen"

type State = "welcome" | "breathing" | "complete"

export function BreathingJourney() {
  const [screen, setScreen] = useState<State>("welcome")

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: "#F0FFF0" }}
    >
      {screen === "welcome"   && <WelcomeScreen onStart={() => setScreen("breathing")} />}
      {screen === "breathing" && <BreathingExperience onComplete={() => setScreen("complete")} />}
      {screen === "complete"  && <CompletionScreen />}
    </div>
  )
}
