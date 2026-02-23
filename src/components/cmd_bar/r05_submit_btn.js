/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, function-call-argument-newline,
react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators, compose } from 'redux';

import Tooltip from '@mui/material/Tooltip';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { withStyles } from '@mui/styles';

import {
  Convert2Scan, Convert2Thres,
} from '../../helpers/chem';
import { MuButton, commonStyle } from './common';
import { extractPeaksEdit, extractAreaUnderCurve } from '../../helpers/extractPeaksEdit';
import Format from '../../helpers/format';

const styles = () => (
  Object.assign(
    {},
    commonStyle,
  )
);

const getAxesSelection = (axesUnitsSt, curveSt) => {
  const axes = axesUnitsSt?.axes;
  if (!Array.isArray(axes) || axes.length === 0) return { xUnit: '', yUnit: '' };
  const idx = Number.isFinite(curveSt?.curveIdx) ? curveSt.curveIdx : 0;
  return axes[idx] || axes[0] || { xUnit: '', yUnit: '' };
};

const resolveAxisLabels = (xLabel, yLabel, axesUnitsSt, curveSt) => {
  const { xUnit, yUnit } = getAxesSelection(axesUnitsSt, curveSt);
  return {
    xLabel: xUnit === '' ? xLabel : xUnit,
    yLabel: yUnit === '' ? yLabel : yUnit,
  };
};

const computeCvYScaleFactor = (feature, cyclicvoltaSt) => {
  if (!cyclicvoltaSt?.useCurrentDensity) return 1.0;
  const rawArea = (cyclicvoltaSt.areaValue === '' ? 1.0 : cyclicvoltaSt.areaValue) || 1.0;
  const areaUnit = cyclicvoltaSt.areaUnit || 'cm²';
  const safeArea = rawArea > 0 ? rawArea : 1.0;
  const areaInCm2 = areaUnit === 'mm²' ? (safeArea / 100.0) : safeArea;
  let factor = 1.0 / areaInCm2;
  const baseY = feature && feature.yUnit ? String(feature.yUnit) : 'A';
  if (/mA/i.test(baseY)) {
    factor *= 1000.0;
  }
  if (areaUnit === 'mm²') {
    factor /= 100.0;
  }
  return factor;
};

const onClickCb = (
  operation, peaksEdit, isAscend, isIntensity,
  scan, thres, layoutSt, shiftSt, analysis, decimalSt,
  integrationSt, multiplicitySt, allIntegrationSt, aucValues, waveLengthSt,
  cyclicvoltaSt, curveSt, axesUnitsSt, detectorSt, dscMetaData,
) => (
  () => {
    const payload = {
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
      allIntegration: allIntegrationSt,
      aucValues,
      waveLength: waveLengthSt,
      cyclicvoltaSt,
      curveSt,
      axesUnitsSt,
      detectorSt,
      dscMetaData,
    };
    if (Format.isCyclicVoltaLayout(layoutSt)) {
      console.log('[CV submit] payload', payload);
    }
    operation(payload);
  }
);

const BtnSubmit = ({
  classes, operation, feature, isAscend, isIntensity,
  editPeakSt, thresSt, layoutSt, shiftSt, scanSt, forecastSt,
  decimalSt, integrationSt, multiplicitySt, allIntegrationSt,
  waveLengthSt, cyclicvoltaSt, curveSt, axesUnitsSt, detectorSt,
  metaSt,
}) => {
  const peaksEdit = extractPeaksEdit(feature, editPeakSt, thresSt, shiftSt, layoutSt);
  // const disBtn = peaksEdit.length === 0 || statusSt.btnSubmit || disabled;
  const scan = Convert2Scan(feature, scanSt);
  const thres = Convert2Thres(feature, thresSt);
  const aucValues = extractAreaUnderCurve(allIntegrationSt, integrationSt, layoutSt);
  const { dscMetaData } = metaSt;
  const isCvLayout = Format.isCyclicVoltaLayout(layoutSt);
  const { xLabel, yLabel } = resolveAxisLabels(
    feature?.xUnit,
    feature?.yUnit,
    axesUnitsSt,
    curveSt,
  );
  const axisDisplay = {
    xLabel,
    yLabel,
  };
  const cvDisplay = isCvLayout ? {
    mode: cyclicvoltaSt?.useCurrentDensity ? 'density' : 'current',
    yScaleFactor: computeCvYScaleFactor(feature, cyclicvoltaSt),
  } : null;
  const cyclicvoltaPayload = {
    ...cyclicvoltaSt,
    axisDisplay,
    cvDisplay,
  };

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
        onClick={onClickCb(
          operation.value, peaksEdit, isAscend, isIntensity,
          scan, thres, layoutSt, shiftSt, forecastSt.predictions, decimalSt,
          integrationSt, multiplicitySt, allIntegrationSt, aucValues, waveLengthSt,
          cyclicvoltaPayload, curveSt, axesUnitsSt, detectorSt, dscMetaData,
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
    thresSt: state.threshold.list[state.curve.curveIdx],
    layoutSt: state.layout,
    shiftSt: state.shift,
    scanSt: state.scan,
    forecastSt: state.forecast,
    decimalSt: state.submit.decimal,
    integrationSt: state.integration.present,
    multiplicitySt: state.multiplicity.present,
    allIntegrationSt: state.integration.past.concat(state.integration.present),
    waveLengthSt: state.wavelength,
    cyclicvoltaSt: state.cyclicvolta,
    curveSt: state.curve,
    axesUnitsSt: state.axesUnits,
    detectorSt: state.detector,
    metaSt: state.meta,
  }
);

const mapDispatchToProps = (dispatch) => (
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
  editPeakSt: PropTypes.object.isRequired,
  thresSt: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  shiftSt: PropTypes.object.isRequired,
  scanSt: PropTypes.object.isRequired,
  forecastSt: PropTypes.object.isRequired,
  decimalSt: PropTypes.number.isRequired,
  integrationSt: PropTypes.object.isRequired,
  multiplicitySt: PropTypes.object.isRequired,
  allIntegrationSt: PropTypes.object.isRequired,
  waveLengthSt: PropTypes.object.isRequired,
  cyclicvoltaSt: PropTypes.object.isRequired,
  curveSt: PropTypes.object,
  axesUnitsSt: PropTypes.object.isRequired,
  detectorSt: PropTypes.object.isRequired,
  metaSt: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(BtnSubmit);
