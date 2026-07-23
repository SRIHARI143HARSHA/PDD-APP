import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../App';

const initialLayers = [
  { id: 'flood', label: 'Flood Zones', active: true, color: '#2563EB', icon: 'water-outline' },
  { id: 'earthquake', label: 'Earthquake Faults', active: true, color: '#F97316', icon: 'pulse-outline' },
  { id: 'fire', label: 'Fire Emergencies', active: false, color: '#EF4444', icon: 'flame-outline' },
  { id: 'cyclone', label: 'Cyclone Paths', active: false, color: '#0D9488', icon: 'thunderstorm-outline' },
  { id: 'tsunami', label: 'Tsunami Buoys', active: false, color: '#7C3AED', icon: 'navigate-outline' },
];

export default function MapScreen() {
  const theme = useContext(ThemeContext);
  const isDark = theme?.dark ?? false;
  const [location, setLocation] = useState({ latitude: 17.3850, longitude: 78.4867 }); // Fallback coords
  const [layers, setLayers] = useState(initialLayers);
  const [loading, setLoading] = useState(true);
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [layerChanged, setLayerChanged] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const toggleLayer = (id) => {
    setLayers((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          setLayerChanged(true);
          return { ...item, active: !item.active };
        }
        return item;
      })
    );
  };

  const handleConfirmLayers = () => {
    setShowLayerPanel(false);
    setLayerChanged(false);
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
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header Banner */}
      <View style={[styles.mapHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Live Disaster Map</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            Explore hazard information and preparedness locations in real time.
          </Text>
        </View>
      </View>

      {/* Map Content Area */}
      <View style={styles.mapContainer}>
        <iframe
          title="Live Disaster Map"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=12&output=embed`}
        />

        {/* Floating Disaster Layers Control Card */}
        {showLayerPanel ? (
          <View style={[styles.floatingLayerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.layerHeader}>
            <Ionicons name="layers-outline" size={16} color="#2563EB" style={{ marginRight: 6 }} />
            <Text style={[styles.layerTitle, { color: colors.text }]}>Disaster Layers</Text>
          </View>

          <View style={styles.layersList}>
            {layers.map((layer) => (
              <TouchableOpacity
                key={layer.id}
                style={[
                  styles.layerRow,
                  { backgroundColor: layer.active ? 'rgba(37, 99, 235, 0.08)' : 'transparent' },
                ]}
                onPress={() => toggleLayer(layer.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={layer.active ? 'checkbox' : 'square-outline'}
                  size={18}
                  color={layer.active ? layer.color : colors.subtext}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[
                    styles.layerLabel,
                    { color: layer.active ? colors.text : colors.subtext },
                  ]}
                >
                  {layer.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

            {layerChanged ? (
              <TouchableOpacity style={[styles.okButton, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={handleConfirmLayers} activeOpacity={0.85}>
                <Text style={[styles.okButtonText, { color: colors.text }]}>OK</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <TouchableOpacity style={[styles.minimizedLayerCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setShowLayerPanel(true)} activeOpacity={0.85}>
            <Ionicons name="layers-outline" size={16} color="#2563EB" style={{ marginRight: 6 }} />
            <Text style={[styles.minimizedLayerText, { color: colors.text }]}>Show Layers</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapHeader: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  floatingLayerCard: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 220,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  layerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
    paddingBottom: 6,
  },
  layerTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  layersList: {
    gap: 4,
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  layerLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  okButton: {
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  okButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  minimizedLayerCard: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  minimizedLayerText: {
    fontSize: 12,
    fontWeight: '800',
  },
});