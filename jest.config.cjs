/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^modules/(.*)$': '<rootDir>/src/modules/$1',
    '^core/(.*)$': '<rootDir>/src/core/$1'
  },
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true
}
