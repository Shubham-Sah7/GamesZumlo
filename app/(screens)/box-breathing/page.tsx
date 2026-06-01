'use client'

import { GameShell } from '@/components/game-shell'
import { BoxBreathingExperience } from '@/components/box-breathing/box-breathing-experience'

export default function BoxBreathingPage() {
  return (
    <GameShell
      config={{
        title: 'Breathing',
        description: 'Follow Zummi and breathe at its pace.',
        completionMessage: 'you found a moment of calm',
      }}
      renderGame={(onComplete) => <BoxBreathingExperience onComplete={onComplete} />}
    />
  )
}
