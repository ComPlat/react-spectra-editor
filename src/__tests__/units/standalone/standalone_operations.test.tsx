import React from 'react';
import {
  render, screen, fireEvent, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';

import createClientStore from '../../../standalone/store';
import Content from '../../../standalone/components/content';
import { FILE, FORM } from '../../../standalone/constants/action_type';
import { encodeJcamp, installFetch, formEntries } from '../../fixtures/standalone_client';
import nmr1HJcamp from '../../fixtures/nmr1h_jcamp';
import irJcamp from '../../fixtures/ir_jcamp';
import nmr13cDeptJcamp from '../../fixtures/nmr13c_dept_jcamp';
import irResult from '../../fixtures/ir_result';
import nmrResult from '../../fixtures/nmr_result';

// Contract with the real editor: Content hands its operations to SpectraEditor, and the
// editor's Submit button calls them with { spectra_list, curveSt }. Only the SVG painting
// and fetch are stubbed, so a payload the editor reshapes breaks these tests.
jest.mock('../../../components/common/draw', () => ({
  drawMain: jest.fn(),
  drawLabel: jest.fn(),
  drawDisplay: jest.fn(),
  drawDestroy: jest.fn(),
  drawArrowOnCurve: jest.fn(),
}));

const mount = async (source: string, editorOnly = true) => {
  const calls = installFetch({
    'file/convert': { status: true, jcamp: encodeJcamp(source), img: 'preview' },
    'file/refresh': { status: true, jcamp: encodeJcamp(source), img: 'preview' },
    'predict/infrared': irResult,
    'predict/nmr_peaks_form': nmrResult,
  });
  const store = createClientStore();
  store.dispatch({ type: FILE.ADD_INIT, payload: { file: new File(['raw'], 'sample.jdx') } });
  await waitFor(() => expect(store.getState().file.src).toBeTruthy());
  store.dispatch({ type: FORM.SUBMIT, payload: {} });
  await waitFor(() => expect(store.getState().file.jcamp).toBeTruthy());

  const view = render(
    <Provider store={store}><Content editorOnly={editorOnly} /></Provider>,
  );
  await waitFor(() => expect(view.container.querySelector('.input-sv-bar-operation')).toBeTruthy());
  calls.length = 0;
  return { store, calls, view };
};

const chooseOperation = (container: HTMLElement, name: string) => {
  const select = container.querySelector('.input-sv-bar-operation [role="button"], .input-sv-bar-operation [role="combobox"]');
  fireEvent.mouseDown(select as Element);
  fireEvent.click(within(screen.getByRole('listbox')).getByText(name));
};

// The predict / refresh button shares the submit button's class and comes first.
const clickSubmit = (container: HTMLElement) => {
  const buttons = container.querySelectorAll('.btn-sv-bar-submit');
  fireEvent.click(buttons[buttons.length - 1]);
};
const clickPredictOrRefresh = (container: HTMLElement) => {
  fireEvent.click(container.querySelectorAll('.btn-sv-bar-submit')[0]);
};

const peaksTextarea = (container: HTMLElement) => (
  container.querySelector('textarea[placeholder="peaks"]') as HTMLTextAreaElement
);

describe('standalone Content against the real editor', () => {
  beforeEach(() => {
    (window.URL as any).createObjectURL = () => 'blob:zip';
    (window.URL as any).revokeObjectURL = () => {};
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
    delete (global as any).fetch;
  });

  it('offers write multiplicity, write peaks and save for 1H', async () => {
    const { view } = await mount(nmr1HJcamp);
    fireEvent.mouseDown(view.container.querySelector('.input-sv-bar-operation [role="button"], .input-sv-bar-operation [role="combobox"]') as Element);
    const names = screen.getAllByRole('option').map((o) => o.textContent);
    expect(names).toEqual(['write multiplicity', 'write peaks', 'save']);
  });

  it('writes multiplicity from the editor payload', async () => {
    const { view } = await mount(nmr1HJcamp);
    chooseOperation(view.container, 'write multiplicity');
    clickSubmit(view.container);
    await waitFor(() => expect(peaksTextarea(view.container).value).toMatch(/^1H NMR \(/));
  });

  it('writes peaks from the editor payload', async () => {
    const { view } = await mount(nmr1HJcamp);
    chooseOperation(view.container, 'write peaks');
    clickSubmit(view.container);
    await waitFor(() => expect(peaksTextarea(view.container).value).not.toBe(''));
  });

  it('writes IR peaks from the editor payload', async () => {
    const { view } = await mount(irJcamp);
    chooseOperation(view.container, 'write peaks');
    clickSubmit(view.container);
    await waitFor(() => expect(peaksTextarea(view.container).value).toMatch(/IR/));
  });

  it('saves the selected spectrum with a well-formed form body', async () => {
    const { view, calls } = await mount(nmr1HJcamp);
    chooseOperation(view.container, 'save');
    clickSubmit(view.container);
    await waitFor(() => expect(calls.some((c) => c.url.endsWith('file/save'))).toBe(true));

    const save = calls.find((c) => c.url.endsWith('file/save'));
    const body = formEntries(save.options.body);
    expect(body.filename).toBe('sample');
    expect(body.src.name).toBe('sample.jdx');
    expect(body.dst.name).toBe('dst.jcamp');
    // the backend reads refArea and stack straight off the entry, so it must be a
    // single integration / multiplicity, not { integrations: [...] }
    const integration = JSON.parse(body.integration);
    expect(integration).not.toHaveProperty('integrations');
    expect(integration).toHaveProperty('stack');
    const multiplicity = JSON.parse(body.multiplicity);
    expect(multiplicity).not.toHaveProperty('multiplicities');
    expect(multiplicity).toHaveProperty('stack');
    expect(body.shift_ref_name).toBeDefined();
    expect(body.peaks_str).toBeDefined();
    expect(body.thres).toBeDefined();
  });

  it('runs the predict callback for IR without throwing', async () => {
    const { view, calls } = await mount(irJcamp, false);
    clickPredictOrRefresh(view.container);
    await waitFor(() => expect(calls.some((c) => c.url.endsWith('predict/infrared'))).toBe(true));
  });

  it('runs the predict callback for 1H without throwing', async () => {
    // this fixture carries simulated peaks, so the first button is Predict
    const { view, calls } = await mount(nmr1HJcamp, false);
    clickPredictOrRefresh(view.container);
    await waitFor(() => expect(calls.some((c) => c.url.endsWith('predict/nmr_peaks_form'))).toBe(true));
  });

  it('runs the refresh callback when the file has no simulation', async () => {
    const { view, calls } = await mount(nmr13cDeptJcamp, false);
    clickPredictOrRefresh(view.container);
    await waitFor(() => expect(calls.some((c) => c.url.endsWith('file/refresh'))).toBe(true));
  });
});
