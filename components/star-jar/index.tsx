'use client'

import { useState } from 'react'
import { WelcomeScreen } from './welcome-screen'
import { StarCatchingExperience } from './star-catching-experience'
import { CompletionScreen } from './completion-screen'

type State = 'welcome' | 'catching' | 'complete'

export function StarJar() {
  const [state, setState] = useState<State>('welcome')

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: '#F0FFF0' }}
    >
      {state === 'welcome' && <WelcomeScreen onStart={() => setState('catching')} />}
      {state === 'catching' && <StarCatchingExperience onComplete={() => setState('complete')} />}
      {state === 'complete' && <CompletionScreen />}
    </div>
  )
}
