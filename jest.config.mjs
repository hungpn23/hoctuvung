export default {
  moduleFileExtensions: ['js', 'json', 'ts'],

  roots: ['<rootDir>/src'],

  testRegex: '.*\\.spec\\.ts$',

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  coverageDirectory: '<rootDir>/coverage',

  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**', '!**/dist/**'],

  testEnvironment: 'node',

  clearMocks: true,
};
