import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import {
    Image,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

import Header from '../../components/Header';
import AlertScreen from '../screens/AlertScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import CourseScreen from '../screens/CourseScreen';
import HomeScreen from '../screens/HomeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import QuizTopicsScreen from '../screens/QuizTopicsScreen';

const SIDEBAR_WIDTH = 340;

const menuItems = [
  { name: 'Home', label: 'Dashboard', icon: 'home' },
  { name: 'Courses', label: 'Courses', icon: 'book' },
  { name: 'QuizTopics', label: 'Quizzes', icon: 'school' },
  { name: 'Alerts', label: 'Alerts', icon: 'warning' },
  { name: 'Map', label: 'Live Map', icon: 'map' },
  { name: 'AI Chat', label: 'AI Assistant', icon: 'chatbubble-ellipses' },
  { name: 'Leaderboard', label: 'Leaderboard', icon: 'trophy' },
  { name: 'Profile', label: 'Profile', icon: 'person' },
];

export default function BottomTabs({ navigation }) {
  const [active, setActive] = useState('Home');
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useContext(ThemeContext);

  const darkValue = theme?.dark ?? false;

  const shellNavigation = {
    navigate: (screen, params) => {
      if (['Home', 'Courses', 'QuizTopics', 'Alerts', 'Map', 'AI Chat', 'Leaderboard', 'Profile'].includes(screen)) {
        setActive(screen);
      } else {
        navigation.navigate(screen, params);
      }
    },
    push: (screen, params) => {
      if (['Home', 'Courses', 'QuizTopics', 'Alerts', 'Map', 'AI Chat', 'Leaderboard', 'Profile'].includes(screen)) {
        setActive(screen);
      } else {
        navigation.push(screen, params);
      }
    },
    goBack: () => navigation.goBack(),
  };

  const go = (name) => {
    setActive(name);
    setMenuVisible(false);
  };

  const handleProfilePress = () => {
    go('Profile');
  };

  const renderScreen = () => {
    switch (active) {
      case 'Courses':
        return <CourseScreen navigation={shellNavigation} searchQuery={searchQuery} />;
      case 'Alerts':
        return <AlertScreen navigation={shellNavigation} searchQuery={searchQuery} />;
      case 'Leaderboard':
        return <LeaderboardScreen navigation={shellNavigation} searchQuery={searchQuery} />;
      case 'AI Chat':
        return <ChatbotScreen navigation={shellNavigation} searchQuery={searchQuery} />;
      case 'Profile':
        return <ProfileScreen navigation={shellNavigation} realNavigation={navigation} searchQuery={searchQuery} />;
      case 'Map':
        return <MapScreen navigation={shellNavigation} searchQuery={searchQuery} />;
      case 'QuizTopics':
        return <QuizTopicsScreen navigation={shellNavigation} searchQuery={searchQuery} />;
      default:
        return <HomeScreen navigation={shellNavigation} searchQuery={searchQuery} />;
    }
  };

  const colors = darkValue
    ? {
        appBg: '#071425',
        sidebarBg: '#081325',
        topBarBg: '#071425',
        topBarBorder: '#0B1220',
        searchBg: '#0B1220',
        contentBg: '#04111A',
        menuLabel: '#94A3B8',
        menuLabelActive: '#FFFFFF',
        tabText: '#94A3B8',
        cardBg: '#0F1C2E',
        cardBorder: '#1E293B',
      }
    : {
        appBg: '#F8FAFC',
        sidebarBg: '#FFFFFF',
        topBarBg: '#FFFFFF',
        topBarBorder: '#E6EEF8',
        searchBg: '#F1F5F9',
        contentBg: '#F8FAFC',
        menuLabel: '#64748B',
        menuLabelActive: '#0F172A',
        tabText: '#64748B',
        cardBg: '#F8FAFC',
        cardBorder: '#E2E8F0',
      };

  const topPaddingDrawer = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 16 : 24;

  return (
    <View style={[styles.appShell, { backgroundColor: colors.appBg }]}>
      <View style={styles.mainArea}>
        <Header
          onMenuPress={() => setMenuVisible(true)}
          onProfilePress={handleProfilePress}
          activeScreen={active}
          onBackPress={() => go('Home')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <View style={[styles.contentArea, { backgroundColor: colors.contentBg }]}>
          {renderScreen()}
        </View>
      </View>

      {/* Quick Access Drawer Panel Modal */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)}>
          <Pressable style={[styles.menuSheet, { backgroundColor: colors.sidebarBg, paddingTop: topPaddingDrawer }]}>
            {/* Drawer Header */}
            <View style={styles.drawerHeaderRow}>
              <View style={styles.logoRow}>
                <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
                <View>
                  <Text style={[styles.logoTitle, { color: colors.menuLabelActive }]}>Disaster App</Text>
                  <Text style={[styles.logoSub, { color: colors.menuLabel }]}>Stay Prepared. Stay Safe</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: darkValue ? '#1E293B' : '#F1F5F9' }]}
                onPress={() => setMenuVisible(false)}
                activeOpacity={0.8}
                accessibilityLabel="Close Drawer"
              >
                <Ionicons name="close" size={20} color={colors.menuLabelActive} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionLabel, { color: colors.menuLabel }]}>QUICK ACCESS</Text>

            {/* 2-Column Quick Access Feature Card Grid */}
            <ScrollView style={styles.gridScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.gridContainer}>
                {menuItems.map((item) => {
                  const activeItem = active === item.name || (active === 'QuizTopics' && item.name === 'QuizTopics');
                  return (
                    <TouchableOpacity
                      key={`grid-${item.name}`}
                      style={[
                        styles.quickCard,
                        {
                          backgroundColor: activeItem ? '#2563EB' : colors.cardBg,
                          borderColor: activeItem ? '#2563EB' : colors.cardBorder,
                        },
                      ]}
                      onPress={() => go(item.name)}
                      activeOpacity={0.85}
                      accessibilityLabel={`quick-access-${item.name.toLowerCase()}`}
                      testID={`quick-access-${item.name.toLowerCase()}`}
                    >
                      <View style={styles.cardIconWrap}>
                        <Ionicons
                          name={item.icon}
                          size={24}
                          color={activeItem ? '#FFFFFF' : darkValue ? '#60A5FA' : '#2563EB'}
                        />
                      </View>
                      <Text
                        style={[
                          styles.cardLabel,
                          { color: activeItem ? '#FFFFFF' : colors.menuLabelActive },
                        ]}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Theme & Footer Section */}
            <View style={[styles.sidebarFooter, { borderTopColor: colors.cardBorder }]}>
              <Text style={[styles.appearanceTitle, { color: colors.menuLabel }]}>APPEARANCE</Text>
              <View style={styles.themeRow}>
                <View style={styles.themeLabelWrap}>
                  <Ionicons name={darkValue ? 'moon' : 'sunny'} size={18} color={darkValue ? '#60A5FA' : '#F59E0B'} style={{ marginRight: 8 }} />
                  <Text style={[styles.themeLabel, { color: colors.menuLabelActive }]}>Dark Mode</Text>
                </View>
                <Switch value={darkValue} onValueChange={() => theme.toggle()} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  appShell: { flex: 1, flexDirection: 'row', backgroundColor: '#F8FAFC' },

  mainArea: { flex: 1 },

  contentArea: { flex: 1, backgroundColor: '#F8FAFC' },

  overlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.45)' },
  menuSheet: {
    width: '85%',
    maxWidth: SIDEBAR_WIDTH,
    height: '100%',
    paddingHorizontal: 18,
    paddingBottom: 24,
    marginLeft: 0,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },

  drawerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 36, height: 36, borderRadius: 8, marginRight: 10 },
  logoTitle: { fontWeight: '800', fontSize: 16 },
  logoSub: { fontSize: 11 },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
    textTransform: 'uppercase',
  },

  gridScroll: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickCard: {
    width: '48%',
    height: 86,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardIconWrap: {
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  sidebarFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  appearanceTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
});