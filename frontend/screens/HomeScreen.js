import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import { courseData } from '../../data/courseData';
import { db } from '../../database/config';
import { ThemeContext } from '../context/ThemeContext';
import { defaultAlerts } from './AlertScreen';

const quickActions = [
  { label: 'Quizzes', icon: 'school-outline', screen: 'QuizTopics', accent: ['#2563EB', '#60A5FA'] },
  { label: 'Courses', icon: 'book-outline', screen: 'Courses', accent: ['#F97316', '#FB923C'] },
  { label: 'Alerts', icon: 'warning-outline', screen: 'Alerts', accent: ['#EF4444', '#F87171'] },
];

function getWeatherInfo(code) {
  if (code === 0) return { label: 'Clear Sky', icon: 'sunny-outline', color: '#F59E0B' };
  if (code >= 1 && code <= 3) return { label: 'Partly Cloudy', icon: 'cloudy-night-outline', color: '#3B82F6' };
  if (code === 45 || code === 48) return { label: 'Foggy', icon: 'cloud-outline', color: '#64748B' };
  if (code >= 51 && code <= 57) return { label: 'Light Drizzle', icon: 'rainy-outline', color: '#0EA5E9' };
  if (code >= 61 && code <= 67) return { label: 'Heavy Rain', icon: 'thunderstorm-outline', color: '#0284C7' };
  if (code >= 71 && code <= 77) return { label: 'Snow', icon: 'snow-outline', color: '#38BDF8' };
  if (code >= 80 && code <= 82) return { label: 'Rain Showers', icon: 'rainy-outline', color: '#0284C7' };
  if (code >= 95) return { label: 'Thunderstorm', icon: 'thunderstorm-outline', color: '#DC2626' };
  return { label: 'Moderate Weather', icon: 'cloud-outline', color: '#3B82F6' };
}

