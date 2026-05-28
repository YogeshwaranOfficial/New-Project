/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest/presets/default-esm', 
  testMatch: [
    "<rootDir>/src/modules/**/*.test.ts",
    "<rootDir>/src/modules/**/*.spec.ts"
  ],
  // 1. Map the .js extensions in imports back to .ts files for Jest
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // 2. Tell Jest to compile TypeScript files using ts-jest
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};

export default config;