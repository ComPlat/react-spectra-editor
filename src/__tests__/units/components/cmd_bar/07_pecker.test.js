import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'; 
import '@testing-library/jest-dom';
import Pecker from '../../../../components/cmd_bar/07_pecker';
import { LIST_UI_SWEEP_TYPE } from '../../../../constants/list_ui';
import { LIST_LAYOUT } from '../../../../constants/list_layout';

const mockStore = configureStore([]);
const store = mockStore({
  ui:{ sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN },
  layout: LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
  curve: {
    curveIdx: 0,
  },
  cyclicvolta: {
    spectraList: [],
  }
});
const nmrStore = mockStore({
  ui:{ sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN },
  layout: LIST_LAYOUT.H1,
  curve: {
    curveIdx: 0,
  },
  cyclicvolta: {
    spectraList: [],
  }
});

const dispatchMock = () => Promise.resolve({});
store.dispatch = jest.fn(dispatchMock);
nmrStore.dispatch = jest.fn(dispatchMock);

describe('<Pecker />', () => {
  let AppWrapper;
  beforeEach(() => {
    AppWrapper = ({ store, children}) => {
      return <Provider store={store}> {children} </Provider>
    }
  });

  it('render when cyclic voltammetry layout', async () => {
    const renderer = 
      <AppWrapper store={store}>
        <Pecker />
      </AppWrapper>
    ;
    const { queryByTestId } = render(renderer);
    const renderResult = queryByTestId('Pecker');
    expect(renderResult).toBeInTheDocument();
    expect(renderResult.childElementCount).toEqual(4);
  });

  it('render it is not cyclic voltammetry layout', async () => {
    const renderer = 
      <AppWrapper store={nmrStore}>
        <Pecker />
      </AppWrapper>
    ;
    const { queryByTestId } = render(renderer);
    const renderResult = queryByTestId('Peak');
    expect(renderResult).not.toBeInTheDocument();
  });
})