export default function HomeScreen({ navigation }) {
  const [activeAlertsCount, setActiveAlertsCount] = useState(defaultAlerts.length);
  const [quizzesCompleted, setQuizzesCompleted] = useState(0);
  const [coursesCompleted, setCoursesCompleted] = useState(0);
  const [preparednessPercent, setPreparednessPercent] = useState(0);
  const [villageName, setVillageName] = useState('Detecting location...');
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const computePreparedness = () => {
    try {
      let completedLessonsOverall = 0;
      let totalLessonsOverall = 0;
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedCourses = window.localStorage.getItem('disaster_app_course_progress');
        const courseMap = savedCourses ? JSON.parse(savedCourses) : {};

        Object.keys(courseData).forEach((key) => {
          const lessons = Array.isArray(courseData[key]?.lessons) ? courseData[key].lessons.length : 0;
          totalLessonsOverall += lessons;
          const completed = (courseMap[key]?.completedLessons || []).length || 0;
          completedLessonsOverall += completed;
        });
      }

      const coursePercent = totalLessonsOverall > 0 ? Math.round((completedLessonsOverall / totalLessonsOverall) * 100) : 0;

      let quizPercent = 0;
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedQuizzes = window.localStorage.getItem('disaster_app_quiz_progress');
        if (savedQuizzes) {
          const quizMap = JSON.parse(savedQuizzes);
          const scores = Object.values(quizMap)
            .map((q) => (q && typeof q.bestScore === 'number' ? q.bestScore : null))
            .filter((s) => typeof s === 'number');
          if (scores.length > 0) {
            quizPercent = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
          }
        }
      }

      const hasProgress = coursePercent > 0 || quizPercent > 0;
      const preparedness = hasProgress ? Math.round((coursePercent + quizPercent) / 2) : 0;
      setPreparednessPercent(preparedness);
    } catch (e) {
      setPreparednessPercent(0);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadQuizStats = () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const saved = window.localStorage.getItem('disaster_app_quiz_progress');
          if (saved) {
            const map = JSON.parse(saved);
            const attemptedCount = Object.values(map).filter((q) => q?.attempted).length;
            setQuizzesCompleted(attemptedCount);
          } else {
            setQuizzesCompleted(0);
          }
        }
      } catch (e) {
        setQuizzesCompleted(0);
      }
    };

    const loadCourseStats = () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const saved = window.localStorage.getItem('disaster_app_course_progress');
          if (saved) {
            const map = JSON.parse(saved);
            const completedCount = Object.values(map).filter(
              (course) => course && Array.isArray(course.completedLessons) && course.completedLessons.length > 0
            ).length;
            setCoursesCompleted(completedCount);
          } else {
            setCoursesCompleted(0);
          }
        }
      } catch (e) {
        setCoursesCompleted(0);
      }
    };

    const loadAlerts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'alerts'));
        setActiveAlertsCount(querySnapshot.size);
      } catch (error) {
        setActiveAlertsCount(0);
      }
    };

    const fetchLocationAndWeather = async () => {
      try {
        let lat = 13.0281;
        let lon = 80.0158;
        let locationLabel = 'Local Area';

        if (typeof navigator !== 'undefined' && navigator.geolocation) {
          await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                lat = pos.coords.latitude;
                lon = pos.coords.longitude;
                resolve();
              },
              async () => {
                try {
                  const { status } = await Location.requestForegroundPermissionsAsync();
                  if (status === 'granted') {
                    const loc = await Location.getCurrentPositionAsync({});
                    lat = loc.coords.latitude;
                    lon = loc.coords.longitude;
                  }
                } catch (e) {}
                resolve();
              },
              { timeout: 5000 }
            );
          });
        }

        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const geoData = await geoRes.json();
          if (geoData && geoData.address) {
            const a = geoData.address;
            const village = a.suburb || a.village || a.town || a.neighbourhood || a.city_district || a.county || a.city || 'Thandalam';
            const city = a.city || a.state_district || a.state || '';
            locationLabel = city && city !== village ? `${village}, ${city}` : village;
          }
        } catch (e) {}

        if (isMounted) setVillageName(locationLabel);

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m`
        );
        const data = await res.json();

        if (isMounted && data && data.current_weather) {
          const cw = data.current_weather;
          const info = getWeatherInfo(cw.weathercode);
          const humidity = data.hourly?.relative_humidity_2m?.[0] || 65;

          setWeatherData({
            temp: Math.round(cw.temperature),
            windSpeed: Math.round(cw.windspeed),
            condition: info.label,
            icon: info.icon,
            color: info.color,
            humidity: humidity,
          });
        }
      } catch (e) {
        if (isMounted) {
          setWeatherData({
            temp: 28,
            windSpeed: 14,
            condition: 'Clear Sky',
            icon: 'sunny-outline',
            color: '#F59E0B',
            humidity: 60,
          });
        }
      } finally {
        if (isMounted) setLoadingWeather(false);
      }
    };

    loadQuizStats();
    loadCourseStats();
    computePreparedness();
    loadAlerts();
    fetchLocationAndWeather();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    computePreparedness();
  }, [quizzesCompleted, coursesCompleted]);

  const stats = [
    {
      label: 'Preparedness Score',
      value: `${preparednessPercent}%`,
      note: preparednessPercent === 0 ? 'Complete courses & quizzes' : 'Keep going!',
    },
    { label: 'Courses Completed', value: `${coursesCompleted}`, note: 'Keep learning!' },
    { label: 'Active Alerts', value: `${activeAlertsCount}`, note: 'Stay updated!' },
    { label: 'Quizzes Completed', value: `${quizzesCompleted}`, note: 'Great job!' },
  ];

  const theme = useColorScheme();
  const isDarkSystem = theme === 'dark';
  const themeCtx = useContext(ThemeContext);
  const isDark = themeCtx?.dark ?? isDarkSystem;

  const colors = isDark
    ? {
        bg: '#061225',
        panel: '#0B1220',
        card: '#071426',
        cardBorder: '#1E293B',
        text: '#E6EEF8',
        secondaryText: '#94A3B8',
      }
    : {
        bg: '#F8FAFC',
        panel: '#FFFFFF',
        card: '#FFFFFF',
        cardBorder: '#E2E8F0',
        text: '#0F172A',
        secondaryText: '#64748B',
      };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Hero Banner */}
      <View style={styles.heroWrapper}>
        <View style={styles.heroCard}>
          <Image
            source={require('../../assets/images/Disaster.png')}
            style={styles.heroBackground}
            resizeMode="cover"
          />
          <LinearGradient
            colors={[
              'rgba(2, 10, 25, 0.75)',
              'rgba(2, 10, 25, 0.45)',
              'rgba(2, 10, 25, 0.12)',
              'rgba(2, 10, 25, 0.05)',
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.heroOverlay}
          >
            <View style={styles.heroLeftContent}>
              <Text style={styles.heroTitle}>Be Prepared.{'\n'}Stay Protected.</Text>
              <Text style={styles.heroSubtitle}>
                Learn. Prepare. Respond.{'\n'}Stay ready for any disaster.
              </Text>

              <View style={styles.heroButtonRow}>
                <TouchableOpacity
                  style={styles.exploreButton}
                  onPress={() => navigation.navigate('Courses')}
                  activeOpacity={0.85}
                >
                  <Ionicons name="book-outline" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.exploreButtonText}>Explore Courses</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.alertsButton}
                  onPress={() => navigation.navigate('Alerts')}
                  activeOpacity={0.85}
                >
                  <Ionicons name="warning-outline" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.alertsButtonText}>View Live Alerts</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Live Weather & Detected Location Card */}
        <TouchableOpacity
          style={[styles.weatherBanner, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={() => navigation.navigate('Alerts')}
          activeOpacity={0.85}
        >
          <View style={styles.weatherBannerHeader}>
            <Ionicons name="navigate-circle" size={22} color="#2563EB" style={{ marginRight: 6 }} />
            <Text style={[styles.weatherLocationText, { color: colors.text }]}>Detected Location: {villageName}</Text>
          </View>

          {loadingWeather ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : weatherData ? (
            <View style={styles.weatherRow}>
              <View style={styles.weatherTempWrap}>
                <Text style={[styles.weatherTempText, { color: colors.text }]}>{weatherData.temp}°C</Text>
                <Text style={[styles.weatherCondText, { color: weatherData.color }]}>{weatherData.condition}</Text>
              </View>
              <Ionicons name={weatherData.icon} size={32} color={weatherData.color} />
              <View style={styles.weatherMetricsRow}>
                <Text style={[styles.weatherMetricTag, { color: colors.secondaryText }]}>💨 {weatherData.windSpeed} km/h</Text>
                <Text style={[styles.weatherMetricTag, { color: colors.secondaryText }]}>💧 {weatherData.humidity}%</Text>
              </View>
            </View>
          ) : null}
        </TouchableOpacity>

        {/* Quick Stats Grid */}
        <View style={styles.quickStatsRow}>
          {stats.map((item) => (
            <View key={item.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{item.value}</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>{item.label}</Text>
              <Text style={[styles.statNote, { color: colors.secondaryText }]}>{item.note}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Main Grid Sections */}
      <View style={[styles.sectionGrid, { backgroundColor: colors.bg }]}>
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick actions</Text>
          <View style={styles.actionsContainer}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.label}
                activeOpacity={0.9}
                onPress={() => navigation.navigate(action.screen)}
              >
                <LinearGradient colors={action.accent} style={styles.actionButton}>
                  <View style={styles.actionIconWrap}>
                    <Ionicons name={action.icon} size={18} color="#FFFFFF" />
                  </View>
                  <Text style={styles.actionText}>{action.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.assistantCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.assistantHeader}>
            <View style={styles.assistantBadge}>
              <Text style={styles.assistantBadgeText}>AI</Text>
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Assistant</Text>
          </View>
          <Text style={[styles.assistantCopy, { color: colors.secondaryText }]}>
            Ask the preparedness assistant for evacuation tips, disaster checklists, or location-based safety guidance.
          </Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('AI Chat')}>
            <Text style={styles.secondaryButtonText}>Open AI assistant</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  heroWrapper: {
    marginBottom: 16,
  },
  heroCard: {
    position: 'relative',
    width: '100%',
    minHeight: 310,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#020A19',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  heroBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    flex: 1,
    padding: 28,
    justifyContent: 'center',
    minHeight: 310,
  },
  heroLeftContent: {
    maxWidth: 480,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 38,
    marginBottom: 10,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.92)',
    lineHeight: 22,
    marginBottom: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#2563EB',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  alertsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  alertsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonIcon: {
    marginRight: 8,
  },
  weatherBanner: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  weatherBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherLocationText: {
    fontSize: 14,
    fontWeight: '800',
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weatherTempWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  weatherTempText: {
    fontSize: 24,
    fontWeight: '900',
  },
  weatherCondText: {
    fontSize: 13,
    fontWeight: '800',
  },
  weatherMetricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  weatherMetricTag: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  statNote: {
    fontSize: 11,
    marginTop: 2,
  },
  sectionGrid: {
    gap: 14,
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    minWidth: 100,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconWrap: {
    marginRight: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  assistantCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  assistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  assistantBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  assistantBadgeText: {
    color: '#2563EB',
    fontWeight: '800',
  },
  assistantCopy: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  secondaryButton: {
    backgroundColor: '#E0F2FE',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1D4ED8',
    fontWeight: '800',
    fontSize: 14,
  },
});