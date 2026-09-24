import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/styles';

import { store } from '../../../../app';
import { updateLayout } from '../../../../actions/layout';
import { LIST_LAYOUT } from '../../../../constants/list_layout';
import CmdBar from '../../../../components/cmd_bar/index';

// The right-hand toolbar cluster reads Layout first and ends with Submit (its option
// dropdown, then its button), whichever branch renders it. The order is carried by the
// DOM alone - no `row-reverse` - so DOM order is what the user sees and tabs through.
// Uses the editor's own store, set to 13C: an NMR layout, so the solvent/reference select
// (`.input-sv-bar-shift`, hidden outside NMR) renders. Set explicitly in beforeEach - this
// store is a module-level singleton shared across the whole suite, so state.layout could
// otherwise still be whatever an earlier test left it at (its own default is C13, not
// PLAIN - see reducer_layout.js - but this test must not depend on that either).
describe('<CmdBar /> right cluster order', () => {
  const theme = createTheme();
  const operations = [{ name: 'save', value: () => {} }];

  beforeEach(() => store.dispatch(updateLayout(LIST_LAYOUT.C13)));

  const renderBar = (prependLcMsToolbar = null) => render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CmdBar
          feature={{}}
          hasEdit={false}
          forecast={{}}
          operations={operations}
          editorOnly
          prependLcMsToolbar={prependLcMsToolbar}
        />
      </ThemeProvider>
    </Provider>,
  );

  const precedes = (a, b) => (
    // eslint-disable-next-line no-bitwise
    Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
  );

  const assertOrder = (container) => {
    const layout = container.querySelector('.input-sv-bar-layout');
    const reference = container.querySelector('.input-sv-bar-shift');
    const threshold = container.querySelector('.btn-sv-bar-thresref');
    const decimal = container.querySelector('.input-sv-bar-decimal');
    const operation = container.querySelector('.input-sv-bar-operation');
    [layout, reference, threshold, decimal, operation].forEach((el) => {
      expect(el).toBeInTheDocument();
    });
    expect(precedes(layout, reference)).toBe(true);
    expect(precedes(reference, threshold)).toBe(true);
    expect(precedes(threshold, decimal)).toBe(true);
    expect(precedes(decimal, operation)).toBe(true);

    // Submit's group is the last control of its cluster, so nothing can sit to its right.
    const submitGroup = operation.closest('span[class]');
    expect(submitGroup.parentElement.lastElementChild).toBe(submitGroup);
  };

  it('orders the NMR toolbar Layout ... Submit', () => {
    const { container } = renderBar();
    assertOrder(container);
  });

  it('uses the same order in the LC/MS branch', () => {
    const { container } = renderBar(<span>lcms</span>);
    assertOrder(container);
  });
});
