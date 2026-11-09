import { seperatingSubLayout } from '../../../components/multi_jcamps_viewer';
import { LIST_LAYOUT } from '../../../constants/list_layout';

describe('seperatingSubLayout', () => {
  const entities = [
    { curveIdx: 0, feature: { xUnit: undefined, yUnit: 'Intensity' } },
    { curveIdx: 1, feature: { xUnit: '1/CM', yUnit: 'COUNTS' } },
  ];

  it('does not split layouts without sub-layouts, even if units differ', () => {
    expect(seperatingSubLayout(entities, 'xUnit', LIST_LAYOUT.XRD)).toBeNull();
    expect(seperatingSubLayout(entities, 'xUnit', LIST_LAYOUT.IR)).toBeNull();
    expect(seperatingSubLayout(entities, 'xUnit', LIST_LAYOUT.CYCLIC_VOLTAMMETRY)).toBeNull();
  });

  it('groups SEC and GC curves by unit', () => {
    const sec = seperatingSubLayout(entities, 'xUnit', LIST_LAYOUT.SEC);
    expect(Object.keys(sec)).toEqual(['undefined', '1/CM']);
    const gc = seperatingSubLayout(entities, 'yUnit', LIST_LAYOUT.GC);
    expect(gc.COUNTS).toEqual([entities[1]]);
  });
});
