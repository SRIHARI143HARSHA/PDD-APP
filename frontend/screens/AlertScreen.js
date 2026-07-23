import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { db } from '../../database/config';
import { ThemeContext } from '../App';

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

export default function AlertScreen({ searchQuery = '' }) {
  const theme = useContext(ThemeContext);
  const isDark = theme?.dark ?? false;
  const [alerts, setAlerts] = useState(defaultAlerts);
  const [city, setCity] = useState('Detecting location...');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleAlerts = normalizedQuery
    ? alerts.filter((alert) => {
        const haystack = `${alert.title} ${alert.message} ${alert.severity} ${alert.location}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : alerts;

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'alerts'));
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        if (data.length > 0) {
          setAlerts(data);
        }
      } catch (error) {}
    };

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setCity('Regional Zone');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address.length > 0) {
          setCity(address[0].city || address[0].region || 'Local Region');
        }
      } catch (error) {
        setCity('Regional Zone');
      }
    };

    fetchAlerts();
    getLocation();
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
      }
    : {
        bg: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E2E8F0',
        text: '#0F172A',
        subtext: '#64748B',
      };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.mainWrapper}>
        {/* Hero Card */}
        <LinearGradient colors={['#DC2626', '#EA580C']} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIconWrap}>
              <Ionicons name="warning-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Emergency Hazards & Alerts</Text>
              <Text style={styles.heroSubtitle}>Stay informed about active hazard advisories for your region.</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Location Banner */}
        <View style={[styles.infoBanner, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="location" size={18} color="#2563EB" />
          <Text style={[styles.infoText, { color: colors.text }]}>Monitoring Zone: {city}</Text>
        </View>

        {/* Alert Cards */}
        {visibleAlerts.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="notifications-off-outline" size={36} color={colors.subtext} />
            <Text style={[styles.noAlertsTitle, { color: colors.text }]}>No Active Emergency Alerts</Text>
            <Text style={[styles.noAlertsSub, { color: colors.subtext }]}>No hazard advisories match your query for this location.</Text>
          </View>
        ) : (
          visibleAlerts.map((alert) => {
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
                    <Text style={[styles.metaText, { color: colors.subtext }]}>{alert.location || city}</Text>
                  </View>

                  <Text style={[styles.timestampText, { color: colors.subtext }]}>{alert.timestamp || 'Active Alert'}</Text>
                </View>
              </View>
            );
          })
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderLeftWidth: 6,
    padding: 16,
    marginBottom: 14,
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
  emptyCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
  },
  noAlertsTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  noAlertsSub: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});