import Link from 'next/link'

// ── Core Activities ────────────────────────────────────────────────────────────
const CORE_ACTIVITIES = [
  {
    emoji: '🫁',
    title: 'Breathe With Honeydew',
    description: 'Follow along for a calming breath',
    href: '/breathe-with-honeydew',
    category: 'CALM',
    available: true,
  },
  {
    emoji: '✋',
    title: 'Gentle Tap Journey',
    description: 'Reconnect through mindful tapping',
    href: '/gentle-tap-journey',
    category: 'MINDFUL',
    available: true,
  },
  {
    emoji: '🖌️',
    title: 'Color Your World',
    description: 'Bring a magical scene to life with color',
    href: '/color-your-world',
    category: 'CREATE',
    available: true,
  },
  {
    emoji: '◻️',
    title: 'Box Breathing',
    description: 'Find calm with Zummi',
    href: '/box-breathing',
    category: 'CALM',
    available: true,
  },
  {
    emoji: '🌳',
    title: 'Gratitude Tree',
    description: 'Grow your tree with daily gratitude',
    href: '/gratitude-tree',
    category: 'GRATITUDE',
    available: true,
  },
  {
    emoji: '🏮',
    title: 'Lantern Release',
    description: 'Release worries into the sky',
    href: '/lantern-release',
    category: 'MINDFUL',
    available: true,
  },
  {
    emoji: '☁️',
    title: 'Cloud Drift',
    description: 'Let negative thoughts float away',
    href: '/cloud-drift',
    category: 'CALM',
    available: true,
  },
  {
    emoji: '🌧',
    title: 'Rain Drop Cleanse',
    description: 'Release what no longer serves you',
    href: '/rain-drop-cleanse',
    category: 'RELEASE',
    available: true,
  },
  {
    emoji: '✨',
    title: 'Star Jar',
    description: 'Collect moments of light and positivity',
    href: '/star-jar',
    category: 'GRATITUDE',
    available: true,
  },
]

// ── Explore & Play ─────────────────────────────────────────────────────────────
const SECONDARY_ACTIVITIES = [
  {
    emoji: '🎨',
    title: 'Creative Studio',
    description: 'Draw and create your world',
    href: '/creative-studio',
    category: 'FOCUS',
    available: true,
  },
  {
    emoji: '✏️',
    title: 'Sketch It',
    description: 'Draw freely and let your mind unwind',
    href: '/sketch-it',
    category: 'CREATE',
    available: true,
  },
  {
    emoji: '🧱',
    title: 'Brick Breaker',
    description: 'Break through mental clutter',
    href: '/brick-breaker',
    category: 'CLARITY',
    available: true,
  },
]

// ── Deeper Journeys (last section) ────────────────────────────────────────────
const DEEPER_JOURNEYS = [
  {
    emoji: '🎒',
    title: 'The Backpack',
    description: 'Identify and release emotional weight',
    href: '/backpack',
    category: 'RELEASE',
    available: true,
  },
  {
    emoji: '🧘',
    title: 'Clear My Mind',
    description: 'Tap away thoughts and find peace',
    href: '/clear-my-mind',
    category: 'MINDFUL',
    available: false,
  },
]

const GAMES = [...CORE_ACTIVITIES, ...SECONDARY_ACTIVITIES, ...DEEPER_JOURNEYS]

const COLORS = {
  honeydew:   '#F0FFF0',
  sageMist:   '#B8CBBE',
  calmTeal:   '#57A99A',
  lavenderFog:'#76648B',
  warmSunset: '#F59A4A',
  deepOcean:  '#083F56',
}

