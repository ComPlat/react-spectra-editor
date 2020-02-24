import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators, compose } from 'redux';

import Tooltip from '@material-ui/core/Tooltip';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { withStyles } from '@material-ui/core/styles';

import { PksEdit } from '../../helpers/converter';
import {
  Convert2Peak, Convert2Scan, Convert2Thres,
} from '../../helpers/chem';
import { FromManualToOffset } from '../../helpers/shift';
import { MuButton, commonStyle } from './common';

const styles = () => (
  Object.assign(
    {},
    commonStyle,
  )
);

const onClickCb = (
  operation, peaksEdit, isAscend, isIntensity,
  scan, thres, layoutSt, shiftSt, analysis, decimalSt,
  integrationSt, multiplicitySt,
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
      integration: integrationSt,
      multiplicity: multiplicitySt,
    });
  }
);

const BtnSubmit = ({
  classes, operation, feature, isAscend, isIntensity, disabled,
  editPeakSt, thresSt, statusSt, layoutSt, shiftSt, scanSt, forecastSt,
  decimalSt, integrationSt, multiplicitySt,
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
    <Tooltip title={<span className="txt-sv-tp">Submit</span>}>
      <MuButton
        className={
          classNames(
            'btn-sv-bar-submit',
          )
        }
        color="primary"
        disabled={disBtn}
        onClick={onClickCb(
          operation.value, peaksEdit, isAscend, isIntensity,
          scan, thres, layoutSt, shiftSt, forecastSt.predictions, decimalSt,
          integrationSt, multiplicitySt,
        )}
      >
        <PlayCircleOutlineIcon className={classes.icon} />
      </MuButton>
    </Tooltip>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    editPeakSt: state.editPeak.present,
    thresSt: state.threshold,
    statusSt: state.status,
    layoutSt: state.layout,
    shiftSt: state.shift,
    scanSt: state.scan,
    forecastSt: state.forecast,
    decimalSt: state.submit.decimal,
    integrationSt: state.integration.present,
    multiplicitySt: state.multiplicity.present,
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
  integrationSt: PropTypes.object.isRequired,
  multiplicitySt: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(BtnSubmit);
