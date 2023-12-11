import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'; 
import '@testing-library/jest-dom';
import Peak from '../../../../components/cmd_bar/03_peak';
import { LIST_UI_SWEEP_TYPE } from '../../../../constants/list_ui';
import { LIST_LAYOUT } from '../../../../constants/list_layout';

const mockStore = configureStore([]);
const store = mockStore({
  ui:{ sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN },
  layout: LIST_LAYOUT.MS,
});
const nmrStore = mockStore({
  ui:{ sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN },
  layout: LIST_LAYOUT.H1,
});

const dispatchMock = () => Promise.resolve({});
store.dispatch = jest.fn(dispatchMock);
nmrStore.dispatch = jest.fn(dispatchMock);

describe('<Peak />', () => {
  let AppWrapper;
  beforeEach(() => {
    AppWrapper = ({ store, children}) => {
      return <Provider store={store}> {children} </Provider>
    }
  });

  it('render when has Set reference button', async () => {
    const renderer = 
      <AppWrapper store={nmrStore}>
        <Peak />
      </AppWrapper>
    ;
    const { queryByTestId } = render(renderer);
    const renderResult = queryByTestId('Peak');
    expect(renderResult).toBeInTheDocument();
    expect(renderResult.childElementCount).toEqual(3);
  });

  it('render when does not hav Set reference button', async () => {
    const renderer = 
      <AppWrapper store={store}>
        <Peak />
      </AppWrapper>
    ;
    const { queryByTestId } = render(renderer);
    const renderResult = queryByTestId('Peak');
    expect(renderResult).toBeInTheDocument();
    expect(renderResult.childElementCount).toEqual(2);
  });
})
