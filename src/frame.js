import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
import { toggleSaveBtn, toggleWriteBtn } from './actions/status';

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
  btn: {
    margin: '20px 0 0 0',
  },
});

const BTN = {
  WRITE: 'WRITE_PEAKS',
  SAVE: 'SAVE_TO_FILE',
};

const SpectrumViewer = (input, cLabel, xLabel, yLabel, peakObj) => (
  <App
    input={input}
    cLabel={cLabel}
    xLabel={xLabel}
    yLabel={yLabel}
    peakObj={peakObj}
  />
);

const btnContent = (content) => {
  switch (content) {
    case BTN.WRITE:
      return (
        <span className="txt-btn-write">
          WRITE PEAKS
        </span>
      );
    case BTN.SAVE:
    default:
      return (
        <span className="txt-btn-save">
          SAVE TO FILE
        </span>
      );
  }
};

const btnIcon = (content, classes) => {
  switch (content) {
    case BTN.WRITE:
      return (
        <EditIcon className={classes.icon} />
      );
    case BTN.SAVE:
    default:
      return (
        <SaveIcon className={classes.icon} />
      );
  }
};

const btnCB = (content, toggleSaveBtnAct, toggleWriteBtnAct) => {
  switch (content) {
    case BTN.WRITE:
      return toggleWriteBtnAct;
    case BTN.SAVE:
    default:
      return toggleSaveBtnAct;
  }
};

const btnDisable = (content, peaksEdit, statusSt) => {
  switch (content) {
    case BTN.WRITE:
      return peaksEdit.length === 0 || statusSt.btnWrite;
    case BTN.SAVE:
    default:
      return peaksEdit.length === 0 || statusSt.btnSave;
  }
};

const onClick = (
  cbFunc, peaksEdit, content,
  toggleSaveBtnAct, toggleWriteBtnAct,
) => {
  const cbFuncBtn = btnCB(content, toggleSaveBtnAct, toggleWriteBtnAct);

  return () => {
    cbFuncBtn();
    cbFunc(peaksEdit);
  };
};

const btn = (
  cbFunc, peakObj, editPeakSt, thresSt, statusSt,
  toggleSaveBtnAct, toggleWriteBtnAct,
  content, classes,
) => {
  const peaks = Convert2Peak(peakObj, thresSt * 0.01);
  const peaksEdit = PksEdit(peaks, editPeakSt);

  return (
    !cbFunc
      ? null
      : (
        <div>
          <Button
            variant="contained"
            color="primary"
            className={classNames(classes.btn)}
            onClick={onClick(
              cbFunc, peaksEdit, content,
              toggleSaveBtnAct, toggleWriteBtnAct,
            )}
            disabled={btnDisable(content, peaksEdit, statusSt)}
          >
            {btnContent(content)}
            {btnIcon(content, classes)}
          </Button>
        </div>
      )
  );
};

// const notAvailable = () => (
//   <div>
//     <span>There is something wrong in the Jcamp file.</span>
//   </div>
// );

const Frame = ({
  input, cLabel, xLabel, yLabel, peakObjs, writePeaks, savePeaks,
  editPeakSt, thresSt, statusSt, managerSt, classes,
  toggleSaveBtnAct, toggleWriteBtnAct,
}) => {
  const [peakAll, peakEdit] = peakObjs;
  const hasEdit = peakEdit && peakEdit.data
    ? peakEdit.data[0].x.length > 0
    : false;

  let peakObj = hasEdit && managerSt.isEdit ? peakEdit : peakAll;
  if (!peakObj) {
    peakObj = { thresRef: false };
  }

  return (
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
            <SettingsPanel peakObj={peakObj} hasEdit={hasEdit} />
            <AddPeakPanel />
            <RmPeakPanel />
          </MuiThemeProvider>
          {
            btn(
              writePeaks, peakObj, editPeakSt, thresSt, statusSt,
              toggleSaveBtnAct, toggleWriteBtnAct,
              BTN.WRITE, classes,
            )
          }
          {
            btn(
              savePeaks, peakObj, editPeakSt, thresSt, statusSt,
              toggleSaveBtnAct, toggleWriteBtnAct,
              BTN.SAVE, classes,
            )
          }
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    editPeakSt: state.editPeak,
    thresSt: state.threshold,
    statusSt: state.status,
    managerSt: state.manager,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    toggleSaveBtnAct: toggleSaveBtn,
    toggleWriteBtnAct: toggleWriteBtn,
  }, dispatch)
);

Frame.propTypes = {
  input: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  peakObjs: PropTypes.array.isRequired,
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
  editPeakSt: PropTypes.object.isRequired,
  statusSt: PropTypes.object.isRequired,
  thresSt: PropTypes.oneOfType(
    [
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ],
  ).isRequired,
  managerSt: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  toggleSaveBtnAct: PropTypes.func.isRequired,
  toggleWriteBtnAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(Styles)(Frame));
