import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import { PksEdit } from '../../helpers/converter';
import { Convert2Peak } from '../../helpers/chem';
import { FromManualToOffset } from '../../helpers/shift';
import { toggleSaveBtn } from '../../actions/status';

const Styles = () => ({
  icon: {
  },
  btn: {
    margin: '20px 0 0 0',
  },
});

const onClickCb = (
  savePeaks, peaksEdit, isAscend,
  layoutSt, shiftSt, toggleSaveBtnAct,
) => (
  () => {
    toggleSaveBtnAct();
    savePeaks(peaksEdit, layoutSt, shiftSt, isAscend);
  }
);

const BtnSavePeaks = ({
  classes, savePeaks, peakObj, isAscend, editPeakSt, thresSt, statusSt,
  layoutSt, shiftSt, toggleSaveBtnAct,
}) => {
  const { ref, peak } = shiftSt;

  const offset = FromManualToOffset(ref, peak);
  const peaks = Convert2Peak(peakObj, thresSt * 0.01, offset);
  const peaksEdit = PksEdit(peaks, editPeakSt);
  const disable = peaksEdit.length === 0 || statusSt.btnSave;

  if (!savePeaks) return null;

  return (
    <Tooltip
      title={<span className="txt-sv-tp">Save peaks</span>}
      placement="top"
      disableFocusListener
      disableTouchListener
    >
      <div>
        <Button
          variant="contained"
          color="primary"
          className={classNames(classes.btn)}
          onClick={onClickCb(
            savePeaks, peaksEdit, isAscend,
            layoutSt, shiftSt, toggleSaveBtnAct,
          )}
          disabled={disable}
        >
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
    layoutSt: state.layout,
    shiftSt: state.shift,
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
  isAscend: PropTypes.bool.isRequired,
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
  layoutSt: PropTypes.string.isRequired,
  shiftSt: PropTypes.object.isRequired,
  toggleSaveBtnAct: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(Styles)(BtnSavePeaks));
