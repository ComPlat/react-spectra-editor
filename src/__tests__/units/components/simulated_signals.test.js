import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import FN from '../../../fn';
import BtnPredict from '../../../components/cmd_bar/r06_predict_btn';
import nmr1HJcamp from '../../fixtures/nmr1h_jcamp';
import { LIST_LAYOUT } from '../../../constants/list_layout';

jest.mock('../../../helpers/extractPeaksEdit', () => ({
  extractPeaksEdit: () => [],
}));

// NMRshiftDB predicts one shift per atom; equivalent atoms get the same value. So the number of
// distinct values is the number of signals NMRshiftDB expects, as long as they are compared as
// they come. Two different signals 0.003 ppm apart are still two signals.
const SIMULATION = ['7.261', '7.264', '1.23', '1.23', '1.23'];
const withSimulation = (jcamp, peaks) => jcamp.replace(
  /##\$CSSIMULATIONPEAKS=\n[\s\S]*?##END=/,
  `##$CSSIMULATIONPEAKS=\n${peaks.join('\n')}\n##END=`,
);

describe('simulated NMR signals', () => {
  it('keeps the simulated shifts as NMRshiftDB gave them', () => {
    const entity = FN.ExtractJcamp(withSimulation(nmr1HJcamp, SIMULATION));
    expect(entity.features.simulation.nmrSimPeaks).toEqual([7.261, 7.264, 1.23, 1.23, 1.23]);
  });

  it('counts each distinct predicted shift as an expected signal', () => {
    const { simulation } = FN.ExtractJcamp(withSimulation(nmr1HJcamp, SIMULATION)).features;
    const store = configureStore([])({
      layout: LIST_LAYOUT.H1,
      simulation,
      editPeak: { present: {} },
      scan: {},
      shift: { shifts: [] },
      threshold: { list: [{ value: 1 }] },
      integration: { present: {} },
      multiplicity: { present: { multiplicities: [{ stack: [{}, {}, {}] }] } },
      curve: { curveIdx: 0 },
    });
    const { container } = render(
      <Provider store={store}>
        <BtnPredict feature={{ thresRef: 1 }} forecast={{ btnCb: () => {} }} />
      </Provider>,
    );
    // selected multiplets / expected signals / simulated atoms
    expect(container.textContent).toContain('3/3/5');
  });
});
