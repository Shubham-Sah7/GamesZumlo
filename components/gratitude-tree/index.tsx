'use client'

import { GameShell } from '@/components/game-shell'
import { GratitudeExperience } from './gratitude-experience'

export function GratitudeTree() {
  return (
    <GameShell
      config={{
        title: 'Gratitude Tree',
        description: 'Take a moment to appreciate something good in your day.',
        completionMessage: 'your gratitude helped something grow',
        startLabel: 'Plant Gratitude',
      }}
      renderGame={(onComplete) => <GratitudeExperience onComplete={onComplete} />}
    />
  )
}
