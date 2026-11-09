/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, function-call-argument-newline,
react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { compose } from 'redux';

import Tooltip from '@mui/material/Tooltip';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { withStyles } from '@mui/styles';

import {
  Convert2Scan, Convert2Thres,
} from '../../helpers/chem';
import { MuButton, commonStyle } from './common';
import {
  extractPeaksEdit,
  formatLcmsPeaksForBackend,
  formatLcmsIntegralsForBackend,
  getLcmsMzPageData,
} from '../../helpers/extractPeaksEdit';
import Format from '../../helpers/format';
import { shiftEntryAtIndex, listEntryAtIndex } from '../../helpers/shift';

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
  return axes[idx] || axes[0] || {
    xUnit: '',
    yUnit: '',
  };
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

export const computeCvYScaleFactor = (feature, cyclicvoltaSt) => {
  if (!cyclicvoltaSt?.useCurrentDensity) return 1.0;
  const rawArea = (cyclicvoltaSt.areaValue === '' ? 1.0 : cyclicvoltaSt.areaValue) || 1.0;
  const areaUnit = cyclicvoltaSt.areaUnit || 'cm²';
  const safeArea = rawArea > 0 ? rawArea : 1.0;
  // areaInCm2 already converts mm² → cm², so factor is A/cm². Do NOT divide by 100 again.
  const areaInCm2 = areaUnit === 'mm²' ? (safeArea / 100.0) : safeArea;
  let factor = 1.0 / areaInCm2;
  const baseY = feature && feature.yUnit ? String(feature.yUnit) : 'A';
  if (/mA/i.test(baseY)) {
    factor *= 1000.0;
  }
  return factor;
};

const defaultThreshold = {
  isEdit: true,
  value: false,
  upper: false,
  lower: false,
};

const LCMS_INTEGRATIONS_EXPORT_MODES = ['percent', 'area', 'both'];
const isLcmsIntegrationsExportMode = (v) => LCMS_INTEGRATIONS_EXPORT_MODES.includes(v);

const resolveLcmsIntegrationsExportForSubmit = (analysis, hplcMsSt) => {
  if (isLcmsIntegrationsExportMode(analysis?.lcmsIntegrationsExport)) {
    return analysis.lcmsIntegrationsExport;
  }
  if (analysis?.lcmsIncludeIntegrationArea === true) {
    return 'both';
  }
  if (isLcmsIntegrationsExportMode(hplcMsSt?.lcmsIntegrationsExport)) {
    return hplcMsSt.lcmsIntegrationsExport;
  }
  return 'percent';
};

const emptyIntegration = {
  stack: [],
  refArea: 1,
  refFactor: 1,
  shift: 0,
  edited: false,
};

const emptyMultiplicity = {
  stack: [],
  shift: 0,
  smExtext: false,
  edited: false,
};

const hasBoolean = (value) => typeof value === 'boolean';

const resolveOptionalBooleanFlags = (analysis) => {
  const flags = {};
  if (hasBoolean(analysis?.keepPred)) flags.keepPred = analysis.keepPred;
  if (hasBoolean(analysis?.simulatenmr)) flags.simulatenmr = analysis.simulatenmr;
  return flags;
};

