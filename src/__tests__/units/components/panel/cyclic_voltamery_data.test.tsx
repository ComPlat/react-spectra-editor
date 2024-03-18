import { RenderResult, render } from '@testing-library/react'; 
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux';
import '@testing-library/jest-dom'
import CyclicVoltammetryPanel from '../../../../components/panel/cyclic_voltamery_data';
import { LIST_UI_SWEEP_TYPE } from '../../../../constants/list_ui';
import { ExtractJcamp } from '../../../../helpers/chem';

import cyclicVoltaJcamp1 from '../../../fixtures/cyclic_voltammetry_1';
import { LIST_LAYOUT } from '../../../../constants/list_layout';
const cyclicVoltaEntity1 = ExtractJcamp(cyclicVoltaJcamp1);

const mockStore = configureStore([]);
const store = mockStore({
  ui: {
    sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN
  },
  cyclicvolta: {
    spectraList: [
      {
        list: [
          {max: {x: 2.0, y: 2.0}, min: {x: -2.0, y: 1.0}, pecker: {x: 1.5, y: 1.6}, isRef: true, e12: 0.0},
          {max: {x: 2.0, y: 2.0}, min: {x: 1.0, y: 1.0}, pecker: {x: 1.5, y: 1.6}, isRef: false, e12: 1.5},
          {max: null, min: null, pecker: {x: 1.5, y: 1.6}, isRef: false, e12: null},
        ],
        shift: {
          ref: {max: {x: 2.0, y: 2.0}, min: {x: -2.0, y: 1.0}, pecker: {x: 1.5, y: 1.6}, isRef: true, e12: 0.0},
          val: 0,
        }
      }
    ]
  },
  jcampIdx: 0,
  layout: LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
});

const dispatchMock = () => Promise.resolve({});
store.dispatch = jest.fn(dispatchMock);

describe('<CyclicVoltammetryPanel />', () => {
  function TestComponent({store}) {
    const { features } = cyclicVoltaEntity1
    return (
      <Provider store={store}>
        <CyclicVoltammetryPanel expand={false} onExapnd={() => {}} molSvg='' feature={features[0]} />
      </Provider>
    )
  }

  let renderedResult: RenderResult

  beforeEach(() => {
    renderedResult = render(<TestComponent store={store}/>);
  });

  it('Render header', () => {
    const { queryByText } = renderedResult
    const header = queryByText('Voltammetry data')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('txt-sv-panel-title')
  });

  describe('Render table', () => {
    it('render table successfully', () => {
      const table = document.querySelector('table')
      expect(table).not.toBeNull()
    })

    it('render table headers', () => {
      const tableHeaders = document?.querySelectorAll('th')
      expect(tableHeaders?.length).toEqual(8)

      const arrHeaderLabel = ['Ref', 'Anodic', 'Cathodic', 'I λ0', 'I ratio', 'E1/2', 'ΔEp', '']
      tableHeaders?.forEach((header, idx) => {
        expect(header).toHaveTextContent(arrHeaderLabel[idx])
        expect(header).toHaveClass('txt-sv-panel-txt')
      })
    })

    it('render table cells', () => {
      const tabelCells = document?.querySelectorAll('td')
      expect(tabelCells?.length).toEqual(24)

      const arrCellLabel = [
        '', 'E: 2.00 V,I: 2.00e+3 mA', 'E: -2.00 V,I: 1.00e+3 mA', '1.60e+3 mA', '0.97', '0.00 V', '4000 mV', '',
        '', 'E: 2.00 V,I: 2.00e+3 mA', 'E: 1.00 V,I: 1.00e+3 mA', '1.60e+3 mA', '0.97', '1.50 V', '1000 mV', '',
        '', 'nd', 'nd', '1.60e+3 mA', 'nd', 'nd', 'nd', '',]
      tabelCells?.forEach((cell, idx) => {
        expect(cell).toHaveTextContent(arrCellLabel[idx])
        expect(cell).toHaveClass('txt-sv-panel-txt')
      })
    })
  })
});
