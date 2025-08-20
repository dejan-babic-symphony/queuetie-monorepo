import storybookTest from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const monorepoRoot = resolve(rootDir, '../..');

export default defineConfig({
  root: rootDir,
  plugins: [react(), tsconfigPaths()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
          passWithNoTests: true,
          setupFiles: [
            resolve(monorepoRoot, '.storybook/vitest.setup.ts'),
            resolve(rootDir, 'vitest.setup.ts'),
          ],
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(monorepoRoot, '.storybook') })],
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
