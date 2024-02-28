import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'; 
import '@testing-library/jest-dom';
import ChangeAxes from '../../../../components/cmd_bar/r08_change_axes';
import { LIST_LAYOUT } from '../../../../constants/list_layout';

const mockStore = configureStore([]);
const store = mockStore({
  axesUnits: { axes: [{ xUnit: '', yUnit: '' }]},
  curve: { curveIdx: 0 },
  layout: LIST_LAYOUT.CYCLIC_VOLTAMMETRY
});
const dispatchMock = () => Promise.resolve({});
store.dispatch = jest.fn(dispatchMock);

const options = [
  'Voltage in V',
  'Voltage vs Ref in V',
  'Potential in V',
  'Potential vs Ref in V'
];

describe('<ChangeAxes />', () => {
  let AppWrapper;
  beforeEach(() => {
    AppWrapper = ({ store, children}) => {
      return <Provider store={store}> {children} </Provider>
    }
  });

  it('render', async () => {
    const renderer = 
      <AppWrapper store={store}>
        <ChangeAxes options={options} />
      </AppWrapper>
    ;
    const { queryByTestId } = render(renderer);
    const renderResult = queryByTestId('ChangeAxes');
    expect(renderResult).toBeInTheDocument();
  });
})
