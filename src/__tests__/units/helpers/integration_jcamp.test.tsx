import { serializeIntegrationRecords } from '../../../helpers/integration_jcamp';
import { buildIntegFeature } from '../../../helpers/chem';
import { LIST_LAYOUT } from '../../../constants/list_layout';

describe('serializeIntegrationRecords', () => {
  const linearSpectra = [{
    data: [{ x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], y: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0] }],
  }];

  it('returns empty object for missing stack', () => {
    expect(serializeIntegrationRecords(null, LIST_LAYOUT.HPLC_UVVIS)).toEqual({});
  });

  it('serializes a simple HPLC integration without groups', () => {
    const records = serializeIntegrationRecords({
      stack: [{ xL: 0, xU: 10, area: 5, absoluteArea: 5 }],
      refArea: 1,
      refFactor: 1,
    }, LIST_LAYOUT.HPLC_UVVIS);

    expect(records.$OBSERVEDINTEGRALS).toContain('0, 10, 5, 5');
    expect(records.$OBSERVEDINTEGRALSGROUPS).toBeUndefined();
    expect(records.$CSITAREA).toBe('1');
  });

  it('serializes visual split groups for HPLC', () => {
    const records = serializeIntegrationRecords({
      stack: [
        { xL: 0, xU: 4, area: 2, absoluteArea: 2, visualSplitGroupId: 'vsg-1' },
        { xL: 4, xU: 10, area: 3, absoluteArea: 3, visualSplitGroupId: 'vsg-1' },
      ],
      refArea: 1,
      refFactor: 1,
    }, LIST_LAYOUT.HPLC_UVVIS);

    expect(records.$OBSERVEDINTEGRALSGROUPS).toContain('0, vsg-1');
    expect(records.$OBSERVEDINTEGRALSGROUPS).toContain('1, vsg-1');
  });

  it('does not emit GROUPS for NMR layouts', () => {
    const records = serializeIntegrationRecords({
      stack: [{ xL: 0, xU: 10, area: 5, absoluteArea: 5, visualSplitGroupId: 'vsg-orphan' }],
      refArea: 1,
      refFactor: 1,
    }, LIST_LAYOUT.H1);

    expect(records.$OBSERVEDINTEGRALS).toBeDefined();
    expect(records.$OBSERVEDINTEGRALSGROUPS).toBeUndefined();
  });

  it('round-trips through buildIntegFeature with group ids', () => {
    const integration = {
      stack: [
        { xL: 0, xU: 4, area: 2, absoluteArea: 2, visualSplitGroupId: 'vsg-roundtrip' },
        { xL: 4, xU: 10, area: 3, absoluteArea: 3, visualSplitGroupId: 'vsg-roundtrip' },
      ],
      refArea: 1,
      refFactor: 1,
    };
    const records = serializeIntegrationRecords(integration, LIST_LAYOUT.HPLC_UVVIS);
    const jcamp: any = { info: { ...records }, spectra: [{}] };
    const feature = buildIntegFeature(jcamp, linearSpectra);

    expect(feature.stack).toHaveLength(2);
    expect(feature.stack[0]).toMatchObject({ xL: 0, xU: 4, visualSplitGroupId: 'vsg-roundtrip' });
    expect(feature.stack[1]).toMatchObject({ xL: 4, xU: 10, visualSplitGroupId: 'vsg-roundtrip' });
  });
});
