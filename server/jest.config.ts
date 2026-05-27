export default {
  preset: "ts-jest",

  testEnvironment: "node",

  roots: ["<rootDir>/src/tests"],

  moduleFileExtensions: ["ts", "js"],

  transform: {
    "^.+\\.ts$": "ts-jest",
  },

  collectCoverage: true,

  coverageDirectory: "coverage",
};