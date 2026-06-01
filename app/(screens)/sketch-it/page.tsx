'use client'

import { GameShell } from '@/components/game-shell'
import { SketchItGame } from '@/components/sketch-it'

export default function SketchItPage() {
  return (
    <GameShell
      config={{
        title: 'Sketch It',
        description: "Draw what you feel. Creative expression helps reduce stress and quiet a busy mind.",
        completionMessage: 'you made something beautiful today',
        startLabel: "Let's Draw",
      }}
      renderGame={(onComplete) => <SketchItGame onComplete={onComplete} />}
    />
  )
}
