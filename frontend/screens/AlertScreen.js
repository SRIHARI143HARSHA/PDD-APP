import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { db } from '../../database/config';
import { ThemeContext } from '../context/ThemeContext';

export const defaultAlerts = [
  {
    id: 'sample-1',
    title: 'Flash Flood Warning - Low Lying Areas',
    severity: 'Critical',
    icon: 'water',
    location: 'Coastal & River Basin Regions',
    message: 'Rapidly rising water levels reported due to persistent heavy rainfall. Move to elevated high ground immediately.',
    timestamp: 'Active Now • Official Advisory',
  },
  {
    id: 'sample-2',
    title: 'High Seismic Activity Watch',
    severity: 'Warning',
    icon: 'pulse',
    location: 'Tectonic Fault Zone',
    message: 'Minor foreshocks recorded in subterranean plates. Secure heavy furniture and review Drop, Cover, and Hold On procedures.',
    timestamp: 'Updated 20 mins ago',
  },
  {
    id: 'sample-3',
    title: 'Severe Coastal Wind Advisory',
    severity: 'Advisory',
    icon: 'thunderstorm',
    location: 'Coastal Maritime Belt',
    message: 'Sustained winds exceeding 45 mph forecasted. Secure outdoor property, loose items, and garden structures.',
    timestamp: 'Issued Today',
  },
];

// Helper to decode Open-Meteo Weather Codes
function getWeatherInfo(code) {
  if (code === 0) return { label: 'Clear Sky', icon: 'sunny-outline', color: '#F59E0B' };
  if (code >= 1 && code <= 3) return { label: 'Partly Cloudy', icon: 'cloudy-night-outline', color: '#3B82F6' };
  if (code === 45 || code === 48) return { label: 'Foggy', icon: 'cloud-outline', color: '#64748B' };
  if (code >= 51 && code <= 57) return { label: 'Light Drizzle', icon: 'rainy-outline', color: '#0EA5E9' };
  if (code >= 61 && code <= 67) return { label: 'Heavy Rain / Downpour', icon: 'thunderstorm-outline', color: '#0284C7', isSevere: true };
  if (code >= 71 && code <= 77) return { label: 'Snow / Freezing Rain', icon: 'snow-outline', color: '#38BDF8', isSevere: true };
  if (code >= 80 && code <= 82) return { label: 'Severe Rain Showers', icon: 'rainy-outline', color: '#0284C7', isSevere: true };
  if (code >= 95) return { label: 'Severe Thunderstorm', icon: 'thunderstorm-outline', color: '#DC2626', isSevere: true };
  return { label: 'Moderate Weather', icon: 'cloud-outline', color: '#3B82F6' };
}

