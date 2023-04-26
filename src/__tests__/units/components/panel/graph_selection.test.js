import React from "react";
import { render, screen, cleanup } from '@testing-library/react'; 
import GraphSelectionPanel from '../../../../components/panel/graph_selection';
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux';
import '@testing-library/jest-dom'

const mockStore = configureStore([]);
const emptyStore = mockStore({curve: {}, layout: ''});
const store = mockStore({
  curve: {
    curveIdx: 0,
    listCurves: []
  },
  layout: 'CYCLIC VOLTAMMETRY'
});
const dispatchMock = () => Promise.resolve({});
emptyStore.dispatch = jest.fn(dispatchMock);
store.dispatch = jest.fn(dispatchMock);

/*
  Charaterization Tests
*/

describe('GraphSelectionPanel', () => {
  let AppWrapper;
  beforeEach(() => {
    AppWrapper = ({ store, children}) => {
      return <Provider store={store}> {children} </Provider>
    }
  });

  afterEach(() => {
    cleanup();
  });

  test('Render with empty store',  () => {
    const renderer = <AppWrapper store={emptyStore}>
      <GraphSelectionPanel expand={false} onExapnd={() => {}} entityFileNames={[]} />
    </AppWrapper>
    const { queryByTestId } = render(renderer);
    expect(queryByTestId('GraphSelectionPanel')).toBeNull();
  });

  test('Render with store', () => {
    const renderer = <AppWrapper store={store}>
      <GraphSelectionPanel expand={false} onExapnd={() => {}} entityFileNames={[]} />
    </AppWrapper>
    const { queryByTestId } = render(renderer);
    expect(queryByTestId('GraphSelectionPanel')).toBeInTheDocument();
  });
});
