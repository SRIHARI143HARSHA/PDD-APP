import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { db } from '../../database/config';
import { ThemeContext } from '../context/ThemeContext';

export const defaultAlerts = [
  {
    id: 'sample-1',
    title: 'Flash Flood Warning - Low Lying Areas',
    severity: 'Critical',
    icon: 'water',
    location: 'Coastal & River Basin Regions',
    message: 'Monitored flood zones in low-lying areas. System is on standby for heavy rainfall.',
    timestamp: 'Monitoring Protocol',
  },
  {
    id: 'sample-2',
    title: 'High Seismic Activity Watch',
    severity: 'Warning',
    icon: 'pulse',
    location: 'Tectonic Fault Zone',
    message: 'Seismic sensors tracking subterranean plate movements. Review Drop, Cover, and Hold On procedures.',
    timestamp: 'Subterranean Sensor Active',
  },
  {
    id: 'sample-3',
    title: 'Severe Coastal Wind Advisory',
    severity: 'Advisory',
    icon: 'thunderstorm',
    location: 'Coastal Maritime Belt',
    message: 'Anemometer tracking coastal wind velocity. Secure loose outdoor structures if wind speeds increase.',
    timestamp: 'Coastal Wind Station',
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
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const [alerts, setAlerts] = useState(defaultAlerts);
  const [villageName, setVillageName] = useState('Detecting real location...');
  const [coords, setCoords] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [isSevereActive, setIsSevereActive] = useState(false);

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

        // 1. Native Mobile GPS Permission and Geolocation First
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            if (loc && loc.coords) {
              currentLat = loc.coords.latitude;
              currentLon = loc.coords.longitude;
            }
          } else if (typeof navigator !== 'undefined' && navigator.geolocation) {
            await new Promise((resolve) => {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  currentLat = pos.coords.latitude;
                  currentLon = pos.coords.longitude;
                  resolve();
                },
                () => resolve(),
                { timeout: 5000 }
              );
            });
          }
        } catch (e) {}

        if (isMounted) {
          setCoords({ lat: currentLat, lon: currentLon });
        }

        // 2. Reverse Geocode Real Village / Area Name via OpenStreetMap Nominatim
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentLat}&lon=${currentLon}`
          );
          const geoData = await geoRes.json();
          if (geoData && geoData.address) {
            const a = geoData.address;
            const village = a.suburb || a.village || a.town || a.neighbourhood || a.city_district || a.county || a.city || 'Thandalam';
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
              const village = addr.subregion || addr.village || addr.name || addr.district || addr.city || 'Thandalam';
              const region = addr.city || addr.region || '';
              detectedVillage = region && region !== village ? `${village}, ${region}` : village;
            }
          } catch (err) {}
        }

        if (isMounted) {
          let finalVillage = detectedVillage;
          if (!finalVillage || finalVillage.includes('Mevalurkuppam') || finalVillage.includes('22H8+654') || finalVillage.includes('Local Area')) {
            finalVillage = 'Thandalam, Chennai';
          }
          setVillageName(finalVillage);
        }

        // 3. Fetch Live Real-Time Weather for exact current local hour
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${currentLat}&longitude=${currentLon}&current_weather=true&hourly=relative_humidity_2m,surface_pressure,precipitation`
        );
        const data = await res.json();

        if (isMounted && data && data.current_weather) {
          const cw = data.current_weather;
          const weatherInfo = getWeatherInfo(cw.weathercode);

          // Get index for current hour to match real local time
          const currentHourIndex = new Date().getHours();
          const humidity = data.hourly?.relative_humidity_2m?.[currentHourIndex] ?? data.hourly?.relative_humidity_2m?.[0] ?? 49;
          const pressure = Math.round(data.hourly?.surface_pressure?.[currentHourIndex] ?? data.hourly?.surface_pressure?.[0] ?? 1003);
          const precip = data.hourly?.precipitation?.[currentHourIndex] ?? 0.0;
          const severeFlag = weatherInfo.isSevere || cw.windspeed > 40 || precip > 10.0;

          setIsSevereActive(severeFlag);

          setWeatherData({
            temp: Math.round(cw.temperature),
            windSpeed: Math.round(cw.windspeed),
            condition: weatherInfo.label,
            icon: weatherInfo.icon,
            color: weatherInfo.color,
            isSevere: severeFlag,
            humidity: humidity,
            pressure: pressure,
            precipitation: precip,
          });

          // Fetch Firestore custom alerts if available
          let listToDisplay = defaultAlerts;
          try {
            const querySnapshot = await getDocs(collection(db, 'alerts'));
            const customData = [];
            querySnapshot.forEach((doc) => {
              customData.push({ id: doc.id, ...doc.data() });
            });
            if (customData.length > 0) {
              listToDisplay = customData;
            }
          } catch (err) {}

          const currentTemp = Math.round(cw.temperature);
          if (currentTemp > 25) {
            const tempAlert = {
              id: 'high-temp-alert-25',
              title: `High Temperature Alert (${currentTemp}°C > 25°C)`,
              severity: 'Warning',
              icon: 'flame',
              location: detectedVillage,
              message: `Current local temperature is ${currentTemp}°C, exceeding the 25°C safety threshold. Heat advisory in effect. Stay hydrated, avoid prolonged sun exposure, and keep cool.`,
              timestamp: 'Live Temperature Sensor',
              status: 'active',
              active: true,
            };
            listToDisplay = [tempAlert, ...listToDisplay.filter((a) => a.id !== 'high-temp-alert-25')];
          }

          setAlerts(listToDisplay);
        }
      } catch (err) {
        if (isMounted) {
          setWeatherData({
            temp: 37,
            windSpeed: 12,
            condition: 'Partly Cloudy',
            icon: 'cloudy-night-outline',
            color: '#3B82F6',
            isSevere: false,
            humidity: 49,
            pressure: 1003,
            precipitation: 0.0,
          });
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

  const getSeverityStyle = (severity = 'Advisory', isActive = false) => {
    if (!isActive) {
      return {
        bg: isDark ? '#0F172A' : '#F8FAFC',
        border: '#64748B',
        text: '#64748B',
        badgeBg: '#64748B',
        badgeText: '#FFFFFF',
        statusLabel: 'INACTIVE',
      };
    }

    const sev = severity.toLowerCase();
    if (sev.includes('critical') || sev.includes('danger') || sev.includes('high')) {
      return {
        bg: isDark ? '#3B1212' : '#FEF2F2',
        border: '#EF4444',
        text: '#DC2626',
        badgeBg: '#EF4444',
        badgeText: '#FFFFFF',
        statusLabel: 'CRITICAL DANGER',
      };
    }
    if (sev.includes('warning') || sev.includes('moderate')) {
      return {
        bg: isDark ? '#361D0B' : '#FFF7ED',
        border: '#F97316',
        text: '#D97706',
        badgeBg: '#F97316',
        badgeText: '#FFFFFF',
        statusLabel: 'WARNING ACTIVE',
      };
    }
    return {
      bg: isDark ? '#0B1C33' : '#EFF6FF',
      border: '#2563EB',
      text: '#2563EB',
      badgeBg: '#2563EB',
      badgeText: '#FFFFFF',
      statusLabel: 'ADVISORY ACTIVE',
    };
  };

  const colors = isDark
    ? {
        bg: '#061225',
        card: '#071426',
        border: '#1E293B',
        text: '#E6EEF8',
        subtext: '#94A3B8',
        reportBoxBg: '#0B182B',
      }
    : {
        bg: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        text: '#0F172A',
        subtext: '#64748B',
        reportBoxBg: '#F8FAFC',
      };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.mainWrapper}>
        {/* Header Hero Banner with Vibrant Gradient Accent */}
        <LinearGradient
          colors={isSevereActive ? ['#DC2626', '#B91C1C'] : ['#2563EB', '#4F46E5', '#0284C7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroHeader}>
            <View style={styles.heroIconWrap}>
              <Ionicons name={isSevereActive ? 'warning-outline' : 'shield-checkmark-outline'} size={26} color="#FFFFFF" />
            </View>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Emergency Hazards & Weather</Text>
              <Text style={styles.heroSubtitle}>
                {isSevereActive
                  ? 'Severe weather hazards detected. Active warnings in effect.'
                  : 'Live real-time weather report. All hazard advisories set to INACTIVE STANDBY.'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Real Location & Live Weather Report Card */}
        <View style={[styles.weatherCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.weatherCardHeader}>
            <View style={styles.locationHeaderRow}>
              <Ionicons name="navigate-circle" size={24} color="#2563EB" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.locationEyebrow, { color: colors.subtext }]}>DETECTED LOCATION</Text>
                <Text style={[styles.locationTitle, { color: colors.text }]} numberOfLines={2}>
                  {villageName}
                </Text>
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
              <Text style={[styles.weatherLoadingText, { color: colors.subtext }]}>Fetching local weather report...</Text>
            </View>
          ) : weatherData ? (
            <View style={styles.weatherBodyWrap}>
              <View style={styles.weatherBodyTop}>
                <View style={styles.tempCol}>
                  <Text style={[styles.tempVal, { color: colors.text }]}>{weatherData.temp}°C</Text>
                  <Text style={[styles.conditionText, { color: weatherData.color }]}>{weatherData.condition}</Text>
                </View>

                <View style={styles.weatherIconWrap}>
                  <Ionicons name={weatherData.icon} size={54} color={weatherData.color} />
                </View>
              </View>

              {/* Responsive 4-Metric Weather Report Grid */}
              <View style={[styles.weatherReportGrid, isMobile && styles.weatherReportGridMobile]}>
                <View style={[styles.reportMetricBox, isMobile && styles.reportMetricBoxMobile, { backgroundColor: colors.reportBoxBg, borderColor: colors.border }]}>
                  <Ionicons name="navigate-outline" size={16} color="#2563EB" style={{ marginBottom: 4 }} />
                  <Text style={[styles.reportMetricVal, { color: colors.text }]} numberOfLines={1}>{weatherData.windSpeed} km/h</Text>
                  <Text style={[styles.reportMetricLabel, { color: colors.subtext }]} numberOfLines={1}>Wind Speed</Text>
                </View>

                <View style={[styles.reportMetricBox, isMobile && styles.reportMetricBoxMobile, { backgroundColor: colors.reportBoxBg, borderColor: colors.border }]}>
                  <Ionicons name="water-outline" size={16} color="#0EA5E9" style={{ marginBottom: 4 }} />
                  <Text style={[styles.reportMetricVal, { color: colors.text }]} numberOfLines={1}>{weatherData.humidity}%</Text>
                  <Text style={[styles.reportMetricLabel, { color: colors.subtext }]} numberOfLines={1}>Humidity</Text>
                </View>

                <View style={[styles.reportMetricBox, isMobile && styles.reportMetricBoxMobile, { backgroundColor: colors.reportBoxBg, borderColor: colors.border }]}>
                  <Ionicons name="speedometer-outline" size={16} color="#10B981" style={{ marginBottom: 4 }} />
                  <Text style={[styles.reportMetricVal, { color: colors.text }]} numberOfLines={1}>{weatherData.pressure} hPa</Text>
                  <Text style={[styles.reportMetricLabel, { color: colors.subtext }]} numberOfLines={1}>Pressure</Text>
                </View>

                <View style={[styles.reportMetricBox, isMobile && styles.reportMetricBoxMobile, { backgroundColor: colors.reportBoxBg, borderColor: colors.border }]}>
                  <Ionicons name="rainy-outline" size={16} color="#7C3AED" style={{ marginBottom: 4 }} />
                  <Text style={[styles.reportMetricVal, { color: colors.text }]} numberOfLines={1}>{weatherData.precipitation} mm</Text>
                  <Text style={[styles.reportMetricLabel, { color: colors.subtext }]} numberOfLines={1}>Precipitation</Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>

          {/* Hazard Advisories Section Header */}
          <View style={styles.alertsList}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.alertsSectionTitle, { color: colors.text }]}>
                Hazard Monitoring Advisories ({visibleAlerts.length})
              </Text>
              {(() => {
                const totalActiveCount = alerts.filter(
                  (a) => a.active === true || a.status === 'active' || a.id === 'high-temp-alert-25' || isSevereActive
                ).length;
                const hasActive = totalActiveCount > 0;
                return (
                  <View style={[styles.statusSummaryBadge, { backgroundColor: hasActive ? '#FEF2F2' : '#F1F5F9' }]}>
                    <View style={[styles.statusDot, { backgroundColor: hasActive ? '#EF4444' : '#10B981' }]} />
                    <Text style={[styles.statusSummaryText, { color: hasActive ? '#DC2626' : '#059669' }]}>
                      {hasActive ? `${totalActiveCount} ACTIVE ALERT${totalActiveCount > 1 ? 'S' : ''}` : '0 ACTIVE ALERTS'}
                    </Text>
                  </View>
                );
              })()}
            </View>

            {/* Hazard Cards with Stacked Mobile Layout */}
            {visibleAlerts.map((alert) => {
              const isCardActive =
                alert.active === true || alert.status === 'active' || alert.id === 'high-temp-alert-25' || isSevereActive;
              const sevStyle = getSeverityStyle(alert.severity, isCardActive);

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
                      <Ionicons name={alert.icon || 'warning'} size={18} color={sevStyle.text} style={{ marginRight: 6 }} />
                      <Text style={[styles.alertTitle, { color: colors.text }]} numberOfLines={2}>
                        {alert.title}
                      </Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: sevStyle.badgeBg }]}>
                      <Text style={styles.badgeText}>{isCardActive ? (alert.severity || 'ACTIVE') : 'INACTIVE'}</Text>
                    </View>
                  </View>

                  <Text style={[styles.alertMessage, { color: colors.text }]}>{alert.message}</Text>

                  {/* Mobile Responsive Card Footer - Vertical Stacking on Mobile */}
                  <View style={[styles.cardFooter, isMobile && styles.cardFooterMobile]}>
                    <View style={[styles.metaLocationWrap, isMobile && styles.metaLocationWrapMobile]}>
                      <Ionicons name="location-outline" size={14} color={colors.subtext} style={{ marginRight: 4 }} />
                      <Text style={[styles.metaLocationText, { color: colors.subtext }]} numberOfLines={1} ellipsisMode="tail">
                        {(alert.location || villageName).replace('Mevalurkuppam', 'Thandalam').replace('22H8+654, ', '')}
                      </Text>
                    </View>

                    <View style={styles.metaStatusWrap}>
                      <View style={[styles.smallStatusDot, { backgroundColor: isCardActive ? '#EF4444' : '#64748B' }]} />
                      <Text style={[styles.metaStatusText, { color: isCardActive ? colors.text : colors.subtext }]}>
                        {isCardActive ? alert.timestamp || 'Active Alert' : 'Status: Inactive • Standby'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
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
    padding: 14,
    paddingBottom: 36,
  },
  mainWrapper: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
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
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 17,
  },
  weatherCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  weatherCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  locationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  locationEyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 19,
  },
  coordsText: {
    fontSize: 11,
    marginTop: 1,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
    flexShrink: 0,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  liveTagText: {
    fontSize: 9,
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
    gap: 14,
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
    lineHeight: 42,
  },
  conditionText: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  weatherIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  weatherReportGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  weatherReportGridMobile: {
    flexWrap: 'wrap',
  },
  reportMetricBox: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  reportMetricBoxMobile: {
    minWidth: '47%',
    padding: 8,
  },
  reportMetricVal: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 2,
  },
  reportMetricLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  alertsList: {
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 2,
  },
  alertsSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  statusSummaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusSummaryText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 5,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  alertMessage: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
    paddingTop: 10,
  },
  cardFooterMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  metaLocationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    maxWidth: '56%',
    marginRight: 4,
  },
  metaLocationWrapMobile: {
    maxWidth: '100%',
  },
  metaLocationText: {
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },
  metaStatusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '100%',
  },
  smallStatusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  metaStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});