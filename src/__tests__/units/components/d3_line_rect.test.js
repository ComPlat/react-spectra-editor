import { isLcmsMsPageLoading } from '../../../components/d3_line_rect/index';
import { pickTicIndex } from '../../../components/d3_line_rect/multi_focus';

describe('isLcmsMsPageLoading', () => {
  const buildMzEntity = (polarity, pageValues) => ({
    layout: 'LC/MS',
    lcmsKind: 'mz',
    lcmsPolarity: polarity,
    features: pageValues.map((pageValue) => ({
      pageValue,
      data: [{ x: [100, 101], y: [10, 5] }],
    })),
  });

  it('returns true when the requested RT is not available yet', () => {
    const state = {
      tic: {
        polarity: 'positive',
        currentPageValue: 2.5,
      },
    };

    expect(isLcmsMsPageLoading([
      buildMzEntity('positive', [1.2]),
    ], state)).toEqual(true);
  });

  it('returns false when the requested RT is already present', () => {
    const state = {
      tic: {
        polarity: 'negative',
        currentPageValue: 2.5,
      },
    };

    expect(isLcmsMsPageLoading([
      buildMzEntity('positive', [1.2]),
      buildMzEntity('negative', [2.5]),
    ], state)).toEqual(false);
  });

  it('prefers persisted polarity over default curveIdx when reopening the editor', () => {
    const ticEntities = [
      { lcmsPolarity: 'positive' },
      { lcmsPolarity: 'negative' },
    ];
    expect(pickTicIndex(ticEntities, 0, 'negative')).toEqual(1);
  });

  it('falls back to curveIdx when polarity is unavailable', () => {
    const ticEntities = [
      { lcmsPolarity: 'positive' },
      { lcmsPolarity: 'negative' },
    ];
    expect(pickTicIndex(ticEntities, 1, null)).toEqual(1);
  });

  it('returns true when no MS page has been received yet', () => {
    const state = {
      tic: {
        polarity: 'positive',
        currentPageValue: 2.5,
      },
    };

    expect(isLcmsMsPageLoading([], state)).toEqual(true);
  });
});
