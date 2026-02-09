import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/app/**/*.{ts,tsx}', 'src/components/ui/**/*.{ts,tsx}'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: [
    '**/*.d.ts',
    // shadcn/ui components export more than we use (library pattern)
    'src/components/ui/**/*.tsx',
    // Foundational files - exports used by future features
    'src/lib/data.ts',
    'src/lib/i18n/messages.ts',
  ],
  ignoreDependencies: [
    'tw-animate-css',
    // shadcn/ui dependencies
    'class-variance-authority',
    'lucide-react',
    'radix-ui',
    // Tooling dependencies
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'shadcn',
    'tailwindcss',
    'postcss',
  ],
};

export default config;
