import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

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
  operation, peaksEdit, isAscend, isIntensity,
  scan, thres, layoutSt, shiftSt, analysis, decimalSt,
) => (
  () => {
    operation({
      peaks: peaksEdit,
      layout: layoutSt,
      shift: shiftSt,
      scan,
      thres,
      isAscend,
      isIntensity,
      analysis,
      decimal: decimalSt,
    });
  }
);

const BtnSubmit = ({
  classes, operation, feature, isAscend, isIntensity, disabled,
  editPeakSt, thresSt, statusSt, layoutSt, shiftSt, scanSt, forecastSt,
  decimalSt,
}) => {
  const { ref, peak } = shiftSt;

  const offset = FromManualToOffset(ref, peak);
  const peaks = Convert2Peak(feature, thresSt.value, offset);
  const peaksEdit = PksEdit(peaks, editPeakSt);
  const disBtn = peaksEdit.length === 0 || statusSt.btnSubmit || disabled;
  const scan = Convert2Scan(feature, scanSt);
  const thres = Convert2Thres(feature, thresSt);

  if (!operation) return null;

  return (
    <IconButton
      className={classNames(classes.btn)}
      color="primary"
      onClick={onClickCb(
        operation.value, peaksEdit, isAscend, isIntensity,
        scan, thres, layoutSt, shiftSt, forecastSt.predictions, decimalSt,
      )}
      variant="fab"
      disabled={disBtn}
    >
      <PlayCircleOutline className={classes.icon} />
    </IconButton>
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
    forecastSt: state.forecast,
    decimalSt: state.submit.decimal,
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
  isIntensity: PropTypes.bool.isRequired,
  operation: PropTypes.oneOfType(
    [
      PropTypes.object,
      PropTypes.bool,
    ],
  ).isRequired,
  disabled: PropTypes.bool.isRequired,
  editPeakSt: PropTypes.object.isRequired,
  statusSt: PropTypes.object.isRequired,
  thresSt: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  shiftSt: PropTypes.object.isRequired,
  scanSt: PropTypes.object.isRequired,
  forecastSt: PropTypes.object.isRequired,
  decimalSt: PropTypes.number.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(BtnSubmit);
