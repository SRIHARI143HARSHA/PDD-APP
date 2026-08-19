import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useState } from 'react';
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
import { getItem } from '../services/storageService';
import { generateWeatherAlerts } from '../utils/weatherAlertEngine';

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
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);
  const [quizzesCompleted, setQuizzesCompleted] = useState(0);
  const [coursesCompleted, setCoursesCompleted] = useState(0);
  const [preparednessPercent, setPreparednessPercent] = useState(0);
  const [villageName, setVillageName] = useState('Detecting location...');
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(null);

  const computePreparedness = useCallback(async () => {
    try {
      let completedLessonsOverall = 0;
      let totalLessonsOverall = 0;
      const savedCourses = await getItem('disaster_app_course_progress');
      const courseMap = savedCourses ? JSON.parse(savedCourses) : {};

      Object.keys(courseData).forEach((key) => {
        const lessons = Array.isArray(courseData[key]?.lessons) ? courseData[key].lessons.length : 0;
        totalLessonsOverall += lessons;
        const completed = (courseMap[key]?.completedLessons || []).length || 0;
        completedLessonsOverall += completed;
      });

      const coursePercent = totalLessonsOverall > 0 ? Math.round((completedLessonsOverall / totalLessonsOverall) * 100) : 0;

      let quizPercent = 0;
      const savedQuizzes = await getItem('disaster_app_quiz_progress');
      if (savedQuizzes) {
        const quizMap = JSON.parse(savedQuizzes);
        const scores = Object.values(quizMap)
          .map((q) => (q && typeof q.bestScore === 'number' ? q.bestScore : null))
          .filter((s) => typeof s === 'number');
        if (scores.length > 0) {
          quizPercent = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }
      }

      const hasProgress = coursePercent > 0 || quizPercent > 0;
      const preparedness = hasProgress ? Math.round((coursePercent + quizPercent) / 2) : 0;
      setPreparednessPercent(preparedness);
    } catch (e) {
      setPreparednessPercent(0);
    }
  }, []);

  const loadQuizStats = useCallback(async () => {
    try {
      const saved = await getItem('disaster_app_quiz_progress');
      if (saved) {
        const map = JSON.parse(saved);
        const attemptedCount = Object.values(map).filter((q) => q?.attempted || q?.completed).length;
        setQuizzesCompleted(attemptedCount);
      } else {
        setQuizzesCompleted(0);
      }
    } catch (e) {
      setQuizzesCompleted(0);
    }
  }, []);

  const loadCourseStats = useCallback(async () => {
    try {
      const saved = await getItem('disaster_app_course_progress');
      if (saved) {
        const map = JSON.parse(saved);
        const completedCount = Object.values(map).filter(
          (course) => course && Array.isArray(course.completedLessons) && course.completedLessons.length > 0
        ).length;
        setCoursesCompleted(completedCount);
      } else {
        setCoursesCompleted(0);
      }
    } catch (e) {
      setCoursesCompleted(0);
    }
  }, []);

  const loadAlerts = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'alerts'));
      let activeCount = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data && (data.status === 'active' || data.isActive === true || data.active === true)) {
          activeCount++;
        }
      });
      setActiveAlertsCount(activeCount);
    } catch (error) {
      setActiveAlertsCount(0);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadQuizStats();
      loadCourseStats();
      computePreparedness();
      loadAlerts();
    }, [loadQuizStats, loadCourseStats, computePreparedness, loadAlerts])
  );

  const fetchLocationAndWeather = async () => {
    setLoadingWeather(true);
    setWeatherError(false);
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
          let village = a.suburb || a.village || a.town || a.neighbourhood || a.city_district || a.county || a.city || 'Thandalam';
          const city = a.city || a.state_district || a.state || '';
          let rawLabel = city && city !== village ? `${village}, ${city}` : village;
          locationLabel = rawLabel;
        }
      } catch (e) {}

      setVillageName(locationLabel);

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m,precipitation`
      );
      const data = await res.json();

      if (data && data.current_weather) {
        const cw = data.current_weather;
        const info = getWeatherInfo(cw.weathercode);
        const currentHour = new Date().getHours();
        const humidity = data.hourly?.relative_humidity_2m?.[currentHour] || data.hourly?.relative_humidity_2m?.[0] || 65;
        const rainfall = data.hourly?.precipitation?.[currentHour] || data.hourly?.precipitation?.[0] || 0;
        const temp = Math.round(cw.temperature);
        const feelsLike = Math.round(temp + (humidity > 70 ? 2 : 0));

        setWeatherData({
          temp: temp,
          feelsLike: feelsLike,
          windSpeed: Math.round(cw.windspeed),
          condition: info.label,
          weathercode: cw.weathercode,
          icon: info.icon,
          color: info.color,
          humidity: humidity,
          rainfall: Math.round(rainfall * 10) / 10,
        });

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastUpdatedTime(timeStr);
      } else {
        setWeatherError(true);
      }
    } catch (e) {
      setWeatherError(true);
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchLocationAndWeather();
  }, []);

  useEffect(() => {
    computePreparedness();
  }, [quizzesCompleted, coursesCompleted, computePreparedness]);

  const activeWeatherAlerts = generateWeatherAlerts(weatherData);
  const totalActiveAlerts = activeAlertsCount + activeWeatherAlerts.length;

  const stats = [
    {
      label: 'Preparedness Score',
      value: `${preparednessPercent}%`,
      note: preparednessPercent === 0 ? 'Complete courses & quizzes' : 'Keep going!',
    },
    { label: 'Courses Completed', value: `${coursesCompleted}`, note: 'Keep learning!' },
    {
      label: 'Active Alerts',
      value: `${totalActiveAlerts}`,
      note: activeWeatherAlerts.length > 0 ? `${activeWeatherAlerts.length} Weather Alert${activeWeatherAlerts.length > 1 ? 's' : ''} Active` : 'Stay updated!',
    },
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

        {/* REAL-TIME DYNAMIC WEATHER ALERTS SECTION */}
        {loadingWeather ? null : activeWeatherAlerts.length > 0 ? (
          <View style={styles.activeAlertsContainer}>
            {activeWeatherAlerts.map((alert) => (
              <View
                key={alert.id}
                style={[
                  styles.dynamicAlertCard,
                  {
                    backgroundColor: isDark ? '#3B1212' : '#FEF2F2',
                    borderColor: alert.color || '#EF4444',
                  },
                ]}
              >
                <View style={styles.alertHeaderRow}>
                  <Text style={[styles.alertTitleText, { color: isDark ? '#FCA5A5' : '#991B1B' }]}>
                    {alert.title}
                  </Text>
                  <View style={[styles.activeStatusBadge, { backgroundColor: alert.color || '#EF4444' }]}>
                    <Text style={styles.activeBadgeText}>Status: Active</Text>
                  </View>
                </View>
                <Text style={[styles.alertBodyText, { color: isDark ? '#FEE2E2' : '#7F1D1D' }]}>
                  {alert.message}
                </Text>
                <View style={styles.alertFooterRow}>
                  <Text style={[styles.alertMetaText, { color: isDark ? '#FCA5A5' : '#991B1B' }]}>
                    📍 Location: <Text style={{ fontWeight: '800' }}>{villageName}</Text>
                  </Text>
                  {alert.value ? (
                    <Text style={[styles.alertMetaText, { color: isDark ? '#FCA5A5' : '#991B1B' }]}>
                      Level: <Text style={{ fontWeight: '800' }}>{alert.value}</Text>
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.noAlertsBanner, { backgroundColor: isDark ? '#064E3B' : '#ECFDF5', borderColor: '#10B981' }]}>
            <Ionicons name="checkmark-circle" size={22} color="#10B981" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.noAlertsTitle, { color: isDark ? '#A7F3D0' : '#065F46' }]}>
                ✓ NO ACTIVE WEATHER ALERTS
              </Text>
              <Text style={[styles.noAlertsSub, { color: isDark ? '#D1FAE5' : '#047857' }]}>
                Current weather conditions are normal.
              </Text>
            </View>
          </View>
        )}

        {/* SEPARATE CURRENT WEATHER CARD */}
        <View style={[styles.weatherBanner, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.weatherBannerHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="navigate-circle" size={20} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={[styles.weatherLocationText, { color: colors.text }]}>{villageName}</Text>
            </View>
            {lastUpdatedTime ? (
              <Text style={[styles.lastUpdatedText, { color: colors.secondaryText }]}>Updated: {lastUpdatedTime}</Text>
            ) : null}
          </View>

          {loadingWeather ? (
            <View style={{ paddingVertical: 14, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={{ fontSize: 12, color: colors.secondaryText, marginTop: 6 }}>Fetching live weather API...</Text>
            </View>
          ) : weatherError ? (
            <View style={{ paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, color: '#EF4444', fontWeight: '700' }}>Weather data unavailable</Text>
              {lastUpdatedTime ? (
                <Text style={{ fontSize: 11, color: colors.secondaryText, marginTop: 2 }}>Last successful update: {lastUpdatedTime}</Text>
              ) : null}
              <TouchableOpacity style={styles.retryBtn} onPress={fetchLocationAndWeather} activeOpacity={0.85}>
                <Ionicons name="refresh-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : weatherData ? (
            <View style={styles.weatherMainContent}>
              <View style={styles.weatherRowTop}>
                <View style={styles.weatherTempWrap}>
                  <Text style={[styles.weatherTempText, { color: colors.text }]}>{weatherData.temp}°C</Text>
                  <Text style={[styles.feelsLikeText, { color: colors.secondaryText }]}>
                    Feels like {weatherData.feelsLike}°C
                  </Text>
                  <Text style={[styles.weatherCondText, { color: weatherData.color }]}>
                    {weatherData.condition}
                  </Text>
                </View>
                <Ionicons name={weatherData.icon} size={48} color={weatherData.color} />
              </View>

              <View style={styles.weatherMetricsRow}>
                <Text style={[styles.weatherMetricTag, { color: colors.secondaryText }]}>💧 Humidity: {weatherData.humidity}%</Text>
                <Text style={[styles.weatherMetricTag, { color: colors.secondaryText }]}>💨 Wind: {weatherData.windSpeed} km/h</Text>
                <Text style={[styles.weatherMetricTag, { color: colors.secondaryText }]}>🌧️ Rain: {weatherData.rainfall} mm</Text>
              </View>
            </View>
          ) : null}
        </View>

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
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
                AI Emergency Assistant
              </Text>
              <Text style={{ fontSize: 12, color: colors.secondaryText }}>
                Ask any disaster or safety question
              </Text>
            </View>
          </View>
          <Text style={[styles.assistantCopy, { color: colors.secondaryText }]}>
            Get immediate safety advice, emergency protocols, and medical first-aid guidance.
          </Text>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('AI Chat')}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>Chat with AI Assistant</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 36,
  },
  heroWrapper: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  heroCard: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  heroBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heroLeftContent: {
    maxWidth: 480,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 14,
    lineHeight: 16,
  },
  heroButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  exploreButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  alertsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  alertsButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  buttonIcon: {
    marginRight: 6,
  },
  activeAlertsContainer: {
    marginBottom: 16,
    gap: 10,
  },
  dynamicAlertCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    shadowColor: '#EF4444',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  alertTitleText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  activeStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  alertBodyText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  alertFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertMetaText: {
    fontSize: 11,
  },
  noAlertsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  noAlertsTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  noAlertsSub: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  weatherBanner: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  weatherBannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherLocationText: {
    fontSize: 14,
    fontWeight: '800',
  },
  lastUpdatedText: {
    fontSize: 11,
  },
  weatherMainContent: {
    gap: 10,
  },
  weatherRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherTempWrap: {
    justifyContent: 'center',
  },
  weatherTempText: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  feelsLikeText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  weatherCondText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  weatherMetricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  weatherMetricTag: {
    fontSize: 12,
    fontWeight: '600',
  },
  retryBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quickStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  statNote: {
    fontSize: 10,
    marginTop: 4,
  },
  sectionGrid: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    gap: 16,
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
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