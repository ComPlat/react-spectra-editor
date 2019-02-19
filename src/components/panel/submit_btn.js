import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import { withStyles } from '@material-ui/core/styles';

import { PksEdit } from '../../helpers/converter';
import { Convert2Peak } from '../../helpers/chem';
import { FromManualToOffset } from '../../helpers/shift';

const Styles = () => ({
  icon: {
  },
  btn: {
    margin: '20px 0 0 0',
  },
});

const onClickCb = (
  operation, peaksEdit, isAscend,
  layoutSt, shiftSt,
) => (
  () => {
    operation(peaksEdit, layoutSt, shiftSt, isAscend);
  }
);

const SubmitBtn = ({
  classes, operation, peakObj, isAscend, editPeakSt, thresSt, statusSt,
  layoutSt, shiftSt,
}) => {
  const { ref, peak } = shiftSt;

  const offset = FromManualToOffset(ref, peak);
  const peaks = Convert2Peak(peakObj, thresSt * 0.01, offset);
  const peaksEdit = PksEdit(peaks, editPeakSt);
  const disable = peaksEdit.length === 0 || statusSt.btnSubmit;

  if (!operation) return null;

  return (
    <Tooltip
      title={<span className="txt-sv-tp">Execute</span>}
      placement="bottom"
      disableFocusListener
      disableTouchListener
    >
      <IconButton
        className={classNames(classes.btn)}
        color="primary"
        disabled={disable}
        onClick={onClickCb(
          operation.value, peaksEdit, isAscend,
          layoutSt, shiftSt,
        )}
        variant="fab"
      >
        <PlayCircleOutline className={classes.icon} />
      </IconButton>
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
  }, dispatch)
);

SubmitBtn.propTypes = {
  classes: PropTypes.object.isRequired,
  peakObj: PropTypes.object.isRequired,
  isAscend: PropTypes.bool.isRequired,
  operation: PropTypes.oneOfType(
    [
      PropTypes.object,
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
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(Styles),
)(SubmitBtn);
