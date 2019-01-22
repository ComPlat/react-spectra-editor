import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import { PksEdit } from '../../helpers/converter';
import { Convert2Peak } from '../../helpers/chem';
import { FromManualToOffset } from '../../helpers/shift';
import { toggleWriteBtn } from '../../actions/status';

const Styles = () => ({
  icon: {
  },
  btn: {
    margin: '20px 0 0 0',
  },
});

const onClickCb = (
  writePeaks, peaksEdit, isAscend,
  layoutSt, shiftSt, toggleWriteBtnAct,
) => (
  () => {
    toggleWriteBtnAct();
    writePeaks(peaksEdit, layoutSt, shiftSt, isAscend);
  }
);

const BtnWritePeaks = ({
  classes, writePeaks, peakObj, isAscend, editPeakSt, thresSt, statusSt,
  layoutSt, shiftSt, toggleWriteBtnAct,
}) => {
  const { ref, peak } = shiftSt;

  const offset = FromManualToOffset(ref, peak);
  const peaks = Convert2Peak(peakObj, thresSt * 0.01, offset);
  const peaksEdit = PksEdit(peaks, editPeakSt);
  const disable = peaksEdit.length === 0 || statusSt.btnWrite;
  if (!writePeaks) return null;

  return (
    <Tooltip
      title={<span className="txt-sv-tp">Write peaks</span>}
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
            writePeaks, peaksEdit, isAscend,
            layoutSt, shiftSt, toggleWriteBtnAct,
          )}
          disabled={disable}
        >
          <EditIcon className={classes.icon} />
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
    toggleWriteBtnAct: toggleWriteBtn,
  }, dispatch)
);

BtnWritePeaks.propTypes = {
  classes: PropTypes.object.isRequired,
  peakObj: PropTypes.object.isRequired,
  isAscend: PropTypes.bool.isRequired,
  writePeaks: PropTypes.oneOfType(
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
  toggleWriteBtnAct: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(Styles)(BtnWritePeaks));
