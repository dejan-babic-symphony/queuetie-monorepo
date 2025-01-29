import { verify } from './utils';

describe('@queuetie/config verify', () => {
  it('should throw an error if a key is missing in the config', () => {
    const configuration = {
      foo: 'bar',
      baz: undefined,
    };

    expect(() => verify(configuration)).toThrow('Configuration value [baz] is not set');
  });

  it('should throw an error if a nested key is missing in the config', () => {
    const configuration = {
      foo: 'bar',
      baz: {
        qux: undefined,
      },
    };

    expect(() => verify(configuration)).toThrow('Configuration value [baz.qux] is not set');
  });
});
