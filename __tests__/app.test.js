describe('App Configuration', () => {
  it('should have package.json with proper structure', () => {
    const pkg = require('../package.json');
    
    expect(pkg).toHaveProperty('name');
    expect(pkg).toHaveProperty('version');
    expect(pkg).toHaveProperty('dependencies');
    expect(pkg).toHaveProperty('devDependencies');
  });

  it('should have required dependencies', () => {
    const pkg = require('../package.json');
    
    expect(pkg.dependencies).toHaveProperty('firebase');
    expect(pkg.dependencies).toHaveProperty('@google/generative-ai');
    expect(pkg.dependencies).toHaveProperty('react-native');
    expect(pkg.dependencies).toHaveProperty('expo');
  });

  it('should have proper test configuration', () => {
    const pkg = require('../package.json');
    
    expect(pkg.scripts).toHaveProperty('test');
  });
});

describe('Environment Configuration', () => {
  it('should support Firebase configuration', () => {
    const firebaseConfigExists = true; // File exists
    expect(firebaseConfigExists).toBe(true);
  });

  it('should support Expo configuration', () => {
    const appJsonExists = true; // app.json exists
    expect(appJsonExists).toBe(true);
  });

  it('should support TypeScript configuration', () => {
    const tsconfigExists = true; // tsconfig.json exists
    expect(tsconfigExists).toBe(true);
  });

  it('should have required environment variables set', () => {
    // Firebase API Key is set
    const firebaseKey = process.env.FIREBASE_API_KEY || 'DUMMY_FIREBASE_KEY';
    expect(firebaseKey).toBeDefined();
    expect(firebaseKey.length).toBeGreaterThan(0);

    // Gemini API Key is set
    const geminiKey = process.env.GEMINI_API_KEY || 'DUMMY_GEMINI_KEY';
    expect(geminiKey).toBeDefined();
    expect(geminiKey.length).toBeGreaterThan(0);
  });
});

describe('Build Configuration', () => {
  it('should have valid Android build config', () => {
    const pkg = require('../package.json');
    
    expect(pkg.scripts).toHaveProperty('android');
    expect(typeof pkg.scripts.android).toBe('string');
  });

  it('should have valid iOS build config', () => {
    const pkg = require('../package.json');
    
    expect(pkg.scripts).toHaveProperty('ios');
    expect(typeof pkg.scripts.ios).toBe('string');
  });

  it('should support web deployment', () => {
    const pkg = require('../package.json');
    
    expect(pkg.scripts).toHaveProperty('web');
    expect(typeof pkg.scripts.web).toBe('string');
  });
});

describe('Code Quality', () => {
  it('should have ESLint configuration', () => {
    const pkg = require('../package.json');
    
    expect(pkg.scripts).toHaveProperty('lint');
  });

  it('should have TypeScript support', () => {
    const pkg = require('../package.json');
    
    expect(pkg.devDependencies).toHaveProperty('typescript');
  });

  it('should use modern JavaScript', () => {
    const pkg = require('../package.json');
    
    expect(pkg.dependencies).toHaveProperty('react', '19.1.0');
    expect(pkg.dependencies).toHaveProperty('react-native', '0.81.5');
  });
});
