import React from "react";
import { render, screen } from '@testing-library/react'; 
import Peaks from '../../../../components/panel/peaks';
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux';
import '@testing-library/jest-dom'
import { LIST_LAYOUT } from "../../../../constants/list_layout";

const mockStore = configureStore([]);
const store = mockStore({
  editPeak: {
    present: {
      selectedIdx: 0,
      peaks: [
        {
          prevOffset: 0,
          pos: [],
          neg: [],
        },
      ],
    }
  },
  curve: {
    listCurves: [{feature: {}}],
    curveIdx: 0
  },
  layout: LIST_LAYOUT.SEC,
});
const failedStore = mockStore({
  editPeak: {
    present: {
      selectedIdx: 0,
      peaks: [
        {
          prevOffset: 0,
          pos: [],
          neg: [],
        },
      ],
    }
  },
  curve: {
    listCurves: [{}],
    curveIdx: 1
  },
  layout: LIST_LAYOUT.SEC,
});
const dispatchMock = () => Promise.resolve({});
store.dispatch = jest.fn(dispatchMock);


describe("<Peaks />", () => {
  let AppWrapper;
  beforeEach(() => {
    AppWrapper = ({ store, children}) => {
      return <Provider store={store}> {children} </Provider>
    }
  });

  test('Render peaks panel info',  () => {
    const renderer = 
      <AppWrapper store={store}>
        <Peaks expand={false} onExapnd={() => {}} />
      </AppWrapper>
    ;
    const {queryByTestId} = render(renderer);
    expect(queryByTestId('PeaksPanelInfo')).toBeInTheDocument();
  });

  test('Render peaks panel with invalid store list', () => {
    const renderer = 
      <AppWrapper store={failedStore}>
        <Peaks expand={false} onExapnd={() => {}} />
      </AppWrapper>
    ;
    const {queryByTestId} = render(renderer);
    expect(queryByTestId('PeaksPanelInfo')).not.toBeInTheDocument();
  });
});
