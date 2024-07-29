const config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  clearMocks: true,
  collectCoverage: false,
  coverageReporters: ['lcov', 'text', 'clover', 'cobertura'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  coverageDirectory: '<rootDir>/coverage/',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment'
  ]
};

module.exports = config;
