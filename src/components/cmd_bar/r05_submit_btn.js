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

const getAxesSelection = (axesUnitsSt, curveIdx) => {
  const axes = axesUnitsSt?.axes;
  if (!Array.isArray(axes) || axes.length === 0) return { xUnit: '', yUnit: '' };
  const idx = Number.isFinite(curveIdx) ? curveIdx : 0;
  return axes[idx] || axes[0] || { xUnit: '', yUnit: '' };
};

const resolveAxisLabels = (xLabel, yLabel, axesUnitsSt, curveIdx) => {
  const { xUnit, yUnit } = getAxesSelection(axesUnitsSt, curveIdx);
  return {
    xLabel: xUnit === '' ? xLabel : xUnit,
    yLabel: yUnit === '' ? yLabel : yUnit,
  };
};

const getBaseCurrentUnit = (label) => (/mA/i.test(String(label)) ? 'mA' : 'A');

const buildCvAxisYLabel = (yLabel, cyclicvoltaSt) => {
  const baseUnit = getBaseCurrentUnit(yLabel);
  const areaUnit = cyclicvoltaSt?.areaUnit || 'cm²';
  if (cyclicvoltaSt?.useCurrentDensity) {
    return `Current density in ${baseUnit}/${areaUnit}`;
  }
  return `Current in ${baseUnit}`;
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

const defaultThreshold = {
  isEdit: true,
  value: false,
  upper: false,
  lower: false,
};

const pickFromList = (list, index, fallback = null) => (
  Array.isArray(list) && list[index] !== undefined ? list[index] : fallback
);

const buildDstPayload = ({
  feature,
  curveIdx,
  editPeakSt,
  thresList,
  shiftSt,
  layoutSt,
  scanSt,
  integrationSt,
  multiplicitySt,
  allIntegrationSt,
  aucValues,
  waveLengthSt,
  cyclicvoltaSt,
  curveSt,
  axesUnitsSt,
  detectorSt,
  dscMetaData,
  isAscend,
  isIntensity,
  analysis,
  decimalSt,
}) => {
  const threshold = thresList?.[curveIdx] || thresList?.[0] || defaultThreshold;
  const editPeakAtIndex = Object.assign({}, editPeakSt, { selectedIdx: curveIdx });
  const peaksEdit = extractPeaksEdit(
    feature,
    editPeakAtIndex,
    threshold,
    shiftSt,
    layoutSt,
    curveIdx,
  );
  const scan = Convert2Scan(feature, scanSt);
  const thres = Convert2Thres(feature, threshold);
  const integration = pickFromList(integrationSt?.integrations, curveIdx, integrationSt);
  const multiplicity = pickFromList(multiplicitySt?.multiplicities, curveIdx, multiplicitySt);
  const { xLabel, yLabel } = resolveAxisLabels(
    feature?.xUnit,
    feature?.yUnit,
    axesUnitsSt,
    curveIdx,
  );
  const axisYLabel = Format.isCyclicVoltaLayout(layoutSt)
    ? buildCvAxisYLabel(yLabel, cyclicvoltaSt)
    : yLabel;
  const axisDisplay = {
    xLabel,
    yLabel: axisYLabel,
  };
  const cvDisplay = Format.isCyclicVoltaLayout(layoutSt) ? {
    mode: cyclicvoltaSt?.useCurrentDensity ? 'density' : 'current',
    yScaleFactor: computeCvYScaleFactor(feature, cyclicvoltaSt),
  } : null;
  const cyclicvoltaPayload = {
    ...cyclicvoltaSt,
    axisDisplay,
    cvDisplay,
  };
  const perCurveSt = Object.assign({}, curveSt, { curveIdx });

  return {
    peaks: peaksEdit,
    layout: layoutSt,
    shift: shiftSt,
    scan,
    thres,
    isAscend,
    isIntensity,
    analysis,
    decimal: decimalSt,
    integration,
    multiplicity,
    allIntegration: allIntegrationSt,
    aucValues,
    waveLength: waveLengthSt,
    cyclicvoltaSt: cyclicvoltaPayload,
    curveSt: perCurveSt,
    axesUnitsSt,
    detectorSt,
    dscMetaData,
  };
};

const onClickCb = (
  operation, peaksEdit, isAscend, isIntensity,
  scan, thres, layoutSt, shiftSt, analysis, decimalSt,
  integrationSt, multiplicitySt, allIntegrationSt, aucValues, waveLengthSt,
  cyclicvoltaSt, curveSt, axesUnitsSt, detectorSt, dscMetaData,
  curveList, editPeakSt, thresList, scanSt, feature,
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
    const defaultCurves = feature ? [{ feature }] : [];
    const curves = Array.isArray(curveList) && curveList.length > 0 ? curveList : defaultCurves;
    const fallbackIdx = Number.isFinite(curveSt?.curveIdx) ? curveSt.curveIdx : 0;
    const indicesToSend = curves.length > 0
      ? curves.map((_, index) => index)
      : [fallbackIdx];
    payload.dst_list = indicesToSend.map((curveIdx) => {
      const curve = curves[curveIdx] || {};
      const curveFeature = curve.feature || feature;
      return buildDstPayload({
        feature: curveFeature,
        curveIdx,
        editPeakSt,
        thresList,
        shiftSt,
        layoutSt,
        scanSt,
        integrationSt,
        multiplicitySt,
        allIntegrationSt,
        aucValues,
        waveLengthSt,
        cyclicvoltaSt,
        curveSt,
        axesUnitsSt,
        detectorSt,
        dscMetaData,
        isAscend,
        isIntensity,
        analysis,
        decimalSt,
      });
    });
    if (Format.isCyclicVoltaLayout(layoutSt)) {
      console.log('[CV submit] payload', payload);
    }
    operation(payload);
  }
);

const BtnSubmit = ({
  classes, operation, feature, isAscend, isIntensity,
  editPeakSt, thresSt, thresList, layoutSt, shiftSt, scanSt, forecastSt,
  decimalSt, integrationSt, multiplicitySt, allIntegrationSt,
  waveLengthSt, cyclicvoltaSt, curveSt, curveList, axesUnitsSt, detectorSt,
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
    curveSt?.curveIdx,
  );
  const axisYLabel = isCvLayout ? buildCvAxisYLabel(yLabel, cyclicvoltaSt) : yLabel;
  const axisDisplay = {
    xLabel,
    yLabel: axisYLabel,
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
          curveList, editPeakSt, thresList, scanSt, feature,
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
    thresList: state.threshold.list,
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
    curveList: state.curve.listCurves,
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
  thresList: PropTypes.array.isRequired,
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
  curveList: PropTypes.array.isRequired,
  axesUnitsSt: PropTypes.object.isRequired,
  detectorSt: PropTypes.object.isRequired,
  metaSt: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(BtnSubmit);
