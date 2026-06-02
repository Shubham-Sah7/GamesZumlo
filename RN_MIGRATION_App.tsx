// App.tsx - Root component for React Native
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';

// Screens
import HomeScreen from './src/screens/HomeScreen';

// Games
import BreatheGame from './src/games/breathe/BreatheGame';
import BoxBreathingGame from './src/games/boxBreathing/BoxBreathingGame';
import RainDropCleanseGame from './src/games/rainDropCleanse/RainDropCleanseGame';
import CloudDriftGame from './src/games/cloudDrift/CloudDriftGame';
import LanternReleaseGame from './src/games/lanternRelease/LanternReleaseGame';
import GratitudeTreeGame from './src/games/gratitudeTree/GratitudeTreeGame';
import FireflyCatcherGame from './src/games/fireflyCatcher/FireflyCatcherGame';
import BrickBreakerGame from './src/games/brickBreaker/BrickBreakerGame';
import GentleTapJourneyGame from './src/games/gentleTapJourney/GentleTapJourneyGame';
import ColorYourWorldGame from './src/games/colorYourWorld/ColorYourWorldGame';
import CreativeStudioGame from './src/games/creativeStudio/CreativeStudioGame';
import SketchItGame from './src/games/sketchIt/SketchItGame';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Breathe" component={BreatheGame} />
            <Stack.Screen name="BoxBreathing" component={BoxBreathingGame} />
            <Stack.Screen
              name="RainDropCleanse"
              component={RainDropCleanseGame}
            />
            <Stack.Screen name="CloudDrift" component={CloudDriftGame} />
            <Stack.Screen
              name="LanternRelease"
              component={LanternReleaseGame}
            />
            <Stack.Screen name="GratitudeTree" component={GratitudeTreeGame} />
            <Stack.Screen
              name="FireflyCatcher"
              component={FireflyCatcherGame}
            />
            <Stack.Screen name="BrickBreaker" component={BrickBreakerGame} />
            <Stack.Screen
              name="GentleTapJourney"
              component={GentleTapJourneyGame}
            />
            <Stack.Screen
              name="ColorYourWorld"
              component={ColorYourWorldGame}
            />
            <Stack.Screen
              name="CreativeStudio"
              component={CreativeStudioGame}
            />
            <Stack.Screen name="SketchIt" component={SketchItGame} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
