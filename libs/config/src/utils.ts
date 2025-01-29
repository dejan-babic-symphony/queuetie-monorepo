export const verify = (configuration: object) => {
  for (const key of Object.keys(configuration)) {
    if (typeof configuration[key] === 'object') {
      for (const nestedKey of Object.keys(configuration[key])) {
        if (configuration[key][nestedKey] === undefined || configuration[key][nestedKey] === null) {
          throw new Error(`Configuration value [${key}.${nestedKey}] is not set`);
        }
      }
    }

    if (configuration[key] === undefined || configuration[key] === null) {
      throw new Error(`Configuration value [${key}] is not set`);
    }
  }
};
