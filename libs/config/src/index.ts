type EnvSchema = {
  NODE_ENV: string;
  LOGGER_LEVEL: string;
  LOGGER_PRETTY: boolean;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends Record<keyof EnvSchema, string | undefined> {}
  }
}
export * from '.';