export default function AlertScreen({ searchQuery = '' }) {
  const theme = useContext(ThemeContext);
  const isDark = theme?.dark ?? false;

  const [alerts, setAlerts] = useState([]);
  const [villageName, setVillageName] = useState('Detecting real location...');
  const [coords, setCoords] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleAlerts = normalizedQuery
    ? alerts.filter((alert) => {
        const haystack = `${alert.title} ${alert.message} ${alert.severity} ${alert.location}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : alerts;

  useEffect(() => {
    let isMounted = true;

    const fetchLocationAndWeather = async () => {
      try {
        let currentLat = 13.0281;
        let currentLon = 80.0158;
        let detectedVillage = 'Local Area';

        // 1. Try Browser / Device Geolocation
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
          await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                currentLat = pos.coords.latitude;
                currentLon = pos.coords.longitude;
                resolve();
              },
              async () => {
                try {
                  const { status } = await Location.requestForegroundPermissionsAsync();
                  if (status === 'granted') {
                    const loc = await Location.getCurrentPositionAsync({});
                    currentLat = loc.coords.latitude;
                    currentLon = loc.coords.longitude;
                  }
                } catch (e) {}
                resolve();
              },
              { timeout: 5000 }
            );
          });
        }

        if (isMounted) {
          setCoords({ lat: currentLat, lon: currentLon });
        }

        // 2. Fetch Real Village/Town Name using OpenStreetMap Nominatim API
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentLat}&lon=${currentLon}`
          );
          const geoData = await geoRes.json();
          if (geoData && geoData.address) {
            const a = geoData.address;
            const village = a.village || a.suburb || a.town || a.neighbourhood || a.city_district || a.county || a.city || 'Local Area';
            const city = a.city || a.state_district || a.state || '';
            detectedVillage = city && city !== village ? `${village}, ${city}` : village;
          }
        } catch (e) {
          try {
            const address = await Location.reverseGeocodeAsync({
              latitude: currentLat,
              longitude: currentLon,
            });
            if (address.length > 0) {
              const addr = address[0];
              const village = addr.village || addr.subregion || addr.name || addr.district || addr.city || 'Local Area';
              const region = addr.city || addr.region || '';
              detectedVillage = region && region !== village ? `${village}, ${region}` : village;
            }
          } catch (err) {}
        }

        if (isMounted) {
          setVillageName(detectedVillage);
        }

        // 3. Fetch Live Real Weather from Open-Meteo
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${currentLat}&longitude=${currentLon}&current_weather=true&hourly=relative_humidity_2m,surface_pressure,precipitation`
        );
        const data = await res.json();

        if (isMounted && data && data.current_weather) {
          const cw = data.current_weather;
          const weatherInfo = getWeatherInfo(cw.weathercode);
          const humidity = data.hourly?.relative_humidity_2m?.[0] || 65;
          const pressure = Math.round(data.hourly?.surface_pressure?.[0] || 1012);
          const precip = data.hourly?.precipitation?.[0] || 0.0;
          const isRealSevereIssue = weatherInfo.isSevere || cw.windspeed > 40 || precip > 10.0;

          setWeatherData({
            temp: Math.round(cw.temperature),
            windSpeed: Math.round(cw.windspeed),
            condition: weatherInfo.label,
            icon: weatherInfo.icon,
            color: weatherInfo.color,
            isSevere: isRealSevereIssue,
            humidity: humidity,
            pressure: pressure,
            precipitation: precip,
          });

          // 4. Handle Alerts:
          // IF there is a REAL severe hazard (heavy storm, high winds > 40km/h, or extreme rain > 10mm), mark active alert!
          // IF weather is normal/calm, keep alerts INACTIVE / ALL CLEAR unless an explicit live Firestore broadcast exists!
          if (isRealSevereIssue) {
            setAlerts([
              {
                id: 'weather-severe-active',
                title: `Active Severe Hazard - ${weatherInfo.label}`,
                severity: cw.windspeed > 50 ? 'Critical' : 'Warning',
                icon: 'warning',
                location: detectedVillage,
                message: `Real-time hazard warning for ${detectedVillage}: ${weatherInfo.label} with winds of ${Math.round(cw.windspeed)} km/h and precipitation of ${precip} mm. Take emergency shelter immediately.`,
                timestamp: 'Active Now • Real Time Alert',
              },
            ]);
          } else {
            // Check Firestore for custom real alerts only
            try {
              const querySnapshot = await getDocs(collection(db, 'alerts'));
              const realDocs = [];
              querySnapshot.forEach((doc) => {
                const item = doc.data();
                if (item && item.isRealHazard === true) {
                  realDocs.push({ id: doc.id, ...item });
                }
              });
              setAlerts(realDocs); // Empty array if no real hazards present
            } catch (err) {
              setAlerts([]);
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setWeatherData({
            temp: 28,
            windSpeed: 12,
            condition: 'Partly Cloudy',
            icon: 'cloudy-night-outline',
            color: '#3B82F6',
            isSevere: false,
            humidity: 75,
            pressure: 1008,
            precipitation: 0.0,
          });
          setAlerts([]);
        }
      } finally {
        if (isMounted) setLoadingWeather(false);
      }
    };

    fetchLocationAndWeather();

    return () => {
      isMounted = false;
    };
  }, []);

  const getSeverityStyle = (severity = 'Advisory') => {
    const sev = severity.toLowerCase();
    if (sev.includes('critical') || sev.includes('danger') || sev.includes('high')) {
      return {
        bg: isDark ? '#3B1212' : '#FEF2F2',
        border: '#EF4444',
        text: '#DC2626',
        badgeBg: '#EF4444',
        badgeText: '#FFFFFF',
      };
    }
    if (sev.includes('warning') || sev.includes('moderate')) {
      return {
        bg: isDark ? '#361D0B' : '#FFF7ED',
        border: '#F97316',
        text: '#D97706',
        badgeBg: '#F97316',
        badgeText: '#FFFFFF',
      };
    }
    return {
      bg: isDark ? '#0B1C33' : '#EFF6FF',
      border: '#2563EB',
      text: '#2563EB',
      badgeBg: '#2563EB',
      badgeText: '#FFFFFF',
    };
  };

  const colors = isDark
    ? {
        bg: '#061225',
        card: '#071426',
        border: '#1E293B',
        text: '#E6EEF8',
        subtext: '#94A3B8',
        allClearBg: '#064E3B',
        allClearBorder: '#059669',
        reportBoxBg: '#0B182B',
      }
    : {
        bg: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        text: '#0F172A',
        subtext: '#64748B',
        allClearBg: '#ECFDF5',
        allClearBorder: '#10B981',
        reportBoxBg: '#F8FAFC',
      };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.mainWrapper}>
        {/* Header Hero Banner */}
        <LinearGradient colors={['#DC2626', '#EA580C']} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIconWrap}>
              <Ionicons name="warning-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Emergency Hazards & Weather</Text>
              <Text style={styles.heroSubtitle}>Live local weather reports and emergency hazard alerts based on your real location.</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Real Location & Live Weather Report Card */}
        <View style={[styles.weatherCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.weatherCardHeader}>
            <View style={styles.locationHeaderRow}>
              <Ionicons name="navigate-circle-outline" size={24} color="#2563EB" style={{ marginRight: 8 }} />
              <View>
                <Text style={[styles.locationEyebrow, { color: colors.subtext }]}>DETECTED LOCATION</Text>
                <Text style={[styles.locationTitle, { color: colors.text }]}>{villageName}</Text>
                {coords && (
                  <Text style={[styles.coordsText, { color: colors.subtext }]}>
                    GPS: {coords.lat.toFixed(4)}° N, {coords.lon.toFixed(4)}° E
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.liveTag}>
              <View style={styles.liveDot} />
              <Text style={styles.liveTagText}>LIVE REPORT</Text>
            </View>
          </View>

          {loadingWeather ? (
            <View style={styles.weatherLoadingBox}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={[styles.weatherLoadingText, { color: colors.subtext }]}>Fetching local weather report for {villageName}...</Text>
            </View>
          ) : weatherData ? (
            <View style={styles.weatherBodyWrap}>
              <View style={styles.weatherBodyTop}>
                <View style={styles.tempCol}>
                  <Text style={[styles.tempVal, { color: colors.text }]}>{weatherData.temp}°C</Text>
                  <Text style={[styles.conditionText, { color: weatherData.color }]}>{weatherData.condition}</Text>
                </View>

                <View style={styles.weatherIconWrap}>
                  <Ionicons name={weatherData.icon} size={52} color={weatherData.color} />
                </View>
              </View>

              {/* Comprehensive Live Weather Report Grid */}
              <View style={styles.weatherReportGrid}>
                <View style={[styles.reportMetricBox, { backgroundColor: colors.reportBoxBg, borderColor: colors.border }]}>
                  <Ionicons name="navigate-outline" size={16} color="#2563EB" style={{ marginBottom: 4 }} />
                  <Text style={[styles.reportMetricVal, { color: colors.text }]}>{weatherData.windSpeed} km/h</Text>
                  <Text style={[styles.reportMetricLabel, { color: colors.subtext }]}>Wind Speed</Text>
                </View>

                <View style={[styles.reportMetricBox, { backgroundColor: colors.reportBoxBg, borderColor: colors.border }]}>
                  <Ionicons name="water-outline" size={16} color="#0EA5E9" style={{ marginBottom: 4 }} />
                  <Text style={[styles.reportMetricVal, { color: colors.text }]}>{weatherData.humidity}%</Text>
                  <Text style={[styles.reportMetricLabel, { color: colors.subtext }]}>Humidity</Text>
                </View>

                <View style={[styles.reportMetricBox, { backgroundColor: colors.reportBoxBg, borderColor: colors.border }]}>
                  <Ionicons name="speedometer-outline" size={16} color="#10B981" style={{ marginBottom: 4 }} />
                  <Text style={[styles.reportMetricVal, { color: colors.text }]}>{weatherData.pressure} hPa</Text>
                  <Text style={[styles.reportMetricLabel, { color: colors.subtext }]}>Pressure</Text>
                </View>

                <View style={[styles.reportMetricBox, { backgroundColor: colors.reportBoxBg, borderColor: colors.border }]}>
                  <Ionicons name="rainy-outline" size={16} color="#7C3AED" style={{ marginBottom: 4 }} />
                  <Text style={[styles.reportMetricVal, { color: colors.text }]}>{weatherData.precipitation} mm</Text>
                  <Text style={[styles.reportMetricLabel, { color: colors.subtext }]}>Precipitation</Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>

        {/* Real Alert Cards OR All Clear Status Card */}
        {visibleAlerts.length === 0 ? (
          <View style={[styles.allClearCard, { backgroundColor: colors.allClearBg, borderColor: colors.allClearBorder }]}>
            <View style={styles.allClearHeader}>
              <Ionicons name="checkmark-circle" size={34} color="#10B981" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.allClearTitle, { color: isDark ? '#A7F3D0' : '#065F46' }]}>
                  All Clear — No Active Hazards
                </Text>
                <Text style={[styles.allClearSub, { color: isDark ? '#D1FAE5' : '#047857' }]}>
                  Detected Location: <Text style={{ fontWeight: '800' }}>{villageName}</Text>. Weather conditions are calm ({weatherData?.condition || 'Normal'}) with no active emergency hazards.
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.alertsList}>
            <Text style={[styles.alertsSectionTitle, { color: colors.text }]}>
              Active Hazard Advisories ({visibleAlerts.length})
            </Text>

            {visibleAlerts.map((alert) => {
              const sevStyle = getSeverityStyle(alert.severity);
              return (
                <View
                  key={alert.id}
                  style={[
                    styles.card,
                    { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: sevStyle.border },
                  ]}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.titleWrap}>
                      <Ionicons name={alert.icon || 'warning'} size={20} color={sevStyle.text} style={{ marginRight: 8 }} />
                      <Text style={[styles.alertTitle, { color: colors.text }]}>{alert.title}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: sevStyle.badgeBg }]}>
                      <Text style={styles.badgeText}>{alert.severity || 'Advisory'}</Text>
                    </View>
                  </View>

                  <Text style={[styles.alertMessage, { color: colors.text }]}>{alert.message}</Text>

                  <View style={styles.cardFooter}>
                    <View style={styles.metaItem}>
                      <Ionicons name="location-outline" size={14} color={colors.subtext} style={{ marginRight: 4 }} />
                      <Text style={[styles.metaText, { color: colors.subtext }]}>{alert.location || villageName}</Text>
                    </View>

                    <Text style={[styles.timestampText, { color: colors.subtext }]}>{alert.timestamp || 'Active Alert'}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
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
  mainWrapper: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
  },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  weatherCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  weatherCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  locationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationEyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  coordsText: {
    fontSize: 11,
    marginTop: 1,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  liveTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  weatherLoadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  weatherLoadingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  weatherBodyWrap: {
    gap: 16,
  },
  weatherBodyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tempCol: {
    flex: 1,
  },
  tempVal: {
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 44,
  },
  conditionText: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  weatherIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  weatherReportGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  reportMetricBox: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  reportMetricVal: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 2,
  },
  reportMetricLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  allClearCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 18,
    marginBottom: 16,
  },
  allClearHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allClearTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  allClearSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  alertsList: {
    gap: 12,
  },
  alertsSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderLeftWidth: 6,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  alertMessage: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
    paddingTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timestampText: {
    fontSize: 12,
    fontWeight: '600',
  },
});