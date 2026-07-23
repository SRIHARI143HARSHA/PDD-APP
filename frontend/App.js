import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeContext } from './context/ThemeContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const v = await AsyncStorage.getItem('theme-dark');
        setDark(v === '1');
      } catch (e) {}
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('theme-dark', dark ? '1' : '0');
  }, [dark]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'disaster-app-grid-styles';
      if (!document.getElementById(styleId)) {
        const styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.innerHTML = `
          .courses-grid-container {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 24px !important;
            width: 100% !important;
            max-width: 1400px !important;
            margin: 0 auto !important;
            align-items: stretch !important;
            box-sizing: border-box !important;
          }

          .courses-grid-container > div,
          .course-card-cell {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            grid-column: auto !important;
            flex: none !important;
            box-sizing: border-box !important;
          }

          @media (max-width: 1024px) {
            .courses-grid-container {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 18px !important;
            }
          }

          @media (max-width: 640px) {
            .courses-grid-container {
              grid-template-columns: minmax(0, 1fr) !important;
              gap: 14px !important;
            }
          }
        `;
        document.head.appendChild(styleEl);
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      <SafeAreaProvider>
        <StatusBar style={dark ? 'light' : 'dark'} />
        <AppNavigator />
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}