export default function Hub() {
  return (
    <div
      className="h-full overflow-y-auto"
      style={{
        background: COLORS.honeydew,
        scrollbarWidth: 'none',
        paddingTop: '20px',
        paddingBottom: '32px',
      } as React.CSSProperties}
    >
      <div className="px-6 pt-4">
        {/* Greeting */}
        <div className="mb-8">
          <div className="flex items-start gap-3">
            <Zummie size={48} />
            <h1
              className="text-[22px] font-normal leading-tight"
              style={{ color: COLORS.deepOcean, letterSpacing: '-0.01em', paddingTop: '4px' }}
            >
              Hey! Even a few moments can shift your whole mood.
            </h1>
          </div>
        </div>

        {/* Core Activities */}
        <div className="mb-6">
          <h2 className="text-[13px] font-semibold mb-3 px-1" style={{ color: COLORS.deepOcean, opacity: 0.5, letterSpacing: '0.08em' }}>
            CORE ACTIVITIES
          </h2>
          <div className="grid grid-cols-2 gap-3" style={{ gridAutoRows: '192px' }}>
            {CORE_ACTIVITIES.map((game) => (
              <Link key={game.href} href={game.href} className="block active:scale-[0.97] transition-transform">
                <GameCard game={game} />
              </Link>
            ))}
          </div>
        </div>

        {/* Explore & Play */}
        <div className="mb-6">
          <h2 className="text-[13px] font-semibold mb-3 px-1" style={{ color: COLORS.deepOcean, opacity: 0.5, letterSpacing: '0.08em' }}>
            EXPLORE & PLAY
          </h2>
          <div className="grid grid-cols-2 gap-3" style={{ gridAutoRows: '192px' }}>
            {SECONDARY_ACTIVITIES.map((game) => (
              <Link key={game.href} href={game.href} className="block active:scale-[0.97] transition-transform">
                <GameCard game={game} />
              </Link>
            ))}
          </div>
        </div>

        {/* Deeper Journeys */}
        <div className="mb-6">
          <h2 className="text-[13px] font-semibold mb-3 px-1" style={{ color: COLORS.deepOcean, opacity: 0.5, letterSpacing: '0.08em' }}>
            DEEPER JOURNEYS
          </h2>
          <div className="grid grid-cols-2 gap-3" style={{ gridAutoRows: '192px' }}>
            {DEEPER_JOURNEYS.map((game) =>
              game.available ? (
                <Link key={game.href} href={game.href} className="block active:scale-[0.97] transition-transform">
                  <GameCard game={game} />
                </Link>
              ) : (
                <div key={game.href} className="opacity-50">
                  <GameCard game={game} disabled />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function GameCard({ game, disabled = false }: { game: typeof GAMES[0]; disabled?: boolean }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.5)',
        borderRadius: '16px',
        border: `1px solid ${COLORS.sageMist}`,
        padding: '20px 16px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: COLORS.lavenderFog, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px', opacity: disabled ? 0.6 : 1 }}>
        {game.emoji}
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="text-[16px] font-medium mb-1" style={{ color: COLORS.deepOcean, letterSpacing: '-0.01em', lineHeight: '1.3' }}>
          {game.title}
        </h3>
        <p className="text-[12px] mb-3" style={{ color: COLORS.deepOcean, opacity: 0.6, lineHeight: '1.4' }}>
          {game.description}
        </p>
        <div className="mt-auto">
          <span className="inline-block text-[10px] font-semibold px-3 py-1 rounded-full" style={{ background: getCategoryColor(game.category), color: COLORS.deepOcean, letterSpacing: '0.05em' }}>
            {game.category}
          </span>
        </div>
      </div>
      {disabled && (
        <div className="absolute top-3 right-3 text-[9px] font-semibold px-2 py-1 rounded-full" style={{ background: COLORS.sageMist, color: COLORS.deepOcean, opacity: 0.7 }}>
          SOON
        </div>
      )}
    </div>
  )
}

// ── Full-body Zummi with backpack ──────────────────────────────────────────────
function Zummie({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.45)}
      viewBox="0 0 200 290"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      {/* ── Shadow ── */}
      <ellipse cx="106" cy="274" rx="38" ry="9" fill="rgba(0,0,0,0.14)" />

      {/* ── Backpack body (behind the orange body) ── */}
      <rect x="22" y="118" width="54" height="68" rx="14" fill="#7B5128" />
      <rect x="22" y="118" width="54" height="68" rx="14" fill="none" stroke="#5a3a10" strokeWidth="2" />
      {/* front pocket */}
      <rect x="27" y="154" width="44" height="28" rx="8" fill="#6B4420" />
      <rect x="27" y="154" width="44" height="28" rx="8" fill="none" stroke="#5a3a10" strokeWidth="1.5" />
      {/* zipper line */}
      <path d="M32,164 H66" stroke="#4a2c0a" strokeWidth="1.5" strokeLinecap="round" />
      {/* metal clasp */}
      <rect x="43" y="175" width="14" height="7" rx="2.5" fill="#aaa" />
      <rect x="45" y="176" width="10" height="5" rx="1.5" fill="#888" />

      {/* ── Left strap (goes from pack over left shoulder onto body front) ── */}
      <path d="M50,118 Q42,102 52,88 Q62,76 80,86" stroke="#5a3a10" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M50,118 Q42,102 52,88 Q62,76 80,86" stroke="#7B5128" strokeWidth="7.5" strokeLinecap="round" fill="none" />

      {/* ── Right strap (visible on far right of body) ── */}
      <path d="M155,120 Q162,140 158,160 Q154,175 148,182" stroke="#5a3a10" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M155,120 Q162,140 158,160 Q154,175 148,182" stroke="#7B5128" strokeWidth="7.5" strokeLinecap="round" fill="none" />

      {/* ── Orange body (original mascot shape, translated + scaled to fit) ── */}
      <g transform="translate(16, 0) scale(0.99)">
        <path d="M70.4097 0H79.0865C81.0075 1.08 83.757 1.30 85.597 2.43C93.13 7.07 97.018 15.92 99.71 24.01C100.038 25 101.279 29.5 101.677 30.06C102.497 29.97 105.392 27 106.447 26.33C113.297 22 119.679 16.14 127.696 14.11C159.429 6.10 175.596 41.8 157.245 65.09C153.869 69.37 150.194 73.22 146.23 77C145.268 77.93 139.999 82.24 139.932 82.51C140.637 83.64 154.267 87.27 156.765 88.87C163.647 93.3 166.138 98.56 167.053 106.35C167.692 111.89 167.388 117.49 166.156 122.92C165.27 126.75 162.601 132.61 159.566 135.36C153.071 141.07 144.638 144.48 136.777 147.87C133.08 149.46 129.104 150.56 125.449 152.29C115.188 157.15 105.03 161.95 94.5226 166.27C92.55 167.09 85.7104 168.14 84.9442 168.66H80.936C80.5302 168.38 78.6732 168 78.1062 167.89C74.2314 167.16 70.4619 165.55 67.5447 162.85C62.3833 158.06 58.6492 143.36 58.5596 136.64C46.423 146.03 28.5779 154.7 13.955 145.31C-1.82688 135.25 4.33834 113.41 9.80049 99.13C11.7478 94.04 16.3112 87.37 18.5786 82.09C19.6635 79.56 22.767 75.66 24.4719 73.29C24.0143 73.17 23.5586 73.05 23.1046 72.92C18.3097 71.54 11.2556 67.39 7.55329 63.9C5.27305 61.54 3.65774 58.88 2.19153 55.99C1.24127 54.12 0.906682 51.17 0 49.67V41.72C0.371392 41.25 1.14714 38.51 1.40525 37.64C2.73891 33.12 5.55514 28.62 9.28385 25.7C10.6049 24.67 13.4682 23.46 14.9672 22.66C22.3253 18.73 30.1995 15.82 37.9191 12.7C39.5794 11.96 41.142 10.93 42.7821 10.16C49.5142 7.01 56.3066 3.92 63.4947 1.96C64.9783 1.55 69.2733 0.71 70.4097 0Z" fill="#FF9D49" />
        {/* Eye whites */}
        <path d="M103.008 56.49C104.783 56.28 107.425 56.69 109.155 57.09C113.679 58.15 117.815 62.41 120.099 66.31C123.993 73.15 125.038 81.56 123.084 89.17C120.583 98.92 111.188 107.28 100.696 104.5C94.7117 102.9 91.2129 98.59 88.225 93.4C87.9184 96.25 86.941 99.71 85.5536 102.22C81.1552 110.17 75.2591 114.21 66.0597 113.84C64.9768 113.68 63.9083 113.43 62.8639 113.1C56.8238 111.17 52.9908 106.71 50.0677 101.14C44.2259 90 46.4461 71.43 58.4544 65.17C67.7331 60.34 77.9724 64.71 83.1873 73.15C83.948 74.38 84.9273 75.36 85.6258 76.76C86.4633 71.5 88.1503 66.7 91.7233 62.68C95.1591 58.82 97.9349 57.22 103.008 56.49Z" fill="#FEFEFE" />
        {/* Right pupil */}
        <path d="M106.427 75.7C121.53 75.89 122.48 101.96 107.783 102.57C105.178 102.55 102.657 101.65 100.639 100C92.6105 93.41 94.1843 76.75 106.427 75.7Z" fill="#033B4F" />
        {/* Left pupil */}
        <path d="M72.4453 80.95C78.9272 80.37 83.5794 86.63 84.7208 92.34C86.0234 98.86 81.9993 106.75 75.164 108.07C72.5621 108.27 69.6421 107 67.6425 105.4C61.6223 100.57 60.696 90.68 65.6224 84.76C67.5062 82.5 69.4613 81.25 72.4453 80.95Z" fill="#033B4F" />
      </g>

      {/* ── Left arm (holding left strap) ── */}
      <rect x="14" y="148" width="36" height="20" rx="10" fill="#FF9D49" />
      <rect x="14" y="148" width="36" height="20" rx="10" fill="none" stroke="#e8893a" strokeWidth="1" />
      {/* left fist */}
      <rect x="14" y="150" width="20" height="16" rx="8" fill="#f08530" />

      {/* ── Right arm (holding right strap) ── */}
      <rect x="152" y="143" width="36" height="20" rx="10" fill="#FF9D49" />
      <rect x="152" y="143" width="36" height="20" rx="10" fill="none" stroke="#e8893a" strokeWidth="1" />
      {/* right fist */}
      <rect x="168" y="145" width="20" height="16" rx="8" fill="#f08530" />

      {/* ── Legs ── */}
      {/* left leg */}
      <rect x="72" y="178" width="30" height="56" rx="14" fill="#FF9D49" />
      <rect x="72" y="178" width="30" height="56" rx="14" fill="none" stroke="#e8893a" strokeWidth="1.2" />
      {/* left leg shading */}
      <rect x="82" y="182" width="14" height="48" rx="7" fill="#f08530" opacity="0.4" />
      {/* right leg */}
      <rect x="110" y="178" width="30" height="56" rx="14" fill="#FF9D49" />
      <rect x="110" y="178" width="30" height="56" rx="14" fill="none" stroke="#e8893a" strokeWidth="1.2" />
      {/* right leg shading */}
      <rect x="116" y="182" width="14" height="48" rx="7" fill="#f08530" opacity="0.4" />
    </svg>
  )
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    RELEASE:  'rgba(87, 169, 154, 0.2)',
    CLARITY:  'rgba(118, 100, 139, 0.25)',
    CALM:     'rgba(184, 203, 190, 0.4)',
    MINDFUL:  'rgba(118, 100, 139, 0.2)',
    GRATITUDE:'rgba(245, 154, 74, 0.2)',
    FOCUS:    'rgba(87, 169, 154, 0.25)',
    CREATE:   'rgba(236, 72, 153, 0.18)',
  }
  return colors[category] || 'rgba(184, 203, 190, 0.3)'
}
