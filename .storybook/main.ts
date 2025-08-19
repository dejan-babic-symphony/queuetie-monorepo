import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../apps/dashboard/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  viteFinal: async (config) => {
    const { default: tsconfigPaths } = await import('vite-tsconfig-paths');
    config.plugins = [...(config.plugins ?? []), tsconfigPaths()];
    return config;
  },
};
export default config;
