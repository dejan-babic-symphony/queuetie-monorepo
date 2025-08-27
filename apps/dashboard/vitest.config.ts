import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// @ts-expect-error import.meta.url requires ES2020+ module target
const __filename = fileURLToPath(import.meta.url);
const rootDir = dirname(__filename);

export default defineConfig({
  root: rootDir,
  plugins: [react(), tsconfigPaths()] as any,
  test: {
    // Force exit after all tests complete
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
          setupFiles: [resolve(rootDir, 'vitest.setup.ts')],
          typecheck: {
            tsconfig: resolve(rootDir, 'tsconfig.json'),
          },
          // Prevent hanging by forcing exit after tests
          pool: 'forks',
          poolOptions: {
            forks: {
              singleFork: true,
            },
          },
          testTimeout: 5000,
          hookTimeout: 1000,
          // Force exit after tests complete
        },
      },
      // Storybook tests disabled for now due to browser hanging issues
      // Re-enable when needed with proper browser cleanup configuration
      // {
      //   extends: true,
      //   plugins: [storybookTest()] as any,
      //   test: {
      //     name: 'storybook',
      //     browser: {
      //       enabled: true,
      //       provider: 'playwright',
      //       headless: true,
      //     },
      //     setupFiles: [resolve(monorepoRoot, '.storybook/vitest.setup.ts')],
      //   },
      // },
    ],
  },
});
