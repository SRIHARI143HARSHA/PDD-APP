import { generateWeatherAlerts } from '../../frontend/utils/weatherAlertEngine';

describe('Real-Time Weather Alert Engine Test Suite', () => {
  it('should return empty [] active alerts for clear/normal weather', () => {
    const normalWeather = {
      temp: 28,
      humidity: 60,
      windSpeed: 12,
      rainfall: 0,
      weathercode: 0,
      condition: 'Clear Sky',
    };

    const alerts = generateWeatherAlerts(normalWeather);
    expect(Array.isArray(alerts)).toBe(true);
    expect(alerts.length).toBe(0);
  });

  it('should generate Rain Alert when current precipitation > 0', () => {
    const rainWeather = {
      temp: 26,
      humidity: 75,
      windSpeed: 10,
      rainfall: 4.5,
      weathercode: 51,
      condition: 'Light Rain',
    };

    const alerts = generateWeatherAlerts(rainWeather);
    expect(alerts.length).toBe(1);
    expect(alerts[0].type).toBe('rain');
    expect(alerts[0].title).toBe('🌧️ RAIN ALERT');
    expect(alerts[0].status).toBe('Active');
  });

  it('should generate Heavy Rain Alert when rainfall >= HEAVY_RAIN_THRESHOLD', () => {
    const heavyRainWeather = {
      temp: 24,
      humidity: 70,
      windSpeed: 20,
      rainfall: 22.0,
      weathercode: 63,
      condition: 'Heavy Rain',
    };

    const alerts = generateWeatherAlerts(heavyRainWeather);
    expect(alerts.length).toBe(1);
    expect(alerts[0].type).toBe('heavy_rain');
    expect(alerts[0].title).toBe('🌧️ HEAVY RAIN ALERT');
    expect(alerts[0].status).toBe('Active');
  });

  it('should generate Thunderstorm Alert when weathercode >= 95', () => {
    const stormWeather = {
      temp: 25,
      humidity: 70,
      windSpeed: 28,
      rainfall: 12.0,
      weathercode: 95,
      condition: 'Thunderstorm',
    };

    const alerts = generateWeatherAlerts(stormWeather);
    const hasThunderstorm = alerts.some((a) => a.type === 'thunderstorm');
    expect(hasThunderstorm).toBe(true);
  });

  it('should generate High Temperature Alert when temp >= threshold', () => {
    const hotWeather = {
      temp: 38,
      humidity: 50,
      windSpeed: 15,
      rainfall: 0,
      weathercode: 0,
      condition: 'Sunny',
    };

    const alerts = generateWeatherAlerts(hotWeather);
    const tempAlert = alerts.find((a) => a.type === 'temperature');
    expect(tempAlert).toBeDefined();
    expect(tempAlert.title).toBe('🌡️ HIGH TEMPERATURE ALERT');
    expect(tempAlert.value).toBe('38°C');
  });

  it('should generate multiple alerts simultaneously when multiple thresholds are exceeded', () => {
    const severeWeather = {
      temp: 36,
      humidity: 85,
      windSpeed: 40,
      rainfall: 18.0,
      weathercode: 95,
      condition: 'Thunderstorm with Heavy Rain',
    };

    const alerts = generateWeatherAlerts(severeWeather);
    expect(alerts.length).toBeGreaterThanOrEqual(4);
    expect(alerts.some((a) => a.type === 'thunderstorm')).toBe(true);
    expect(alerts.some((a) => a.type === 'heavy_rain')).toBe(true);
    expect(alerts.some((a) => a.type === 'temperature')).toBe(true);
    expect(alerts.some((a) => a.type === 'humidity')).toBe(true);
    expect(alerts.some((a) => a.type === 'wind')).toBe(true);
  });
});
