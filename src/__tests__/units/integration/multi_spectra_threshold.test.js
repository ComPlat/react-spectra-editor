import React from 'react';
import { render, act, waitFor } from '@testing-library/react';

import { SpectraEditor, FN, store } from '../../../app';
import { updateThresholdValue } from '../../../actions/threshold';
import nmr1HJcamp from '../../fixtures/nmr1h_jcamp';
import nmr1HJcamp2 from '../../fixtures/nmr1h_2_jcamp';
import nmr13CJcamp from '../../fixtures/nmr13c_jcamp';
import nmr13CDeptJcamp from '../../fixtures/nmr13c_dept_jcamp';

// A host opens one pair of spectra, the user edits a threshold, then the host opens
// another pair of the same size. The edited value belongs to the first pair: every
// curve of the second must fall back to its own reference.
describe('multi-spectrum: thresholds when another pair of spectra is opened', () => {
  beforeAll(() => {
    const proto = window.SVGSVGElement.prototype;
    proto.createSVGPoint = proto.createSVGPoint || (() => ({
      x: 0, y: 0, matrixTransform: () => ({ x: 0, y: 0 }),
    }));
    proto.getScreenCTM = proto.getScreenCTM || (() => ({
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      e: 0,
      f: 0,
      inverse: () => ({
        a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,
      }),
    }));
  });

  const firstPair = [nmr1HJcamp, nmr1HJcamp2].map((j) => FN.ExtractJcamp(j));
  const secondPair = [nmr13CJcamp, nmr13CDeptJcamp].map((j) => FN.ExtractJcamp(j));
  const editor = (entities) => (
    <SpectraEditor
      entity={entities[0]}
      multiEntities={entities}
      entityFileNames={['a.jdx', 'b.jdx']}
      operations={[{ name: 'save', value: () => {} }]}
    />
  );
  const thresholdValues = () => store.getState().threshold.list.map((t) => t.value);

  it('drops the first pair\'s thresholds', async () => {
    const { rerender } = render(editor(firstPair));
    await waitFor(() => expect(store.getState().curve.listCurves).toHaveLength(2));
    act(() => { store.dispatch(updateThresholdValue({ value: 42, curveIdx: 1 })); });
    expect(thresholdValues()[1]).toBe(42);

    const firstList = store.getState().curve.listCurves;
    rerender(editor(secondPair));
    await waitFor(() => expect(store.getState().curve.listCurves).not.toBe(firstList));
    expect(store.getState().curve.listCurves).toHaveLength(2);

    expect(thresholdValues()).toEqual([false, false]);
  });

  // A host can open the editor on a given curve. That index travels next to the curve
  // list, which every reducer of SET_ALL_CURVES still receives as an array.
  it('opens on the host\'s curve with one threshold per curve', async () => {
    render(
      <SpectraEditor
        entity={secondPair[0]}
        multiEntities={secondPair}
        entityFileNames={['c.jdx', 'd.jdx']}
        curveIdx={1}
        operations={[{ name: 'save', value: () => {} }]}
      />,
    );
    await waitFor(() => expect(store.getState().curve.listCurves).toHaveLength(2));
    expect(store.getState().curve.curveIdx).toBe(1);
    expect(store.getState().threshold.list).toHaveLength(2);
  });
});
