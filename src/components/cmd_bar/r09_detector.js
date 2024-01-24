/* eslint-disable prefer-object-spread, react/jsx-one-expression-per-line,
react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import {
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { updateDetector } from '../../actions/detector';
import Format from '../../helpers/format';
import { commonStyle } from './common';
import { LIST_DETECTORS } from '../../constants/list_detectors';

const styles = () => (
  Object.assign(
    {
      fieldShift: {
        width: 160,
      },
      fieldLayout: {
        width: 100,
      },
    },
    commonStyle,
  )
);

const detectorSelect = (classes, detectorSt, curveSt, layoutSt, updateDetectorAct) => {
  if (!Format.isSECLayout(layoutSt)) {
    return (
      <i />
    );
  }

  const { curveIdx } = curveSt;
  const { curves } = detectorSt;

  const getSelectedDetectorForCurve = (_detectorSt, targetCurveIdx) => {
    const targetCurve = curves.find((curve) => curve.curveIdx === targetCurveIdx);

    return targetCurve ? targetCurve.selectedDetector : '';
  };

  const selectedDetector = getSelectedDetectorForCurve(detectorSt, curveIdx);

  const onChange = (e) => updateDetectorAct({ curveIdx, selectedDetector: e.target.value });

  return (
    <FormControl
      className={classNames(classes.fieldLayout)}
    >
      <InputLabel id="select-detector-label" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Detector
      </InputLabel>
      <Select
        labelId="select-detector-label"
        label="Detector"
        value={selectedDetector}
        onChange={onChange}
        className={classNames(classes.selectInput, 'input-sv-bar-layout')}
      >
        <MenuItem value="">
          <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')} />
        </MenuItem>
        {
          LIST_DETECTORS.map((item) => (
            <MenuItem value={item}>
              <span className={classNames(classes.txtOpt, 'option-sv-bar-layout')}>
                {item.name}
              </span>
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};

const Detector = ({
  classes, detectorSt, curveSt, layoutSt, updateDetectorAct,
}) => (
  <span className={classes.groupRight}>
    { detectorSelect(classes, detectorSt, curveSt, layoutSt, updateDetectorAct) }
  </span>
);

const mapStateToProps = (state, _props) => ( // eslint-disable-line
  {
    detectorSt: state.detector,
    curveSt: state.curve,
    layoutSt: state.layout,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    updateDetectorAct: updateDetector,
  }, dispatch)
);

Detector.propTypes = {
  classes: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  curveSt: PropTypes.object.isRequired,
  updateDetectorAct: PropTypes.func.isRequired,
  detectorSt: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Detector));
