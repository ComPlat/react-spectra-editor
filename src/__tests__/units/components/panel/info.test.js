import React from "react";
import { render, screen } from '@testing-library/react'; 
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

  },
  detector: {
    curves: [
      {
        curveIdx: 0,
        selectedDetector: { name: 'Refractive index', label: 'RI' },
      },
    ],
  },
  meta: {}
});
const failedStore = mockStore({

});
const dispatchMock = () => Promise.resolve({});
store.dispatch = jest.fn(dispatchMock);

const theme = createTheme({
  typography: {
    useNextVariants: true
  },
});

const feature = {

};

describe("<InfoPanel />", () => {
  let AppWrapper;
  beforeEach(() => {
    AppWrapper = ({ store, children}) => {
      return <Provider store={store}> {children} </Provider>
    }
  });

  test('Cannot render info panel',  () => {
    const renderer = 
      <AppWrapper store={store}>
        <ThemeProvider theme={theme}>
          <InfoPanel expand={false} onExapnd={() => {}} />
        </ThemeProvider>
      </AppWrapper>
    ;
    const {queryByTestId} = render(renderer);
    expect(queryByTestId('PanelInfo')).not.toBeInTheDocument();
  });

  test('Render info panel', () => {
    const renderer = 
      <AppWrapper store={store}>
        <ThemeProvider theme={theme}>
          <InfoPanel expand={false} onExapnd={() => {}} feature={feature} />
        </ThemeProvider>
      </AppWrapper>
    ;
    const {queryByTestId} = render(renderer);
    expect(queryByTestId('PanelInfo')).toBeInTheDocument();
  });

  test('Render M+ exact mass for MS layout', () => {
    const msStore = mockStore({
      curve: {
        listCurves: [{feature: {}}],
        curveIdx: 0
      },
      layout: LIST_LAYOUT.MS,
      shift: {
        shifts: [],
      },
      simulation: [],
      detector: {
        curves: [
          {
            curveIdx: 0,
            selectedDetector: { name: 'Refractive index', label: 'RI' },
          },
        ],
      },
      meta: {}
    });

    const renderer =
      <AppWrapper store={msStore}>
        <ThemeProvider theme={theme}>
          <InfoPanel
            expand={false}
            onExapnd={() => {}}
            feature={feature}
            exactMass="121.0653"
          />
        </ThemeProvider>
      </AppWrapper>
    ;

    render(renderer);

    expect(screen.getByText('121.064751 g/mol')).toBeInTheDocument();
  });
});
