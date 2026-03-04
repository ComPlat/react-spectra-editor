import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/styles';

import HPLCViewer from '../../../components/hplc_viewer';
import { LIST_LAYOUT } from '../../../constants/list_layout';

jest.mock('../../../components/cmd_bar/index', () => (props) => (
  <div data-testid="cmd-bar">
    {props.editorOnly ? 'editorOnly' : 'editable'}-{props.hideThreshold ? 'hideThreshold' : 'showThreshold'}
  </div>
));

jest.mock('../../../components/d3_line_rect/index', () => (props) => (
  <div data-testid="viewer-line-rect">
    tic:{props.ticEntities?.length || 0}-uvvis:{props.uvvisEntities?.length || 0}-mz:{props.mzEntities?.length || 0}
  </div>
));

jest.mock('../../../components/panel/index', () => (props) => (
  <div data-testid="panel-viewer">
    {props.integration ? 'hasIntegration' : 'noIntegration'}
  </div>
));

const mockStore = configureStore([]);
const theme = createTheme();

const renderWithStore = (state, extraProps = {}) => {
  const store = mockStore(state);
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <HPLCViewer
          operations={[]}
          entityFileNames={[]}
          userManualLink={{}}
          molSvg=""
          theoryMass=""
          descriptions={[]}
          canChangeDescription={false}
          onDescriptionChanged={() => {}}
          editorOnly={true}
          {...extraProps}
        />
      </ThemeProvider>
    </Provider>,
  );
};

describe('<HPLCViewer />', () => {
  it('renders empty view when there are no entities', () => {
    renderWithStore({
      curve: { listCurves: [], curveIdx: 0 },
      layout: LIST_LAYOUT.LC_MS,
      integration: { present: { integrations: [] } },
      hplcMs: {},
    });

    expect(screen.queryByTestId('cmd-bar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('viewer-line-rect')).not.toBeInTheDocument();
    expect(screen.queryByTestId('panel-viewer')).not.toBeInTheDocument();
  });

  it('renders LCMS blocks with split entities and selected integration', () => {
    const entities = [
      {
        csCategory: ['tic', 'positive'],
        feature: { xUnit: 'min', yUnit: 'intensity' },
        topic: { x: [1, 2], y: [10, 20] },
      },
      {
        csCategory: ['uvvis'],
        feature: { xUnit: 'nm', yUnit: 'AU' },
        topic: { x: [210], y: [0.4] },
      },
      {
        csCategory: ['mz', 'negative'],
        feature: { xUnit: 'm/z', yUnit: 'counts' },
        topic: { x: [100], y: [5] },
      },
    ];

    renderWithStore({
      curve: { listCurves: entities, curveIdx: 1 },
      layout: LIST_LAYOUT.LC_MS,
      integration: { present: { integrations: [null, { id: 'int-2' }, null] } },
      hplcMs: { tic: { polarity: 'positive' } },
    });

    expect(screen.getByTestId('cmd-bar')).toHaveTextContent('editorOnly-hideThreshold');
    expect(screen.getByTestId('viewer-line-rect')).toHaveTextContent('tic:1-uvvis:1-mz:1');
    expect(screen.getByTestId('panel-viewer')).toHaveTextContent('hasIntegration');
  });
});
