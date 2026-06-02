# React Native Migration Guide for Honeydew Games

## Project Setup Commands

Run these commands in your terminal outside this workspace:

```bash
# Navigate to your dev directory
cd /Users/shubhamsah/dev

# Create new React Native CLI project
npx react-native@latest init HoneydewGames

# Navigate into the project
cd HoneydewGames

# Install required dependencies
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install react-native-reanimated react-native-gesture-handler
npm install react-native-svg
npm install @react-native-async-storage/async-storage

# iOS specific (if on Mac)
cd ios && pod install && cd ..

# Run the app
npm run ios    # for iOS
npm run android # for Android
```

---

## Project Structure

```
HoneydewGames/
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── screens/
│   │   └── HomeScreen.tsx
│   ├── games/
│   │   ├── breathe/
│   │   │   └── BreatheGame.tsx
│   │   ├── boxBreathing/
│   │   │   └── BoxBreathingGame.tsx
│   │   ├── rainDropCleanse/
│   │   │   └── RainDropCleanseGame.tsx
│   │   ├── cloudDrift/
│   │   │   └── CloudDriftGame.tsx
│   │   ├── lanternRelease/
│   │   │   └── LanternReleaseGame.tsx
│   │   ├── gratitudeTree/
│   │   │   └── GratitudeTreeGame.tsx
│   │   ├── fireflyCatcher/
│   │   │   └── FireflyCatcherGame.tsx
│   │   ├── brickBreaker/
│   │   │   └── BrickBreakerGame.tsx
│   │   ├── gentleTapJourney/
│   │   │   └── GentleTapJourneyGame.tsx
│   │   ├── colorYourWorld/
│   │   │   └── ColorYourWorldGame.tsx
│   │   ├── creativeStudio/
│   │   │   └── CreativeStudioGame.tsx
│   │   ├── sketchIt/
│   │   │   └── SketchItGame.tsx
│   │   └── clearMyMind/
│   │       └── ClearMyMindGame.tsx
│   ├── components/
│   │   ├── HoneydewMascot.tsx
│   │   └── GameCard.tsx
│   ├── constants/
│   │   └── colors.ts
│   └── utils/
│       └── haptics.ts
├── App.tsx
└── package.json
```

---

## Step-by-Step Migration Process

### Phase 1: Setup Base Structure

1. Create the project structure above
2. Set up navigation
3. Create base components (HoneydewMascot, GameCard)
4. Create HomeScreen with game cards

### Phase 2: Migrate Games (Priority Order)

**Simple Games First:**
1. Breathe With Honeydew (animations only)
2. Box Breathing (simple breathing animation)
3. Rain Drop Cleanse (tap interactions)
4. Cloud Drift (drag gestures)
5. Lantern Release (drag + float animation)

**Medium Complexity:**
6. Gratitude Tree (state management)
7. Firefly Catcher (touch tracking)
8. Gentle Tap Journey (body tap zones)

**Complex Games:**
9. Brick Breaker (game loop, physics)
10. Color Your World (SVG drawing)
11. Creative Studio (canvas drawing)
12. Sketch It (free drawing)
13. Clear My Mind (coming soon)

---

## Migration Examples

I'll create the complete migration examples in the next files...
