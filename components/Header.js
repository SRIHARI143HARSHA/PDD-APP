import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { Platform, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeContext } from '../frontend/context/ThemeContext';

const pageTitles = {
  Home: 'Dashboard',
  Courses: 'Courses',
  QuizTopics: 'Quizzes',
  Alerts: 'Alerts',
  Map: 'Live Map',
  'AI Chat': 'AI Assistant',
  Leaderboard: 'Leaderboard',
  Profile: 'Profile',
};

export default function Header({ onMenuPress, onProfilePress, activeScreen = 'Home', onBackPress }) {
  const theme = useContext(ThemeContext);
  const isDark = theme?.dark ?? false;
  const insets = useSafeAreaInsets();

  const statusBarPadding = Platform.OS === 'android'
    ? (StatusBar.currentHeight || 28)
    : insets.top;

  const title = pageTitles[activeScreen] || 'Dashboard';
  const showBack = activeScreen !== 'Home';

  const colors = isDark
    ? {
        topBarBg: '#071425',
        topBarBorder: '#0B1220',
        searchBg: '#0B1220',
        icon: '#E2E8F0',
        avatarBg: '#0B1220',
        backBg: '#0F1C2E',
      }
    : {
        topBarBg: '#FFFFFF',
        topBarBorder: '#E6EEF8',
        searchBg: '#F1F5F9',
        icon: '#0F172A',
        avatarBg: '#E0F2FE',
        backBg: '#F1F5F9',
      };

  return (
    <View
      style={[
        styles.topBar,
        {
          backgroundColor: colors.topBarBg,
          borderBottomColor: colors.topBarBorder,
          paddingTop: statusBarPadding,
          height: 64 + statusBarPadding,
        },
      ]}
    >
      <View style={styles.leftRow}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress}
          accessibilityLabel="menu-button"
          testID="menu-button"
        >
          <Ionicons name="menu" size={24} color={colors.icon} />
        </TouchableOpacity>

        {showBack && (
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.backBg }]}
            onPress={onBackPress}
            activeOpacity={0.8}
            accessibilityLabel="back-button"
            testID="back-button"
          >
            <Ionicons name="arrow-back" size={18} color={colors.icon} style={{ marginRight: 4 }} />
            <Text style={[styles.backText, { color: colors.icon }]}>Back</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.pageTitle, { color: colors.icon }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightRow}>
        <View style={styles.themeToggleRow}>
          <Text style={[styles.themeLabel, { color: colors.icon }]}>{isDark ? 'Dark' : 'Light'}</Text>
          <Switch value={isDark} onValueChange={() => theme.toggle()} />
        </View>

        <TouchableOpacity
          style={[styles.avatarWrap, { backgroundColor: colors.avatarBg }]}
          onPress={onProfilePress}
          accessibilityLabel="profile-avatar-button"
          testID="profile-avatar-button"
        >
          <Text style={styles.avatarText}>R</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 8,
    marginRight: 6,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '800',
    flexShrink: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  themeLabel: {
    marginRight: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#0B1F3A',
    fontWeight: '800',
  },
});
