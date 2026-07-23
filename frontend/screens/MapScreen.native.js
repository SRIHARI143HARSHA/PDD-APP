import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ThemeContext } from '../context/ThemeContext';

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
  const [region, setRegion] = useState(null);
  const [layers, setLayers] = useState(initialLayers);
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [layerChanged, setLayerChanged] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({});
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
          return;
        }
      } catch (e) {}

      // Default fallback region
      setRegion({
        latitude: 17.3850,
        longitude: 78.4867,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    })();
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

  if (!region) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading Disaster Map...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header Banner */}
      <View style={[styles.mapHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Live Disaster Map</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          Explore hazard information and preparedness locations.
        </Text>
      </View>

      {/* Map Content Area */}
      <View style={styles.mapContainer}>
        <MapView style={styles.map} region={region} showsUserLocation={true}>
          <Marker coordinate={region} title="Current Location" description="Monitored Area" />
        </MapView>

        {/* Floating Layer Controls */}
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
                  size={16}
                  color={layer.active ? layer.color : colors.subtext}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.layerLabel, { color: layer.active ? colors.text : colors.subtext }]}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
  },
  mapHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
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
  map: {
    flex: 1,
  },
  floatingLayerCard: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 180,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  layerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
    paddingBottom: 4,
  },
  layerTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  layersList: {
    gap: 2,
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  layerLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  okButton: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  okButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  minimizedLayerCard: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
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