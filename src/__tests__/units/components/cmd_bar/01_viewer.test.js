import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'; 
import '@testing-library/jest-dom';
import Viewer from '../../../../components/cmd_bar/01_viewer'
import { LIST_UI_VIEWER_TYPE } from '../../../../constants/list_ui';
import { LIST_LAYOUT } from '../../../../constants/list_layout';

const mockStore = configureStore([]);
const store = mockStore({
  ui: LIST_UI_VIEWER_TYPE.SPECTRUM,
  layout: LIST_LAYOUT.H1,
});

const dispatchMock = () => Promise.resolve({});
store.dispatch = jest.fn(dispatchMock);

describe('<Viewer />', () => {
  let AppWrapper;
  beforeEach(() => {
    AppWrapper = ({ store, children}) => {
      return <Provider store={store}> {children} </Provider>
    }
  });

  it('Render Viewer', async () => {
    const renderer = 
      <AppWrapper store={store}>
          <Viewer editorOnly={false} />
      </AppWrapper>
    ;
    const { queryByTestId } = render(renderer);
    const renderResult = queryByTestId('Viewer');
    expect(renderResult).toBeInTheDocument();
    expect(renderResult.childElementCount).toEqual(2);
  });

  it('Render Viewer in editor only mode',  () => {
    const renderer = 
      <AppWrapper store={store}>
          <Viewer editorOnly={true} />
      </AppWrapper>
    ;
    const { queryByTestId } = render(renderer);
    const renderResult = queryByTestId('Viewer');
    expect(renderResult).toBeInTheDocument();
    expect(renderResult.childElementCount).toEqual(1);
  });
})
