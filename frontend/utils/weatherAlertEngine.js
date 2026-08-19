import { WEATHER_THRESHOLDS } from '../constants/weatherThresholds';

/**
 * Reusable Weather Alert Engine
 * Evaluates current live weather data against configured thresholds and conditions.
 * Returns ONLY currently active alerts. Returns [] if conditions are normal.
 */
export function generateWeatherAlerts(weatherData) {
  if (!weatherData) return [];

  const activeAlerts = [];

  const temp = typeof weatherData.temp === 'number' ? weatherData.temp : 0;
  const humidity = typeof weatherData.humidity === 'number' ? weatherData.humidity : 0;
  const windSpeed = typeof weatherData.windSpeed === 'number' ? weatherData.windSpeed : 0;
  const rainfall = typeof weatherData.rainfall === 'number' ? weatherData.rainfall : 0;
  const weathercode = typeof weatherData.weathercode === 'number' ? weatherData.weathercode : 0;
  const condition = (weatherData.condition || '').toLowerCase();

  // 1. THUNDERSTORM ALERT (Current condition/code active)
  const isThunderstorm = weathercode >= 95 || condition.includes('thunderstorm');
  if (isThunderstorm) {
    activeAlerts.push({
      id: 'alert-thunderstorm',
      type: 'thunderstorm',
      severity: 'Critical',
      icon: 'thunderstorm',
      title: '⛈️ THUNDERSTORM ALERT',
      message: 'Thunderstorm activity is currently detected in your area. Stay indoors and avoid open areas.',
      status: 'Active',
      color: '#DC2626',
    });
  }

  // 2. HEAVY RAIN ALERT vs RAIN ALERT
  const isRain = rainfall > 0 || (weathercode >= 51 && weathercode <= 82) || condition.includes('rain') || condition.includes('drizzle');
  if (isRain) {
    if (rainfall >= WEATHER_THRESHOLDS.HEAVY_RAIN_THRESHOLD || weathercode === 63 || weathercode === 65 || weathercode === 82) {
      activeAlerts.push({
        id: 'alert-heavy-rain',
        type: 'heavy_rain',
        severity: 'Critical',
        icon: 'rainy',
        title: '🌧️ HEAVY RAIN ALERT',
        message: 'Heavy rainfall is currently occurring in your area.',
        value: `${rainfall} mm/hr`,
        status: 'Active',
        color: '#0284C7',
      });
    } else {
      activeAlerts.push({
        id: 'alert-rain',
        type: 'rain',
        severity: 'Warning',
        icon: 'rainy-outline',
        title: '🌧️ RAIN ALERT',
        message: 'Rain is currently detected in your area.',
        value: `${rainfall > 0 ? rainfall + ' mm/hr' : 'Active'}`,
        status: 'Active',
        color: '#0EA5E9',
      });
    }
  }

  // 3. HIGH TEMPERATURE ALERT
  if (temp >= WEATHER_THRESHOLDS.HIGH_TEMPERATURE_THRESHOLD) {
    activeAlerts.push({
      id: 'alert-high-temp',
      type: 'temperature',
      severity: 'Warning',
      icon: 'thermometer-outline',
      title: '🌡️ HIGH TEMPERATURE ALERT',
      message: 'High temperature conditions are currently detected in your area. Stay hydrated and avoid prolonged exposure to direct sunlight.',
      value: `${temp}°C`,
      status: 'Active',
      color: '#EF4444',
    });
  }

  // 4. HIGH HUMIDITY ALERT
  if (humidity >= WEATHER_THRESHOLDS.HIGH_HUMIDITY_THRESHOLD) {
    activeAlerts.push({
      id: 'alert-high-humidity',
      type: 'humidity',
      severity: 'Warning',
      icon: 'water-outline',
      title: '💧 HIGH HUMIDITY ALERT',
      message: 'High humidity conditions are currently detected. Stay hydrated and avoid strenuous outdoor activity.',
      value: `${humidity}%`,
      status: 'Active',
      color: '#2563EB',
    });
  }

  // 5. STRONG WIND ALERT
  if (windSpeed >= WEATHER_THRESHOLDS.STRONG_WIND_THRESHOLD) {
    activeAlerts.push({
      id: 'alert-strong-wind',
      type: 'wind',
      severity: 'Warning',
      icon: 'navigate-outline',
      title: '💨 STRONG WIND ALERT',
      message: 'Strong winds are currently detected in your area.',
      value: `${windSpeed} km/h`,
      status: 'Active',
      color: '#D97706',
    });
  }

  return activeAlerts;
}
