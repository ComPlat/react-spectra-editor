import React from 'react';
import {
  render, screen, fireEvent, waitFor, within, act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';

import createClientStore from '../../../standalone/store';
import Content from '../../../standalone/components/content';
import { FILE, FORM } from '../../../standalone/constants/action_type';
import { store as editorStore } from '../../../app';
import { selectCurve } from '../../../actions/curve';
import { encodeJcamp, installFetch, formEntries } from '../../fixtures/standalone_client';
import cv1 from '../../fixtures/cyclic_voltammetry_1';
import cv2 from '../../fixtures/cyclic_voltammetry_2';

// A multi-spectrum upload with the second curve selected: the adapter must use the
// selected curve's entries (index 1), not the first curve's.
jest.mock('../../../components/common/draw', () => ({
  drawMain: jest.fn(),
  drawLabel: jest.fn(),
  drawDisplay: jest.fn(),
  drawDestroy: jest.fn(),
  drawArrowOnCurve: jest.fn(),
}));

const mountCv = async () => {
  const calls = installFetch({
    'file/convert': { status: true, list_jcamps: [encodeJcamp(cv1), encodeJcamp(cv2)] },
  });
  const store = createClientStore();
  store.dispatch({ type: FILE.ADD_INIT, payload: { file: new File(['raw'], 'cv.zip') } });
  await waitFor(() => expect(store.getState().file.src).toBeTruthy());
  store.dispatch({ type: FORM.SUBMIT, payload: {} });
  await waitFor(() => expect(store.getState().file.jcampList).toHaveLength(2));

  const view = render(<Provider store={store}><Content editorOnly /></Provider>);
  await waitFor(() => expect(view.container.querySelector('.input-sv-bar-operation')).toBeTruthy());
  await waitFor(() => expect(editorStore.getState().curve.listCurves).toHaveLength(2));
  act(() => { editorStore.dispatch(selectCurve(1)); });
  expect(editorStore.getState().curve.curveIdx).toBe(1);
  calls.length = 0;
  return { calls, view };
};

const chooseOperation = (container: HTMLElement, name: string) => {
  const select = container.querySelector('.input-sv-bar-operation [role="button"], .input-sv-bar-operation [role="combobox"]');
  fireEvent.mouseDown(select as Element);
  fireEvent.click(within(screen.getByRole('listbox')).getByText(name));
};

const clickSubmit = (container: HTMLElement) => {
  const buttons = container.querySelectorAll('.btn-sv-bar-submit');
  fireEvent.click(buttons[buttons.length - 1]);
};

describe('standalone Content with the second of two curves selected', () => {
  beforeEach(() => {
    (window.URL as any).createObjectURL = () => 'blob:zip';
    (window.URL as any).revokeObjectURL = () => {};
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
    delete (global as any).fetch;
  });

  it('writes peaks for the selected curve', async () => {
    const { view } = await mountCv();
    chooseOperation(view.container, 'write peaks');
    clickSubmit(view.container);
    const textarea = view.container.querySelector('textarea[placeholder="peaks"]') as HTMLTextAreaElement;
    await waitFor(() => expect(textarea.value).not.toBe(''));
  });

  it('saves the selected curve with valid JSON fields and every converted file', async () => {
    const { view, calls } = await mountCv();
    chooseOperation(view.container, 'save');
    clickSubmit(view.container);
    await waitFor(() => expect(calls.some((c) => c.url.endsWith('file/save'))).toBe(true));

    const body = formEntries(calls.find((c) => c.url.endsWith('file/save')).options.body);
    // For CV the editor keeps a shift per curve but a single integration and multiplicity
    // entry, so the second curve has none of its own. The backend json.loads these fields:
    // they must be valid JSON ('{}' = none), never another curve's entry or "undefined".
    const { integrations } = editorStore.getState().integration.present;
    expect(integrations[1]).toBeUndefined();
    expect(body.integration).toBe('{}');
    expect(body.multiplicity).toBe('{}');
    expect(body.shift_ref_name).toBe(editorStore.getState().shift.shifts[1].ref.name);
    expect(body.dst_list.map((f) => f.name)).toEqual(['dst_0.jcamp', 'dst_1.jcamp']);
  });
});
