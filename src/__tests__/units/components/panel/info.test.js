import React from "react";
import { render } from '@testing-library/react'; 
import InfoPanel from '../../../../components/panel/info';
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux';
import '@testing-library/jest-dom'
import { LIST_LAYOUT } from "../../../../constants/list_layout";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";

const mockStore = configureStore([]);
const store = mockStore({
  curve: {
    listCurves: [{feature: {}}],
    curveIdx: 0
  },
  layout: LIST_LAYOUT.H1,
  shift: {
    shifts: [],
  },
  simulation: {
    nmrSimPeaks: [],
  },
  detector: {
    curves: [
      {
        curveIdx: 0,
        selectedDetector: { name: 'Refractive index', label: 'RI' },
      },
    ],
  },
  meta: {
    dscMetaData: {},
  },
  hplcMs: {
    uvvis: { spectraList: [], listWaveLength: [] },
  },
});
const dispatchMock = () => Promise.resolve({});
store.dispatch = jest.fn(dispatchMock);

const theme = createTheme({
  typography: {
    useNextVariants: true
  },
});

const feature = {};
const baseProps = {
  feature,
  integration: {},
  editorOnly: false,
  molSvg: '',
  descriptions: '',
  canChangeDescription: false,
};

describe("<InfoPanel />", () => {
  let AppWrapper;
  beforeEach(() => {
    AppWrapper = ({ store, children}) => {
      return <Provider store={store}> {children} </Provider>
    }
  });

  test('Render info panel',  () => {
    const renderer = 
      <AppWrapper store={store}>
        <ThemeProvider theme={theme}>
          <InfoPanel expand={false} onExapnd={() => {}} {...baseProps} />
        </ThemeProvider>
      </AppWrapper>
    ;
    const {queryByTestId} = render(renderer);
    expect(queryByTestId('PanelInfo')).toBeInTheDocument();
  });
});
