import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { SpectraEditor, FN, store } from '../../../app';
import { selectCurve } from '../../../actions/curve';
import { setUiViewerType } from '../../../actions/ui';
import { MANAGER } from '../../../constants/action_type';
import { LIST_UI_VIEWER_TYPE } from '../../../constants/list_ui';
import nmr1HJcamp from '../../fixtures/nmr1h_jcamp';
import nmr1HJcamp2 from '../../fixtures/nmr1h_2_jcamp';

// Two 1H spectra in one editor, as chemotion_ELN opens them: the first carries a
// simulation, the second does not.
describe('multi-spectrum NMR: analysis view and predictions per curve', () => {
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

  const entities = [nmr1HJcamp, nmr1HJcamp2].map((j) => FN.ExtractJcamp(j));
  const predictionsFor = (curveIdx) => ({
    outline: { code: 200 },
    output: { result: [{ shifts: [{ atom: 1, prediction: 7.1 + curveIdx }], svgs: [] }] },
    curveIdx,
  });
  const editor = (forecast) => (
    <SpectraEditor
      entity={entities[1]}
      multiEntities={entities}
      entityFileNames={['a.jdx', 'b.jdx']}
      forecast={forecast}
      operations={[{ name: 'save', value: () => {} }]}
    />
  );
  const forecastWith = (predictions) => ({
    btnCb: () => {}, refreshCb: () => {}, molecule: 'mol', predictions,
  });

  it('follows the selected curve, and keeps the chart mounted under the analysis', async () => {
    const { container, rerender } = render(editor(forecastWith(predictionsFor(0))));
    await waitFor(() => expect(store.getState().curve.listCurves).toHaveLength(2));

    // The simulation is the selected curve's, and a curve without one clears it.
    expect(store.getState().curve.curveIdx).toBe(0);
    expect(store.getState().simulation.nmrSimPeaks.length).toBeGreaterThan(0);
    act(() => { store.dispatch(selectCurve(1)); });
    expect(store.getState().simulation.nmrSimPeaks).toEqual([]);
    act(() => { store.dispatch(selectCurve(0)); });
    expect(store.getState().simulation.nmrSimPeaks.length).toBeGreaterThan(0);

    // A host that tags its predictions keeps one set per curve.
    rerender(editor(forecastWith(predictionsFor(1))));
    const { predictionsByCurve } = store.getState().forecast;
    expect(Object.keys(predictionsByCurve)).toEqual(['0', '1']);

    // The analysis view shows; the multi-curve chart stays mounted, so edits survive.
    // ViewerMulti draws into the same root class as the single-curve chart.
    const chart = container.querySelector('.d3Line');
    expect(chart).toBeInTheDocument();
    const dispatched = [];
    const { dispatch } = store;
    store.dispatch = (a) => { dispatched.push(a.type); return dispatch(a); };
    act(() => { store.dispatch(setUiViewerType(LIST_UI_VIEWER_TYPE.ANALYSIS)); });
    store.dispatch = dispatch;
    expect(container.querySelector('.card-forecast-viewer')).toBeInTheDocument();
    expect(container.querySelector('.d3Line')).toBe(chart);
    expect(dispatched).not.toContain(MANAGER.RESETALL);
  });
});
