import { VerifySize } from '../../../standalone/utils/util_file';

const mb = 1024 * 1024;

describe('standalone client: upload size', () => {
  it('accepts files up to 200 MB', () => {
    expect(VerifySize({ size: 47 * mb })).toBe(true);
    expect(VerifySize({ size: 200 * mb })).toBe(true);
  });

  it('refuses larger and empty files', () => {
    expect(VerifySize({ size: 200 * mb + 1 })).toBe(false);
    expect(VerifySize({ size: 0 })).toBe(false);
  });
});
