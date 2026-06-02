'use client'

import { useState } from 'react'
import { IntroScreen } from './intro-screen'
import { FillBackpackScreen } from './fill-backpack-screen'
import { FeelWeightScreen } from './feel-weight-screen'
import { LetGoJourneyScreen } from './let-go-journey-screen'
import { CompletionScreen } from './completion-screen'

type State = 'intro' | 'fill' | 'feel' | 'journey' | 'complete'

export interface Worry {
  id: string
  text: string
  canControl: 'yes' | 'partially' | 'no' | null
  mattersIn5Years: 'definitely' | 'maybe' | 'probably-not' | null
  canTakeAction: 'yes' | 'no' | null
  released: boolean
  isActionStone: boolean
}

export function Backpack() {
  const [state, setState] = useState<State>('intro')
  const [worries, setWorries] = useState<Worry[]>([])

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: '#F0FFF0' }}
    >
      {state === 'intro' && <IntroScreen onNext={() => setState('fill')} />}
      {state === 'fill' && (
        <FillBackpackScreen
          worries={worries}
          setWorries={setWorries}
          onNext={() => setState('feel')}
        />
      )}
      {state === 'feel' && (
        <FeelWeightScreen
          worryCount={worries.length}
          onNext={() => setState('journey')}
        />
      )}
      {state === 'journey' && (
        <LetGoJourneyScreen
          worries={worries}
          setWorries={setWorries}
          onComplete={() => setState('complete')}
        />
      )}
      {state === 'complete' && (
        <CompletionScreen
          totalWorries={worries.length}
          releasedCount={worries.filter((w) => w.released).length}
        />
      )}
    </div>
  )
}
