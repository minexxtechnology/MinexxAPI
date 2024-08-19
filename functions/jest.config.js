/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  testMatch: ["**/**/*.test.js"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
};
