/**
 * Configurable Weather Alert Thresholds
 * Centralized constants for real-time weather condition alert triggers.
 */
export const WEATHER_THRESHOLDS = {
  HIGH_TEMPERATURE_THRESHOLD: 35, // Temperature in °C (Alert triggers at or above 35°C)
  HIGH_HUMIDITY_THRESHOLD: 80,    // Relative humidity in % (Alert triggers at or above 80%)
  HEAVY_RAIN_THRESHOLD: 15,       // Rainfall in mm/hr (Heavy rain alert triggers at or above 15 mm/hr)
  STRONG_WIND_THRESHOLD: 35,      // Wind speed in km/h (Strong wind alert triggers at or above 35 km/h)
};
