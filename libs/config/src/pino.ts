import { PinoConfig } from '@queuetie/types';

export const pinoConfig = (): PinoConfig => {
  const configuration: PinoConfig = {
    level: process.env.LOGGER_LEVEL ?? 'info',
    pretty: process.env.LOGGER_PRETTY === 'true',
  };

  // verify(configuration);

  return configuration;
};
