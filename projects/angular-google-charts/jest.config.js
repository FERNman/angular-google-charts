/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  resetMocks: true,
  transform: {
    '^.+\\.ts?$': ['ts-jest', { diagnostics: { ignoreCodes: ['TS151001'] } }]
  }
};
