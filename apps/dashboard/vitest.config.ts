import storybookTest from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// @ts-expect-error import.meta.url requires ES2020+ module target
const __filename = fileURLToPath(import.meta.url);
const rootDir = dirname(__filename);
const monorepoRoot = resolve(rootDir, '../..');

export default defineConfig({
  root: rootDir,
  plugins: [react(), tsconfigPaths()] as any,
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
          setupFiles: [
            resolve(monorepoRoot, '.storybook/vitest.setup.ts'),
            resolve(rootDir, 'vitest.setup.ts'),
          ],
        },
      },
      {
        extends: true,
        plugins: [storybookTest()] as any,
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            provider: 'playwright',
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: [resolve(monorepoRoot, '.storybook/vitest.setup.ts')],
        },
      },
    ],
  },
});
