import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Zoom from '../../../../components/cmd_bar/02_zoom';
import { LIST_UI_SWEEP_TYPE } from '../../../../constants/list_ui';
import { LIST_LAYOUT } from '../../../../constants/list_layout';

const mockStore = configureStore([]);
const buildStore = (layout) => {
  const store = mockStore({
    ui: { sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN },
    layout,
    yInverted: false,
  });
  store.dispatch = jest.fn(() => Promise.resolve({}));
  return store;
};

describe('<Zoom />', () => {
  let AppWrapper;
  beforeEach(() => {
    AppWrapper = function ProviderWrapper({ store: providerStore, children }) {
      return (
        <Provider store={providerStore}>
          {' '}
          {children}
          {' '}
        </Provider>
      );
    };
  });

  it('Render Zoom, with the invert-y toggle for a line layout', async () => {
    const renderer = (
      <AppWrapper store={buildStore(LIST_LAYOUT.DSC)}>
        <Zoom editorOnly={false} />
      </AppWrapper>
    );
    const { queryByTestId, container } = render(renderer);
    const renderResult = queryByTestId('Zoom');
    expect(renderResult).toBeInTheDocument();
    expect(renderResult.childElementCount).toEqual(3);
    expect(container.querySelector('.btn-sv-bar-invert-y')).toBeInTheDocument();
  });

  it('Render Zoom without the invert-y toggle for MS', async () => {
    const renderer = (
      <AppWrapper store={buildStore(LIST_LAYOUT.MS)}>
        <Zoom editorOnly={false} />
      </AppWrapper>
    );
    const { queryByTestId, container } = render(renderer);
    expect(queryByTestId('Zoom').childElementCount).toEqual(2);
    expect(container.querySelector('.btn-sv-bar-invert-y')).toBeNull();
  });
});
