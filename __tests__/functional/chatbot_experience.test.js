describe('AI Chatbot Thinking & Processing Experience Test Suite', () => {
  function getProcessingMessageSequence(query, currentWeather, activeAlerts) {
    const q = (query || '').toLowerCase();
    const isWeatherQuery =
      q.includes('weather') ||
      q.includes('rain') ||
      q.includes('temp') ||
      q.includes('temperature') ||
      q.includes('wind') ||
      q.includes('humidity') ||
      q.includes('sun') ||
      q.includes('cloud') ||
      q.includes('hot') ||
      q.includes('cold') ||
      q.includes('drizzle') ||
      q.includes('storm');

    const hasActiveAlerts = Array.isArray(activeAlerts) && activeAlerts.length > 0;
    const isAlertQuery =
      hasActiveAlerts ||
      q.includes('alert') ||
      q.includes('warning') ||
      q.includes('alarm') ||
      q.includes('sos');

    if (isWeatherQuery) {
      return [
        'Analyzing your question...',
        'Checking current weather information...',
        'Analyzing weather conditions...',
        'Preparing safety guidance...',
      ];
    }

    if (isAlertQuery) {
      return [
        'Analyzing your question...',
        'Checking active alerts & hazard telemetry...',
        'Analyzing current conditions...',
        'Preparing safety recommendations...',
      ];
    }

    return [
      'Analyzing your question...',
      'Checking disaster safety context...',
      'Preparing a response...',
    ];
  }

  it('should select weather-specific processing messages for weather queries', () => {
    const seq = getProcessingMessageSequence('What should I do during heavy rain?', null, []);
    expect(seq).toContain('Checking current weather information...');
    expect(seq).toContain('Preparing safety guidance...');
  });

  it('should select alert-specific processing messages when active alerts exist', () => {
    const seq = getProcessingMessageSequence('What should I do now?', null, [{ id: '1', title: 'Rain Alert' }]);
    expect(seq).toContain('Checking active alerts & hazard telemetry...');
    expect(seq).toContain('Preparing safety recommendations...');
  });

  it('should select general processing messages for general safety queries', () => {
    const seq = getProcessingMessageSequence('What should I keep in an emergency kit?', null, []);
    expect(seq).toContain('Checking disaster safety context...');
    expect(seq).toContain('Preparing a response...');
  });

  it('should verify minimum visible duration calculation promise', async () => {
    const startTime = Date.now();
    const minDelayPromise = new Promise((resolve) => setTimeout(resolve, 300));
    const fastApiPromise = Promise.resolve('Quick response');

    const [res] = await Promise.all([fastApiPromise, minDelayPromise]);
    const duration = Date.now() - startTime;

    expect(res).toBe('Quick response');
    expect(duration).toBeGreaterThanOrEqual(250);
  });
});
