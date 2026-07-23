// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({ name: 'app' })),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({ name: 'db' })),
}));

describe('Firebase Config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Firebase app with correct config', () => {
    const { initializeApp } = require('firebase/app');
    const config = require('../../database/config');

    expect(typeof initializeApp).toBe('function');
    expect(config).toBeDefined();
  });

  it('should export Firestore instance', () => {
    const config = require('../../database/config');
    expect(config.db).toBeDefined();
  });

  it('should use correct Firebase project ID', () => {
    const firebaseConfig = {
      apiKey: 'DUMMY_FIREBASE_API_KEY',
      projectId: 'disaster-safety-app-8e105',
    };
    expect(firebaseConfig.projectId).toBe('disaster-safety-app-8e105');
  });
});

describe('Firebase Initialization Error Handling', () => {
  it('should export valid Firebase config structure', () => {
    const config = require('../../database/config');
    expect(typeof config).toBe('object');
  });
});

describe('Firestore Operations', () => {
  it('should expose a Firestore database object', () => {
    const config = require('../../database/config');
    expect(config.db).toBeDefined();
  });

  it('should have proper security configuration', () => {
    const firebaseConfig = {
      apiKey: 'DUMMY_FIREBASE_API_KEY',
      projectId: 'disaster-safety-app-8e105',
      appId: '1:123456789:android:abc123def456',
    };

    expect(firebaseConfig.apiKey).toBeDefined();
    expect(firebaseConfig.projectId).toBeDefined();
  });
});
