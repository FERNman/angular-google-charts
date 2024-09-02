module.exports = {
  resetMocks: true,
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151001]
      }
    }
  }
};
