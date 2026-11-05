import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// The factory runs when the module is first required, so this counts real calls. The
// counter lives on global because imports are hoisted above any module-level const.
const storeCalls = () => (global as any).mockStoreCalls || 0;
jest.mock('../../../standalone/store', () => ({
  __esModule: true,
  default: () => {
    (global as any).mockStoreCalls = ((global as any).mockStoreCalls || 0) + 1;
    return jest.requireActual('../../../standalone/store').default();
  },
}));

// eslint-disable-next-line import/first
import { ChemSpectraClient } from '../../../standalone/index';

describe('standalone ChemSpectraClient', () => {
  it('creates no store and starts no saga on import', () => {
    expect(storeCalls()).toBe(0);
  });

  it('creates its store on first render and reuses it afterwards', () => {
    const first = render(<ChemSpectraClient />);
    expect(storeCalls()).toBe(1);
    first.unmount();
    render(<ChemSpectraClient editorOnly />);
    expect(storeCalls()).toBe(1);
  });

  it('shows the welcome title when no file is loaded', () => {
    render(<ChemSpectraClient />);
    expect(screen.getByText('Welcome to ChemSpectra')).toBeInTheDocument();
  });

  // DEMO_MANUAL.md exists on master today and stays as a stub pointing at docs/user-manual.md
  // after the docs move, so the link works before and after.
  it('links the user manual', () => {
    render(<ChemSpectraClient />);
    expect(screen.getByText('User manual').closest('a')).toHaveAttribute(
      'href',
      'https://github.com/ComPlat/react-spectra-editor/blob/master/DEMO_MANUAL.md',
    );
  });

  it('shows the welcome title in editorOnly mode too', () => {
    render(<ChemSpectraClient editorOnly />);
    expect(screen.getByText('Welcome to ChemSpectra')).toBeInTheDocument();
  });
});
