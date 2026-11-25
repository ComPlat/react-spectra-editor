import curveDisplayName from '../../../helpers/curve_name';

describe('curveDisplayName', () => {
  it('prefers the file name', () => {
    expect(curveDisplayName({ feature: { title: 'Sample A' } }, 0, ['a.jdx'])).toEqual('a.jdx');
  });

  it('falls back to the spectrum title, then to the position', () => {
    expect(curveDisplayName({ feature: { title: 'Sample B' } }, 1, ['a.jdx'])).toEqual('Sample B');
    expect(curveDisplayName({}, 2, ['a.jdx'])).toEqual('Spectrum 3');
    expect(curveDisplayName(undefined, 0)).toEqual('Spectrum 1');
  });
});
