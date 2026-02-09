import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/app/**/*.{ts,tsx}'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: [
    '**/*.d.ts',
    // Foundational files used when features are built
    'src/lib/data.ts',
    'src/lib/types.ts',
    'src/lib/utils.ts',
    'src/lib/i18n/messages.ts',
  ],
  ignoreDependencies: [
    'tw-animate-css',
    // shadcn/ui dependencies (configured, used when components added)
    'class-variance-authority',
    'clsx',
    'lucide-react',
    'radix-ui',
    'tailwind-merge',
    // Tooling dependencies
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'shadcn',
    'tailwindcss',
    'postcss',
  ],
};

export default config;
