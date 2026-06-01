'use client'

import { useState } from 'react'
import { WelcomeScreen } from './welcome-screen'
import { TappingExperience } from './tapping-experience'
import { CompletionScreen } from './completion-screen'

type State = 'welcome' | 'tapping' | 'complete'

export function GentleTapJourney() {
  const [state, setState] = useState<State>('welcome')

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: '#F0FFF0' }}
    >
      {state === 'welcome' && <WelcomeScreen onStart={() => setState('tapping')} />}
      {state === 'tapping' && <TappingExperience onComplete={() => setState('complete')} />}
      {state === 'complete' && <CompletionScreen />}
    </div>
  )
}
