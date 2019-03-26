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
import {
  Convert2Peak, Convert2Scan, Convert2Thres,
} from '../../helpers/chem';
import { FromManualToOffset } from '../../helpers/shift';

const styles = () => ({
  icon: {
  },
  btn: {
    margin: '20px 0 0 0',
  },
});

const onClickCb = (
  operation, peaksEdit, isAscend,
  scan, thres, layoutSt, shiftSt,
) => (
  () => {
    operation({
      peaks: peaksEdit,
      layout: layoutSt,
      shift: shiftSt,
      scan,
      thres,
      isAscend,
    });
  }
);

const BtnSubmit = ({
  classes, operation, feature, isAscend, editPeakSt, thresSt, statusSt,
  layoutSt, shiftSt, scanSt,
}) => {
  const { ref, peak } = shiftSt;

  const offset = FromManualToOffset(ref, peak);
  const peaks = Convert2Peak(feature, thresSt.value, offset);
  const peaksEdit = PksEdit(peaks, editPeakSt);
  const disable = peaksEdit.length === 0 || statusSt.btnSubmit;
  const scan = Convert2Scan(feature, scanSt);
  const thres = Convert2Thres(feature, thresSt);

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
          scan, thres, layoutSt, shiftSt,
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
    scanSt: state.scan,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
);

BtnSubmit.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  isAscend: PropTypes.bool.isRequired,
  operation: PropTypes.oneOfType(
    [
      PropTypes.object,
      PropTypes.bool,
    ],
  ).isRequired,
  editPeakSt: PropTypes.object.isRequired,
  statusSt: PropTypes.object.isRequired,
  thresSt: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  shiftSt: PropTypes.object.isRequired,
  scanSt: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(BtnSubmit);
