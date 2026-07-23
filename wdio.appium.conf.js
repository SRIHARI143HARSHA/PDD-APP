export const config = {
  runner: 'local',
  specs: ['./tests/appium/**/*.e2e.js'],
  maxInstances: 1,
  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: Number(process.env.APPIUM_PORT || 4723),
  path: '/',
  logLevel: process.env.WDIO_LOG_LEVEL || 'info',
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    timeout: 120000,
  },
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.APPIUM_DEVICE_NAME || 'Android Emulator',
    'appium:app': process.env.APPIUM_APP,
    'appium:appPackage': process.env.APPIUM_APP_PACKAGE || 'com.srihari2006.disastersafetyapp',
    'appium:appActivity': process.env.APPIUM_APP_ACTIVITY || '.MainActivity',
    'appium:autoGrantPermissions': true,
    'appium:noReset': false,
    'appium:fullReset': true,
    'appium:uiautomator2ServerInstallTimeout': 120000,
    'appium:uiautomator2ServerLaunchTimeout': 120000,
    'appium:newCommandTimeout': 180,
  }],
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,
  services: ['appium'],
};
const localSdk = `${process.env.LOCALAPPDATA || ''}\\Android\\Sdk`;
if (!process.env.ANDROID_HOME && localSdk && process.env.LOCALAPPDATA) {
  process.env.ANDROID_HOME = localSdk;
  process.env.ANDROID_SDK_ROOT = localSdk;
  process.env.PATH = `${localSdk}\\platform-tools;${localSdk}\\emulator;${process.env.PATH}`;
}
