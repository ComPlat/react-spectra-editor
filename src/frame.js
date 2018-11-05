import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import {
  withStyles, createMuiTheme, MuiThemeProvider,
} from '@material-ui/core/styles';
import App from './components/app';
import SettingsPanel from './panel_settings';
import { AddPeakPanel, RmPeakPanel } from './panel_peaks';
import { toXY } from './helpers/converter';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const Styles = () => ({
  panels: {
    padding: '10px 0 0 0',
  },
  icon: {
    margin: '0 0 0 20px',
  },
  btnSave: {
    margin: '20px 0 0 0',
  },
  btnWrite: {
    margin: '20px 0 0 0',
  },
});

const SpectrumViewer = (input, cLabel, xLabel, yLabel, peakObj) => (
  <App
    input={input}
    cLabel={cLabel}
    xLabel={xLabel}
    yLabel={yLabel}
    peakObj={peakObj}
  />
);

const txtBtnSave = () => (
  <span className="txt-btn-save">
    Save to file
  </span>
);

const txtBtnWrite = () => (
  <span className="txt-btn-write">
    Write Peaks
  </span>
);

const onWriteClick = (write, peakObj) => {
  const peaks = toXY(peakObj);
  const result = peaks.map((p) => {
    const valX = Math.round(parseFloat(p[0]) * 10) / 10;
    const valY = (Math.round(parseFloat(p[1]) * 10) / 10).toExponential(1);
    return `${valX}, ${valY};`;
  });
  return () => write(result.join(' '));
};

const btnWrite = (writePeaks, peakObj, classes) => (
  !writePeaks
    ? null
    : (
      <div>
        <Button
          variant="contained"
          color="primary"
          className={classNames(classes.btnWrite)}
          onClick={onWriteClick(writePeaks, peakObj)}
        >
          {txtBtnWrite()}
          <EditIcon className={classes.icon} />
        </Button>
      </div>
    )
);

const btnSave = classes => (
  <div>
    <Button
      variant="contained"
      color="primary"
      className={classNames(classes.btnSave)}
    >
      {txtBtnSave()}
      <SaveIcon className={classes.icon} />
    </Button>
  </div>
);

const Frame = ({
  input, cLabel, xLabel, yLabel, peakObj, writePeaks, classes,
}) => (
  <div className="react-spectrum-viewer">
    <Grid container>
      <Grid item xs={9}>
        { SpectrumViewer(input, cLabel, xLabel, yLabel, peakObj) }
      </Grid>
      <Grid
        item
        align="center"
        xs={3}
        className={classes.panels}
      >
        <MuiThemeProvider theme={theme}>
          <SettingsPanel peakObj={peakObj} />
          <AddPeakPanel />
          <RmPeakPanel />
        </MuiThemeProvider>
        { btnWrite(writePeaks, peakObj, classes) }
        { btnSave(classes) }
      </Grid>
    </Grid>
  </div>
);

Frame.propTypes = {
  input: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  peakObj: PropTypes.object.isRequired,
  writePeaks: PropTypes.oneOfType(
    [
      PropTypes.func,
      PropTypes.bool,
    ],
  ).isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(Styles)(Frame);
