'use client'

import { useState } from 'react'
import { BoxBreathing } from '@/components/box-breathing'
import { BreathingJourney } from '@/components/breathing-journey'
import { RainDropCleanseV2 } from '@/components/rain-drop-cleanse-v2'
import { CloudDrift } from '@/components/cloud-drift'
import { LanternRelease } from '@/components/lantern-release'

const games = [
  { id: 'breathe', name: 'Breathe With Honeydew', component: BreathingJourney },
  { id: 'box', name: 'Box Breathing', component: BoxBreathing },
  { id: 'rain', name: 'Rain Drop Cleanse', component: RainDropCleanseV2 },
  { id: 'cloud', name: 'Cloud Drift', component: CloudDrift },
  { id: 'lantern', name: 'Lantern Release', component: LanternRelease },
]

export default function RNMigrationTestPage() {
  const [selectedGame, setSelectedGame] = useState(games[0])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🎮 React Native Migration Test
        </h1>
        <p className="text-sm text-gray-600">
          Test the Next.js versions of games that have been migrated to React Native
        </p>
      </div>

      <div className="flex h-[calc(100vh-88px)]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Migrated Games (5)
            </h2>
            <div className="space-y-1">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedGame.id === game.id
                      ? 'bg-purple-100 text-purple-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {game.name}
                </button>
              ))}
            </div>

            <div className="mt-8 p-3 bg-blue-50 rounded-lg">
              <h3 className="text-xs font-semibold text-blue-900 mb-2">
                ✅ Migration Status
              </h3>
              <div className="text-xs text-blue-800 space-y-1">
                <div>• 5/13 games complete</div>
                <div>• React Native ready</div>
                <div>• 1:1 feature parity</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <h3 className="text-xs font-semibold text-green-900 mb-2">
                📦 Files Created
              </h3>
              <div className="text-xs text-green-800 space-y-1">
                <div>• BreatheGame.tsx</div>
                <div>• BoxBreathingGame.tsx</div>
                <div>• RainDropCleanseGame.tsx</div>
                <div>• CloudDriftGame.tsx</div>
                <div>• LanternReleaseGame.tsx</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <h3 className="text-xs font-semibold text-yellow-900 mb-2">
                📝 Documentation
              </h3>
              <div className="text-xs text-yellow-800 space-y-1">
                <div>• README.md</div>
                <div>• QUICK_START.md</div>
                <div>• FINAL_STATUS.md</div>
                <div>• + 7 more guides</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Game Info Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedGame.name}
                </h2>
                <p className="text-xs text-gray-500">
                  Next.js Version (Source of Truth)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ Migrated to RN
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  1:1 Parity
                </span>
              </div>
            </div>
          </div>

          {/* Game Preview */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
            <div className="relative" style={{ width: '393px', height: '852px' }}>
              {/* iPhone Frame */}
              <div className="absolute inset-0 bg-black rounded-[3rem] shadow-2xl p-3">
                <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Dynamic Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50" />
                  
                  {/* Game Content */}
                  <div className="relative w-full h-full">
                    <selectedGame.component />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                💡 Testing Instructions
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <strong>Next.js Version (Here):</strong>
                  <br />
                  Play the game as it works in the web app
                </div>
                <div>
                  <strong>React Native Version (Mobile):</strong>
                  <br />
                  Should work identically when built for iOS/Android
                </div>
              </div>
              <div className="mt-3 p-3 bg-purple-50 rounded-lg text-xs text-purple-900">
                <strong>✅ To test React Native versions:</strong> Follow instructions in{' '}
                <code className="bg-purple-100 px-1 py-0.5 rounded">
                  RN_MIGRATION_QUICK_START.md
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
