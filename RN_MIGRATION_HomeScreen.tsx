// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {COLORS, CATEGORY_COLORS} from '../constants/colors';
import HoneydewMascot from '../components/HoneydewMascot';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // Account for padding and gap

interface Game {
  emoji: string;
  title: string;
  description: string;
  screen: string;
  category: string;
  available: boolean;
}

const CORE_ACTIVITIES: Game[] = [
  {
    emoji: '🫁',
    title: 'Breathe With Honeydew',
    description: 'Follow along for a calming breath',
    screen: 'Breathe',
    category: 'CALM',
    available: true,
  },
  {
    emoji: '✋',
    title: 'Gentle Tap Journey',
    description: 'Reconnect through mindful tapping',
    screen: 'GentleTapJourney',
    category: 'MINDFUL',
    available: true,
  },
  {
    emoji: '🖌️',
    title: 'Color Your World',
    description: 'Bring a magical scene to life with color',
    screen: 'ColorYourWorld',
    category: 'CREATE',
    available: true,
  },
  {
    emoji: '◻️',
    title: 'Box Breathing',
    description: 'Find calm with Zummi',
    screen: 'BoxBreathing',
    category: 'CALM',
    available: true,
  },
  {
    emoji: '🌳',
    title: 'Gratitude Tree',
    description: 'Grow your tree with daily gratitude',
    screen: 'GratitudeTree',
    category: 'GRATITUDE',
    available: true,
  },
  {
    emoji: '🏮',
    title: 'Lantern Release',
    description: 'Release worries into the sky',
    screen: 'LanternRelease',
    category: 'MINDFUL',
    available: true,
  },
  {
    emoji: '☁️',
    title: 'Cloud Drift',
    description: 'Let negative thoughts float away',
    screen: 'CloudDrift',
    category: 'CALM',
    available: true,
  },
  {
    emoji: '🌧',
    title: 'Rain Drop Cleanse',
    description: 'Release what no longer serves you',
    screen: 'RainDropCleanse',
    category: 'RELEASE',
    available: true,
  },
];

const SECONDARY_ACTIVITIES: Game[] = [
  {
    emoji: '🎨',
    title: 'Creative Studio',
    description: 'Draw and create your world',
    screen: 'CreativeStudio',
    category: 'FOCUS',
    available: true,
  },
  {
    emoji: '✏️',
    title: 'Sketch It',
    description: 'Draw freely and let your mind unwind',
    screen: 'SketchIt',
    category: 'CREATE',
    available: true,
  },
  {
    emoji: '🧱',
    title: 'Brick Breaker',
    description: 'Break through mental clutter',
    screen: 'BrickBreaker',
    category: 'CLARITY',
    available: true,
  },
];

const COMING_SOON: Game[] = [
  {
    emoji: '🧘',
    title: 'Clear My Mind',
    description: 'Tap away thoughts and find peace',
    screen: 'ClearMyMind',
    category: 'MINDFUL',
    available: false,
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  const renderGameCard = (game: Game) => {
    const handlePress = () => {
      if (game.available) {
        navigation.navigate(game.screen as never);
      }
    };

    return (
      <TouchableOpacity
        key={game.screen}
        onPress={handlePress}
        activeOpacity={game.available ? 0.7 : 1}
        style={[styles.card, !game.available && styles.cardDisabled]}>
        {/* Icon */}
        <View style={[styles.iconContainer, !game.available && styles.iconDisabled]}>
          <Text style={styles.emoji}>{game.emoji}</Text>
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{game.title}</Text>
          <Text style={styles.cardDescription}>{game.description}</Text>

          {/* Category Pill */}
          <View
            style={[
              styles.categoryPill,
              {backgroundColor: CATEGORY_COLORS[game.category]},
            ]}>
            <Text style={styles.categoryText}>{game.category}</Text>
          </View>
        </View>

        {/* Soon Badge */}
        {!game.available && (
          <View style={styles.soonBadge}>
            <Text style={styles.soonText}>SOON</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Greeting Section */}
        <View style={styles.greeting}>
          <View style={styles.greetingContent}>
            <HoneydewMascot size={40} />
            <Text style={styles.greetingText}>
              Hey! Even a few moments can shift your whole mood.
            </Text>
          </View>
        </View>

        {/* Core Activities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>CORE ACTIVITIES</Text>
          <View style={styles.grid}>
            {CORE_ACTIVITIES.map(game => renderGameCard(game))}
          </View>
        </View>

        {/* Secondary Activities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>EXPLORE & PLAY</Text>
          <View style={styles.grid}>
            {SECONDARY_ACTIVITIES.map(game => renderGameCard(game))}
          </View>
        </View>

        {/* Coming Soon Section */}
        {COMING_SOON.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>COMING SOON</Text>
            <View style={styles.grid}>
              {COMING_SOON.map(game => renderGameCard(game))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  greeting: {
    marginBottom: 32,
  },
  greetingContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  greetingText: {
    flex: 1,
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.deepOcean,
    letterSpacing: -0.2,
    paddingTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.deepOcean,
    opacity: 0.5,
    letterSpacing: 1.5,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    height: 192,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.sageMist,
    padding: 16,
    paddingTop: 20,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.lavenderFog,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconDisabled: {
    opacity: 0.6,
  },
  emoji: {
    fontSize: 22,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.deepOcean,
    letterSpacing: -0.2,
    lineHeight: 20,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: COLORS.deepOcean,
    opacity: 0.6,
    lineHeight: 16,
    marginBottom: 12,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.deepOcean,
    letterSpacing: 0.5,
  },
  soonBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.sageMist,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    opacity: 0.7,
  },
  soonText: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.deepOcean,
  },
});
