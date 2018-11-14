import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import { PksEdit } from './helpers/converter';
import { Convert2Peak } from './helpers/chem';
import { toggleSaveBtn } from './actions/status';

const Styles = () => ({
  icon: {
    margin: '0 0 0 20px',
  },
  tp: {
    margin: '10px 0 0 0',
  },
});

const onClickCb = (
  savePeaks, peaksEdit, toggleSaveBtnAct,
) => (
  () => {
    toggleSaveBtnAct();
    savePeaks(peaksEdit);
  }
);

const BtnSavePeaks = ({
  classes, savePeaks, peakObj, editPeakSt, thresSt, statusSt,
  toggleSaveBtnAct,
}) => {
  const peaks = Convert2Peak(peakObj, thresSt * 0.01);
  const peaksEdit = PksEdit(peaks, editPeakSt);
  const disable = peaksEdit.length === 0 || statusSt.btnSave;

  return (
    <Tooltip
      className={classNames(classes.tp, 'txt-btn-save')}
      title={<span className="txt-sv-tp">Save peaks to file</span>}
    >
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={onClickCb(
            savePeaks, peaksEdit, toggleSaveBtnAct,
          )}
          disabled={disable}
        >
          <span className="txt-btn-save">
            SAVE TO FILE
          </span>
          <SaveIcon className={classes.icon} />
        </Button>
      </div>
    </Tooltip>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    editPeakSt: state.editPeak,
    thresSt: state.threshold,
    statusSt: state.status,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    toggleSaveBtnAct: toggleSaveBtn,
  }, dispatch)
);

BtnSavePeaks.propTypes = {
  classes: PropTypes.object.isRequired,
  peakObj: PropTypes.object.isRequired,
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
  toggleSaveBtnAct: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(Styles)(BtnSavePeaks));
