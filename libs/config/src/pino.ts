import { PinoConfig } from '@queuetie/types';
import { verify } from './utils';

export const pinoConfig = (): PinoConfig => {
  const configuration: PinoConfig = {
    level: process.env.LOGGER_LEVEL,
    pretty: process.env.LOGGER_PRETTY === 'true',
  };

  verify(configuration);

  return configuration;
};
