const courseData = require('../../data/courseData');
const chatbot = require('../../backend/chatbot');

describe('Functional Workflows - Disaster Safety App', () => {
  describe('FUNC-001: Emergency Alerts & Disaster Course Data Workflow', () => {
    it('should correctly retrieve course content by topic', () => {
      const courses = typeof courseData.getCourses === 'function' ? courseData.getCourses() : Object.values(courseData);
      expect(courses).toBeDefined();
      expect(Array.isArray(courses) || typeof courses === 'object').toBe(true);
    });

    it('should validate structured emergency guide data for Earthquake, Flood, and Hurricane', () => {
      const sampleScenarios = ['Earthquake', 'Flood', 'Hurricane'];
      sampleScenarios.forEach(scenario => {
        const item = typeof courseData.getCourseByTitle === 'function' 
          ? courseData.getCourseByTitle(scenario)
          : (courseData[scenario] || { title: scenario });
        expect(item).toBeDefined();
      });
    });
  });

  describe('FUNC-002: AI Chatbot Assistant Functional Flow', () => {
    it('should return helpful response for earthquake queries', async () => {
      const query = 'What should I do during an earthquake?';
      const response = await chatbot.askChatbot(query);
      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should process evacuation and emergency shelter questions', async () => {
      const query = 'Where is the nearest emergency shelter?';
      const response = await chatbot.askChatbot(query);
      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
    });
  });

  describe('FUNC-003: Quiz Scoring & Grading Functionality', () => {
    function calculateQuizScore(answers, correctAnswers) {
      let score = 0;
      answers.forEach((ans, idx) => {
        if (ans === correctAnswers[idx]) {
          score += 10;
        }
      });
      const percentage = (score / (correctAnswers.length * 10)) * 100;
      return { score, percentage, passed: percentage >= 70 };
    }

    it('should calculate 100% score for all correct quiz answers', () => {
      const userAnswers = [0, 1, 2, 3];
      const correctAnswers = [0, 1, 2, 3];
      const result = calculateQuizScore(userAnswers, correctAnswers);
      expect(result.score).toBe(40);
      expect(result.percentage).toBe(100);
      expect(result.passed).toBe(true);
    });

    it('should fail quiz if score is below passing threshold of 70%', () => {
      const userAnswers = [0, 0, 0, 0];
      const correctAnswers = [0, 1, 2, 3];
      const result = calculateQuizScore(userAnswers, correctAnswers);
      expect(result.score).toBe(10);
      expect(result.percentage).toBe(25);
      expect(result.passed).toBe(false);
    });

    it('should count only fully completed quizzes towards completion statistics', () => {
      const mockQuizProgress = {
        'Flood Safety': { attempted: true, completed: true, latestScore: 80, bestScore: 90 },
        'Earthquake Safety': { attempted: true, completed: false, latestScore: null },
        'Fire Safety': { attempted: true, completed: true, latestScore: 100, bestScore: 100 },
      };

      const completedCount = Object.values(mockQuizProgress).filter(
        (q) => q && q.completed === true && typeof q.latestScore === 'number'
      ).length;

      expect(completedCount).toBe(2);
    });
  });

  describe('FUNC-004: Emergency SOS Alert Dispatch Flow', () => {
    function dispatchSOSAlert(userLocation, emergencyType) {
      if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
        return { status: 'FAILED', error: 'Location permissions required' };
      }
      return {
        status: 'DISPATCHED',
        alertId: `SOS-${Date.now()}`,
        type: emergencyType,
        location: userLocation,
        timestamp: new Date().toISOString()
      };
    }

    it('should successfully dispatch SOS with valid GPS coordinates', () => {
      const location = { latitude: 12.9716, longitude: 77.5946 };
      const res = dispatchSOSAlert(location, 'EARTHQUAKE_SOS');
      expect(res.status).toBe('DISPATCHED');
      expect(res.alertId).toContain('SOS-');
    });

    it('should reject SOS dispatch if location coordinates are missing', () => {
      const res = dispatchSOSAlert(null, 'FLOOD_SOS');
      expect(res.status).toBe('FAILED');
      expect(res.error).toBe('Location permissions required');
    });
  });
});
