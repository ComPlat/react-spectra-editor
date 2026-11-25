import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import reducers from '../../../../reducers/index';
import Threshold from '../../../../components/cmd_bar/r03_threshold';
import { LIST_LAYOUT } from '../../../../constants/list_layout';

// With several spectra open, the toolbar shows the selected curve's threshold, so its
// restore and edit-mode buttons must act on that curve, not on the last curve whose
// threshold value was typed in.
describe('<Threshold /> with several curves', () => {
  const setup = () => {
    const store = createStore(reducers, {
      layout: LIST_LAYOUT.H1,
      curve: { curveIdx: 1, listCurves: [{}, {}], isShowAllCurve: false },
      threshold: {
        selectedIdx: 0,
        list: [
          {
            isEdit: true, value: 5, upper: false, lower: false,
          },
          {
            isEdit: true, value: 7, upper: false, lower: false,
          },
        ],
      },
    });
    const { container } = render(
      <Provider store={store}>
        <Threshold feature={{ thresRef: 3 }} hasEdit />
      </Provider>,
    );
    return { store, container };
  };

  it('restores the selected curve\'s threshold only', () => {
    const { store, container } = setup();
    fireEvent.click(container.querySelector('.btn-sv-bar-thresref'));
    const { list } = store.getState().threshold;
    expect(list[1].value).toBe(false);
    expect(list[0].value).toBe(5);
  });

  it('toggles the selected curve\'s edit mode only', () => {
    const { store, container } = setup();
    fireEvent.click(container.querySelector('.btn-sv-bar-thresrst'));
    const { list } = store.getState().threshold;
    expect(list[1].isEdit).toBe(false);
    expect(list[0].isEdit).toBe(true);
  });
});
