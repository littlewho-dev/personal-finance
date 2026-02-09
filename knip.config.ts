import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/app/**/*.{ts,tsx}'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: ['**/*.d.ts'],
  ignoreDependencies: ['tw-animate-css'],
};

export default config;
