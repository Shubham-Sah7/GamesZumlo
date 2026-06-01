'use client'

import { GameShell } from '@/components/game-shell'
import { ColorYourWorld } from '@/components/color-your-world'

export default function ColorYourWorldPage() {
  return (
    <GameShell
      config={{
        title: 'Color Your World',
        description: 'Pick a world and bring it to life with color. Each tap reveals a little more magic.',
        completionMessage: 'you brought a new world to life',
        startLabel: "Let's Create",
      }}
      renderGame={(onComplete) => <ColorYourWorld onComplete={onComplete} />}
    />
  )
}
