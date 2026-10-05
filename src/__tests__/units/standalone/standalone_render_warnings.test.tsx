import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';

import { ChemSpectraClient } from '../../../standalone/index';
import createClientStore from '../../../standalone/store';
import Content from '../../../standalone/components/content';
import { FILE, FORM } from '../../../standalone/constants/action_type';
import { encodeJcamp, installFetch } from '../../fixtures/standalone_client';
import irJcamp from '../../fixtures/ir_jcamp';

// React reports a given warning once per module registry, so these live in their own
// file and render each variant for the first time.
jest.mock('../../../components/common/draw', () => ({
  drawMain: jest.fn(),
  drawLabel: jest.fn(),
  drawDisplay: jest.fn(),
  drawDestroy: jest.fn(),
  drawArrowOnCurve: jest.fn(),
}));

const collectErrors = () => {
  const messages: string[] = [];
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    messages.push(args.map(String).join(' '));
  });
  return messages;
};

describe('standalone client render warnings', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete (global as any).fetch;
  });

  it('renders both page layouts without duplicate-key warnings', () => {
    const messages = collectErrors();
    render(<ChemSpectraClient editorOnly />);
    render(<ChemSpectraClient />);
    expect(messages.filter((m) => /same key|unique "key"/.test(m))).toEqual([]);
  });

  it('gives the editor the prop types it declares', async () => {
    const messages = collectErrors();
    installFetch({ 'file/convert': { status: true, jcamp: encodeJcamp(irJcamp), img: 'p' } });
    const store = createClientStore();
    store.dispatch({ type: FILE.ADD_INIT, payload: { file: new File(['raw'], 'a.jdx') } });
    await waitFor(() => expect(store.getState().file.src).toBeTruthy());
    store.dispatch({ type: FORM.SUBMIT, payload: {} });
    await waitFor(() => expect(store.getState().file.jcamp).toBeTruthy());

    render(<Provider store={store}><Content editorOnly /></Provider>);
    expect(messages.filter((m) => /Invalid prop .multiEntities./.test(m))).toEqual([]);
  });
});
