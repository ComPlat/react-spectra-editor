import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'; 
import '@testing-library/jest-dom';
import Zoom from '../../../../components/cmd_bar/02_zoom';
import { LIST_UI_SWEEP_TYPE } from '../../../../constants/list_ui';

const mockStore = configureStore([]);
const store = mockStore({
  ui:{ sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN },
});

const dispatchMock = () => Promise.resolve({});
store.dispatch = jest.fn(dispatchMock);

describe('<Zoom />', () => {
  let AppWrapper;
  beforeEach(() => {
    AppWrapper = ({ store, children}) => {
      return <Provider store={store}> {children} </Provider>
    }
  });

  it('Render Zoom', async () => {
    const renderer = 
      <AppWrapper store={store}>
        <Zoom editorOnly={false} />
      </AppWrapper>
    ;
    const { queryByTestId } = render(renderer);
    const renderResult = queryByTestId('Zoom');
    expect(renderResult).toBeInTheDocument();
    expect(renderResult.childElementCount).toEqual(2);
  });
})