const buildSpectrumPayload = ({
  feature,
  curveIdx,
  editPeakSt,
  thresList,
  shiftSt,
  layoutSt,
  scanSt,
  integrationSt,
  multiplicitySt,
  waveLengthSt,
  cyclicvoltaSt,
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
  const shift = shiftEntryAtIndex(shiftSt, curveIdx);
  const integration = listEntryAtIndex(
    integrationSt?.integrations, curveIdx, emptyIntegration,
  );
  const multiplicity = listEntryAtIndex(
    multiplicitySt?.multiplicities, curveIdx, emptyMultiplicity,
  );
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
  const optionalBooleanFlags = resolveOptionalBooleanFlags(analysis);

  return {
    peaks: peaksEdit,
    layout: layoutSt,
    xUnit: xLabel,
    shift,
    scan,
    thres,
    isAscend,
    isIntensity,
    analysis,
    decimal: decimalSt,
    integration,
    multiplicity,
    waveLength: waveLengthSt,
    cyclicvoltaSt: cyclicvoltaPayload,
    curveSt: { curveIdx },
    axesUnitsSt,
    detectorSt,
    dscMetaData,
    feature,
    ...optionalBooleanFlags,
  };
};

const onClickCb = (
  operationValue, isAscend, isIntensity,
  layoutSt, shiftSt, analysis, decimalSt,
  integrationSt, multiplicitySt, waveLengthSt,
  cyclicvoltaSt, curveSt, axesUnitsSt, detectorSt, dscMetaData,
  curveList, editPeakSt, thresList, scanSt, feature, hplcMsSt, sweepExtentSt,
) => (
  () => {
    const defaultCurves = feature ? [{ feature }] : [];
    let curves = Array.isArray(curveList) && curveList.length > 0 ? curveList : defaultCurves;
    if (layoutSt === 'LC/MS') {
      curves = curves.filter((c) => c.lcmsKind === 'uvvis');
      if (curves.length === 0) curves = defaultCurves;
    }
    const fallbackIdx = Number.isFinite(curveSt?.curveIdx) ? curveSt.curveIdx : 0;
    const indicesToSend = curves.length > 0
      ? curves.map((_, index) => index)
      : [fallbackIdx];
    let lcmsGlobalFields = null;
    if (layoutSt === 'LC/MS') {
      const lcmsIntegrationsExport = resolveLcmsIntegrationsExportForSubmit(
        analysis,
        hplcMsSt,
      );
      lcmsGlobalFields = {
        lcms_peaks: formatLcmsPeaksForBackend(hplcMsSt),
        lcms_integrals: formatLcmsIntegralsForBackend(hplcMsSt),
        lcms_integrations_export: lcmsIntegrationsExport,
        lcms_peaks_text: Format.formatedLCMS(hplcMsSt, isAscend, decimalSt, {
          lcmsIntegrationsExport,
        }),
        lcms_uvvis_wavelength: hplcMsSt?.uvvis?.selectedWaveLength ?? null,
        lcms_mz_page: hplcMsSt?.tic?.currentPageValue ?? null,
        lcms_mz_page_data: getLcmsMzPageData(hplcMsSt),
      };
    }
    const spectraList = indicesToSend.map((curveIdx) => {
      const curve = curves[curveIdx] || {};
      const curveFeature = curve.feature || feature;
      const spectrumPayload = buildSpectrumPayload({
        feature: curveFeature,
        curveIdx,
        editPeakSt,
        thresList,
        shiftSt,
        layoutSt,
        scanSt,
        integrationSt,
        multiplicitySt,
        waveLengthSt,
        cyclicvoltaSt,
        axesUnitsSt,
        detectorSt,
        dscMetaData,
        isAscend,
        isIntensity,
        analysis,
        decimalSt,
      });
      if (lcmsGlobalFields && curve.lcmsKind === 'uvvis') {
        return { ...spectrumPayload, ...lcmsGlobalFields };
      }
      return spectrumPayload;
    });
    const selectedIdx = Number.isFinite(curveSt?.curveIdx) ? curveSt.curveIdx : 0;
    const selectedSpectrumPayload = spectraList[selectedIdx] || spectraList[0] || {};
    const payload = {
      ...selectedSpectrumPayload,
      spectra_list: spectraList,
    };
    if (lcmsGlobalFields) {
      Object.assign(payload, lcmsGlobalFields);
    }
    if (Number.isFinite(curveSt?.curveIdx)) {
      payload.curveSt = { curveIdx: curveSt.curveIdx };
    }
    if (sweepExtentSt?.xExtent || sweepExtentSt?.yExtent) {
      payload.sweepExtent = sweepExtentSt;
    }
    operationValue(payload);
  }
);

const BtnSubmit = ({
  classes, operation, feature, isAscend, isIntensity,
  editPeakSt, thresList, layoutSt, shiftSt, scanSt, forecastSt,
  decimalSt, integrationSt, multiplicitySt,
  waveLengthSt, cyclicvoltaSt, curveSt, curveList, axesUnitsSt, detectorSt,
  metaSt,
  hplcMsSt,
  sweepExtentSt,
  disabled, className, children,
}) => {
  // const disBtn = peaksEdit.length === 0 || statusSt.btnSubmit || disabled;
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
    <Tooltip title={<span className="txt-sv-tp">{operation.name || 'Submit'}</span>}>
      <MuButton
        className={
          classNames(
            'btn-sv-bar-submit',
            className,
          )
        }
        color="primary"
        disabled={disabled}
        onClick={onClickCb(
          operation.value, isAscend, isIntensity,
          layoutSt, shiftSt, forecastSt.predictions, decimalSt,
          integrationSt, multiplicitySt, waveLengthSt,
          cyclicvoltaPayload, curveSt, axesUnitsSt, detectorSt, dscMetaData,
          curveList, editPeakSt, thresList, scanSt, feature, hplcMsSt, sweepExtentSt,
        )}
      >
        {children || <PlayCircleOutlineIcon className={classes.icon} />}
      </MuButton>
    </Tooltip>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    editPeakSt: state.editPeak.present,
    thresList: state.threshold.list,
    layoutSt: state.layout,
    shiftSt: state.shift,
    scanSt: state.scan,
    forecastSt: state.forecast,
    decimalSt: state.submit.decimal,
    integrationSt: state.integration.present,
    multiplicitySt: state.multiplicity.present,
    waveLengthSt: state.wavelength,
    cyclicvoltaSt: state.cyclicvolta,
    curveSt: state.curve,
    curveList: state.curve.listCurves,
    axesUnitsSt: state.axesUnits,
    detectorSt: state.detector,
    metaSt: state.meta,
    hplcMsSt: state.hplcMs,
    sweepExtentSt: state.ui.sweepExtent,
  }
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
  thresList: PropTypes.array.isRequired,
  layoutSt: PropTypes.string.isRequired,
  shiftSt: PropTypes.object.isRequired,
  scanSt: PropTypes.object.isRequired,
  forecastSt: PropTypes.object.isRequired,
  decimalSt: PropTypes.number.isRequired,
  integrationSt: PropTypes.object.isRequired,
  multiplicitySt: PropTypes.object.isRequired,
  waveLengthSt: PropTypes.object.isRequired,
  cyclicvoltaSt: PropTypes.object.isRequired,
  curveSt: PropTypes.object,
  curveList: PropTypes.array.isRequired,
  axesUnitsSt: PropTypes.object.isRequired,
  detectorSt: PropTypes.object.isRequired,
  metaSt: PropTypes.object.isRequired,
  hplcMsSt: PropTypes.object,
  sweepExtentSt: PropTypes.object,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

BtnSubmit.defaultProps = {
  hplcMsSt: {},
};

export default compose(
  connect(mapStateToProps, null),
  withStyles(styles),
)(BtnSubmit);
