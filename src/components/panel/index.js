import React from 'react';
import PropTypes from 'prop-types';

import {
  withStyles, createMuiTheme, MuiThemeProvider,
} from '@material-ui/core/styles';
import SettingsPanel from './settings';
import ModeNavigation from './mode_navigation';
import Manual from './manual';
import { AddPeakPanel, RmPeakPanel } from './peaks';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const styles = () => ({
});

const PanelViewer = ({
  peakObj, hasEdit, writePeaks, savePeaks,
}) => (
  <MuiThemeProvider theme={theme}>
    <ModeNavigation />
    <SettingsPanel
      peakObj={peakObj}
      hasEdit={hasEdit}
      writePeaks={writePeaks}
      savePeaks={savePeaks}
    />
    <AddPeakPanel />
    <RmPeakPanel />
    <Manual />
  </MuiThemeProvider>
);

PanelViewer.propTypes = {
  peakObj: PropTypes.object.isRequired,
  writePeaks: PropTypes.oneOfType(
    [
      PropTypes.func,
      PropTypes.bool,
    ],
  ).isRequired,
  savePeaks: PropTypes.oneOfType(
    [
      PropTypes.func,
      PropTypes.bool,
    ],
  ).isRequired,
  hasEdit: PropTypes.bool.isRequired,
};

export default withStyles(styles)(PanelViewer);
