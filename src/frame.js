import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

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
import { PksEdit } from './helpers/converter';
import { Convert2Peak } from './helpers/chem';

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

const onWriteClick = (write, peakObj, editPeakSt, thresSt) => {
  const peaks = Convert2Peak(peakObj, thresSt * 0.01);
  const peaksEdit = PksEdit(peaks, editPeakSt);
  return () => write(peaksEdit);
};

const btnWrite = (writePeaks, peakObj, editPeakSt, thresSt, classes) => (
  !writePeaks
    ? null
    : (
      <div>
        <Button
          variant="contained"
          color="primary"
          className={classNames(classes.btnWrite)}
          onClick={onWriteClick(writePeaks, peakObj, editPeakSt, thresSt)}
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
  input, cLabel, xLabel, yLabel, peakObj, writePeaks,
  editPeakSt, thresSt, classes,
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
        { btnWrite(writePeaks, peakObj, editPeakSt, thresSt, classes) }
        { btnSave(classes) }
      </Grid>
    </Grid>
  </div>
);

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    editPeakSt: state.editPeak,
    thresSt: state.threshold,
  }
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
  editPeakSt: PropTypes.object.isRequired,
  thresSt: PropTypes.oneOfType(
    [
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ],
  ).isRequired,
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(Styles)(Frame));
