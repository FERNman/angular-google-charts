module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-tests.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  resetMocks: true,
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151001]
      }
    }
  }
};
