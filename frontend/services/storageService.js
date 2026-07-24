import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const getItem = async (key) => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

export const setItem = async (key, value) => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
    await AsyncStorage.setItem(key, value);
  } catch (e) {}
};
