import { startEnv } from '../../../../scripts/start_env';

describe('yarn start / yarn start:dev', () => {
  const backend = 'http://localhost:3007';

  it('yarn start serves the client against CHEM_SPECTRA_APP_URL, on port 4000', () => {
    const { env, error } = startEnv({ CHEM_SPECTRA_APP_URL: ` ${backend} ` });
    expect(error).toBeNull();
    expect(env.REACT_APP_PAGE).toBe('standalone');
    expect(env.CHEM_SPECTRA_APP_URL).toBe(backend);
    expect(env.REACT_APP_STANDALONE_EDITOR_ONLY).toBe('false');
    expect(env.PORT).toBe('4000');
  });

  it('keeps PORT and serves the editorOnly variant on request', () => {
    const { env } = startEnv({
      CHEM_SPECTRA_APP_URL: backend, CHEM_SPECTRA_EDITOR_ONLY: 'true', PORT: '4010',
    });
    expect(env.PORT).toBe('4010');
    expect(env.REACT_APP_STANDALONE_EDITOR_ONLY).toBe('true');
  });

  it('yarn start refuses without a backend URL, and names yarn start:dev', () => {
    ['', '  ', undefined].forEach((url) => {
      const { error } = startEnv({ CHEM_SPECTRA_APP_URL: url });
      expect(error).toMatch(/CHEM_SPECTRA_APP_URL/);
      expect(error).toMatch(/yarn start:dev/);
    });
  });

  it('yarn start:dev serves the dev page, on the default port, with or without a backend URL', () => {
    [{}, { CHEM_SPECTRA_APP_URL: backend }].forEach((input) => {
      const { env, error } = startEnv(input, { dev: true });
      expect(error).toBeNull();
      expect(env.REACT_APP_PAGE).toBe('dev');
      expect(env.PORT).toBeUndefined();
    });
  });
});
