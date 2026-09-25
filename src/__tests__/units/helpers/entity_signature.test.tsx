import { entitySignature, multiEntitiesSignature } from '../../../helpers/entity_signature';
import { LIST_LAYOUT } from '../../../constants/list_layout';

const buildNmrEntity = (nmrSimPeaks?: string[]) => ({
  layout: LIST_LAYOUT.H1,
  spectra: [{ data: [{ x: [1, 2, 3], y: [4, 5, 6] }] }],
  features: {
    editPeak: { data: [{ x: [2], y: [5] }] },
    ...(nmrSimPeaks ? { simulation: { nmrSimPeaks } } : {}),
  },
});

describe('entitySignature — NMR simulation', () => {
  it('is equal for content-equivalent rebuilds', () => {
    expect(entitySignature(buildNmrEntity(['1.20', '3.40'])))
      .toBe(entitySignature(buildNmrEntity(['1.20', '3.40'])));
  });

  it('changes when simulated peaks are added to an otherwise unchanged entity', () => {
    expect(entitySignature(buildNmrEntity([])))
      .not.toBe(entitySignature(buildNmrEntity(['1.20', '3.40'])));
    expect(entitySignature(buildNmrEntity()))
      .not.toBe(entitySignature(buildNmrEntity(['1.20', '3.40'])));
  });

  it('changes when the simulated peaks themselves change', () => {
    expect(entitySignature(buildNmrEntity(['1.20', '3.40'])))
      .not.toBe(entitySignature(buildNmrEntity(['1.20', '3.50'])));
  });

  it('carries the change into the multiEntities signature', () => {
    expect(multiEntitiesSignature([buildNmrEntity([])]))
      .not.toBe(multiEntitiesSignature([buildNmrEntity(['1.20'])]));
  });
});
