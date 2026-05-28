import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm', 
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'], 
  moduleFileExtensions: ['ts', 'js', 'json'],
  // 🟢 Maps '.js' imports back to physical '.ts' source files inside your tests
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        // 🟢 Instructs ts-jest to apply path remapping rules to global files too
        diagnostics: {
          ignoreCodes: [1343]
        },
      },
    ],
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
};

export default jestConfig;