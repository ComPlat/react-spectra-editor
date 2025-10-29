/* eslint-disable no-mixed-operators, prefer-object-spread, react/function-component-definition */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '@mui/styles/withStyles';
import {
  Select, MenuItem, FormControl, InputLabel,
  Tooltip,
} from '@mui/material';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import FindReplaceOutlinedIcon from '@mui/icons-material/FindReplaceOutlined';
import { MuButton, commonStyle, focusStyle } from '../cmd_bar/common';

import {
  Topic2Seed, ToThresEndPts, convertThresEndPts,
} from '../../helpers/chem';
import { resetAll } from '../../actions/manager';
import {
  selectUiSweep, scrollUiWheel, clickUiTarget, setUiSweepType,
} from '../../actions/ui';
import { selectWavelength, changeTic, updateCurrentPageValue } from '../../actions/hplc_ms';
import { selectCurve } from '../../actions/curve';
import RectFocus from './rect_focus';
import MultiFocus from './multi_focus';
import LineFocus from './line_focus';
import { extractParams } from '../../helpers/extractParams';
import { findClosest } from '../../helpers/calc';
import {
  drawMain, drawLabel, drawDisplay, drawDestroy,
} from '../common/draw';
import { LIST_UI_SWEEP_TYPE, LIST_NON_BRUSH_TYPES } from '../../constants/list_ui';
import { LIST_ROOT_SVG_GRAPH, LIST_BRUSH_SVG_GRAPH } from '../../constants/list_graph';
import PeakGroup from '../cmd_bar/08_peak_group';
import Threshold from '../cmd_bar/r03_threshold';
import Integration from '../cmd_bar/04_integration';
import Peak from '../cmd_bar/03_peak';

const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.8 / 3); // ROI

const styles = () => (
  Object.assign(
    {},
    commonStyle,
  )
);

const zoomView = (classes, graphIndex, uiSt, zoomInAct) => {
  const onSweepZoomIn = () => {
    const payload = {
      graphIndex,
      sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN,
    };
    zoomInAct(payload);
  };

  const onSweepZoomReset = () => {
    const payload = {
      graphIndex,
      sweepType: LIST_UI_SWEEP_TYPE.ZOOMRESET,
    };
    zoomInAct(payload);
  };

  const { zoom } = uiSt;
  const { sweepTypes } = zoom;

  const isZoomFocus = sweepTypes[graphIndex] === LIST_UI_SWEEP_TYPE.ZOOMIN;

  return (
    <span className={classes.group} data-testid="Zoom">
      <Tooltip title={<span className="txt-sv-tp">Zoom In</span>}>
        <MuButton
          className={
            classNames(
              focusStyle(isZoomFocus, classes),
              'btn-sv-bar-zoomin',
            )
          }
          onClick={onSweepZoomIn}
        >
          <ZoomInOutlinedIcon className={classNames(classes.icon, classes.iconWp)} />
        </MuButton>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Reset Zoom</span>}>
        <MuButton
          className={
            classNames(
              'btn-sv-bar-zoomreset',
            )
          }
          onClick={onSweepZoomReset}
        >
          <FindReplaceOutlinedIcon className={classes.icon} />
        </MuButton>
      </Tooltip>
    </span>
  );
};

const waveLengthSelect = (classes, hplcMsSt, updateWaveLengthAct) => {
  const uvvis = (hplcMsSt && hplcMsSt.uvvis) || {};
  const { listWaveLength = null, selectedWaveLength } = uvvis;
  const options = listWaveLength ? listWaveLength.map((d) => (
    <MenuItem value={d} key={d}>
      <span className={classNames(classes.txtOpt, 'option-sv-bar-decimal')}>
        {d}
      </span>
    </MenuItem>
  )) : [];

  return (
    <FormControl
      className={classNames(classes.fieldDecimal)}
      variant="outlined"
      style={{ width: '80px' }}
    >
      <InputLabel id="select-decimal-label" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        Wavelength
      </InputLabel>
      <Select
        labelId="select-decimal-label"
        label="Decimal"
        value={selectedWaveLength}
        onChange={updateWaveLengthAct}
        className={classNames(classes.selectInput, 'input-sv-bar-decimal')}
      >
        { options }
      </Select>
    </FormControl>
  );
};

const ticSelect = (classes, hplcMsSt, handleTicChanged) => {
  const { tic } = hplcMsSt;
  const { isNegative } = tic;
  const listTIC = [{ name: 'PLUS', value: 0 }, { name: 'MINUS', value: 1 }];
  const options = listTIC.map((d) => (
    <MenuItem value={d.value} key={d.value}>
      <span className={classNames(classes.txtOpt, 'option-sv-bar-decimal')}>
        {d.name}
      </span>
    </MenuItem>
  ));

  const onTicChange = (event) => {
    handleTicChanged(event);
  };

  return (
    <FormControl
      className={classNames(classes.fieldDecimal)}
      variant="outlined"
      style={{ width: '80px' }}
    >
      <InputLabel id="select-decimal-label" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        TIC
      </InputLabel>
      <Select
        labelId="select-decimal-label"
        label="Decimal"
        value={isNegative ? 1 : 0}
        onChange={onTicChange}
        className={classNames(classes.selectInput, 'input-sv-bar-decimal')}
      >
        { options }
      </Select>
    </FormControl>
  );
};
class ViewerLineRect extends React.Component {
  constructor(props) {
    super(props);

    const {
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      ticEntities,
      uvvisEntities,
      uiSt,
    } = props;

    this.rootKlassLine = `.${LIST_ROOT_SVG_GRAPH.LINE}`;
    this.lineFocus = new LineFocus({
      W,
      H,
      uvvisEntities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      graphIndex: 0,
      uiSt,
    });

    this.rootKlassMulti = `.${LIST_ROOT_SVG_GRAPH.MULTI}`;
    this.multiFocus = new MultiFocus({
      W,
      H,
      ticEntities,
      clickUiTargetAct,
      selectUiSweepAct,
      scrollUiWheelAct,
      graphIndex: 1,
      uiSt,
    });

    this.rootKlassRect = `.${LIST_ROOT_SVG_GRAPH.RECT}`;
    this.rectFocus = new RectFocus({
      W, H, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct, graphIndex: 2, uiSt,
    });

    this.normChange = this.normChange.bind(this);
    this.extractSubView = this.extractSubView.bind(this);
    this.extractUvvisView = this.extractUvvisView.bind(this);
  }

  componentDidMount() {
    const {
      curveSt, seed, cLabel, feature, ticEntities,
      tTrEndPts, layoutSt,
      isUiAddIntgSt, isUiNoBrushSt,
      integationSt,
      isHidden,
      resetAllAct, uiSt,
      editPeakSt,
    } = this.props;
    drawDestroy(this.rootKlassMulti);
    drawDestroy(this.rootKlassLine);
    drawDestroy(this.rootKlassRect);
    resetAllAct(feature);

    const { zoom } = uiSt;
    const { sweepExtent } = zoom;

    const uvvisViewFeature = this.extractUvvisView();
    if (!uvvisViewFeature || !uvvisViewFeature.data || uvvisViewFeature.data.length === 0) {
      return;
    }
    const { data } = uvvisViewFeature;
    const currentData = data[0];
    const { x, y } = currentData;
    const uvvisSeed = x.map((d, index) => {
      const s = { x: d, y: y[index] };
      return s;
    });
    drawMain(this.rootKlassLine, W, H, LIST_BRUSH_SVG_GRAPH.LINE);
    this.lineFocus.create({
      filterSeed: uvvisSeed,
      filterPeak: [],
      tTrEndPts,
      isUiNoBrushSt: true,
      sweepExtentSt: sweepExtent[0],
      integationSt,
      isUiAddIntgSt,
      editPeakSt,
    });
    drawLabel(this.rootKlassLine, null, 'Minutes', 'Intensity');
    drawDisplay(this.rootKlassLine, false);

    drawMain(this.rootKlassMulti, W, H, LIST_BRUSH_SVG_GRAPH.MULTI);
    this.multiFocus.create({
      ticEntities,
      curveSt,
      tTrEndPts,
      layoutSt,
      sweepExtentSt: sweepExtent[1],
      isUiAddIntgSt,
      isUiNoBrushSt,
    });
    drawLabel(this.rootKlassMulti, cLabel, 'Minutes', 'Intensity');
    drawDisplay(this.rootKlassMulti, isHidden);

    drawMain(this.rootKlassRect, W, H, LIST_BRUSH_SVG_GRAPH.RECT);
    this.rectFocus.create({
      filterSeed: [],
      filterPeak: [],
      tTrEndPts,
      isUiNoBrushSt: true,
      sweepExtentSt: sweepExtent[2],
    });
    drawLabel(this.rootKlassRect, null, 'm/z', 'Intensity');
    drawDisplay(this.rootKlassRect, false);
  }

  componentDidUpdate(prevProps) {
    const {
      ticEntities, curveSt, cLabel,
      tTrEndPts, layoutSt,
      isUiAddIntgSt, isUiNoBrushSt,
      isHidden, uiSt, hplcMsSt, integationSt,
      editPeakSt,
    } = this.props;
    this.normChange(prevProps);
    const { zoom } = uiSt;
    const { sweepExtent } = zoom;

    const uvvisViewFeature = this.extractUvvisView();
    if (uvvisViewFeature) {
      const { data } = uvvisViewFeature;
      const currentData = data[0];
      const { x, y } = currentData;
      const uvvisSeed = x.map((d, index) => {
        const s = { x: d, y: y[index] };
        return s;
      });
      if (this.lineFocus) {
        this.lineFocus.update({
          filterSeed: uvvisSeed,
          filterPeak: [],
          tTrEndPts,
          isUiNoBrushSt: true,
          isUiAddIntgSt,
          sweepExtentSt: sweepExtent[0],
          uiSt,
          layoutSt,
          integationSt,
          hplcMsSt,
          editPeakSt,
        });
      }
      drawLabel(this.rootKlassLine, null, 'Minutes', 'Intensity');
      drawDisplay(this.rootKlassLine, false);
    }

    if (this.multiFocus) {
      this.multiFocus.update({
        curveSt,
        ticEntities,
        tTrEndPts,
        layoutSt,
        sweepExtentSt: sweepExtent[1],
        isUiAddIntgSt,
        isUiNoBrushSt,
        uiSt,
        editPeakSt,
      });
    }
    const { isNegative } = hplcMsSt.tic;
    drawLabel(this.rootKlassMulti, isNegative ? 'MINUS' : 'PLUS', 'Minutes', 'Intensity');
    drawDisplay(this.rootKlassMulti, isHidden);

    const subViewFeature = this.extractSubView();
    if (subViewFeature) {
      const { threshold } = hplcMsSt;
      const curTrEndPts = convertThresEndPts(subViewFeature, threshold.value);
      const { data, pageValue } = subViewFeature;
      const currentData = data[0];
      const { x, y } = currentData;
      const subSeed = x.map((d, index) => {
        const s = { x: d, y: y[index] };
        return s;
      });
      if (this.rectFocus) {
        this.rectFocus.update({
          filterSeed: subSeed,
          filterPeak: [],
          tTrEndPts: curTrEndPts,
          isUiNoBrushSt: true,
          sweepExtentSt: sweepExtent[2],
          uiSt,
        });
      }
      drawLabel(this.rootKlassRect, `${pageValue} min`, 'm/z', 'Intensity');
      drawDisplay(this.rootKlassRect, false);
    }
  }

  componentWillUnmount() {
    drawDestroy(this.rootKlassMulti);
  }

  normChange(prevProps) {
    const { feature } = this.props;
    const oldFeature = prevProps.feature;
    if (oldFeature !== feature) {
      // resetAllAct(feature);
    }
  }

  extractUvvisView() {
    const { uvvisEntities, hplcMsSt } = this.props;
    if (!uvvisEntities || !uvvisEntities[0]) {
      return null;
    }
    const { features } = extractParams(uvvisEntities[0], 0, 1);
    if (!features || features.length === 0) {
      return null;
    }
    const { uvvis } = hplcMsSt;
    const { wavelengthIdx } = uvvis;
    if (wavelengthIdx < 0 || wavelengthIdx >= features.length) {
      return null;
    }
    return features[wavelengthIdx];
  }

  extractSubView() {
    const {
      uiSt, mzEntities, hplcMsSt, updateCurrentPageValueAct,
    } = this.props;
    const { tic } = hplcMsSt;
    const { isNegative } = tic;
    const entityIdx = isNegative ? 1 : 0;
    if (!mzEntities || !mzEntities[entityIdx] || !mzEntities[entityIdx].layout) {
      return null;
    }
    const { subViewerAt } = uiSt;
    const { features } = extractParams(mzEntities[entityIdx], 0, 1);
    if (!features || features.length === 0) return null;

    const arrPageValues = features.map((fe) => fe.pageValue);
    const hasValidClick = subViewerAt && subViewerAt.x !== undefined;
    const closestPage = hasValidClick
      ? findClosest(arrPageValues, subViewerAt.x)
      : arrPageValues[Math.floor(arrPageValues.length / 2)];

    if (closestPage !== hplcMsSt.tic.currentPageValue) {
      updateCurrentPageValueAct(closestPage);
    }

    const [selectFeature] = features.filter((fe) => fe.pageValue === closestPage);
    return selectFeature;
  }

  render() {
    const {
      classes, hplcMsSt, selectWavelengthAct, updateTicAct, selectCurveAct,
      feature, zoomInAct, uiSt,
    } = this.props;
    const handleTicChanged = (event) => {
      updateTicAct(event);
      selectCurveAct(event.target.value);
    };
    const handleWaveLengthChange = (event) => {
      [0, 1, 2].forEach((gi) =>
        zoomInAct({ graphIndex: gi, sweepType: LIST_UI_SWEEP_TYPE.ZOOMRESET })
      );
      selectWavelengthAct(event);
    };
    return (
      <div>
        {
          zoomView(classes, 0, uiSt, zoomInAct)
        }
        {
          waveLengthSelect(classes, hplcMsSt, handleWaveLengthChange)
        }
        <Integration />
        <Peak />
        <div className={LIST_ROOT_SVG_GRAPH.LINE} />
        <PeakGroup feature={feature} graphIndex={1} />
        {
          zoomView(classes, 1, uiSt, zoomInAct)
        }
        {
          ticSelect(classes, hplcMsSt, handleTicChanged)
        }
        <div className={LIST_ROOT_SVG_GRAPH.MULTI} />
        {
          zoomView(classes, 2, uiSt, zoomInAct)
        }
        <Threshold />
        <div className={LIST_ROOT_SVG_GRAPH.RECT} />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => (
  {
    curveSt: state.curve,
    seed: Topic2Seed(state, props),
    tTrEndPts: ToThresEndPts(state, props),
    isUiAddIntgSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
    isUiNoBrushSt: LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
    uiSt: state.ui,
    layoutSt: state.layout,
    hplcMsSt: state.hplcMs,
    editPeakSt: state.editPeak.present,
    integationSt: state.integration.present,
    sweepExtentSt: state.ui.sweepExtent,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    resetAllAct: resetAll,
    clickUiTargetAct: clickUiTarget,
    selectUiSweepAct: selectUiSweep,
    scrollUiWheelAct: scrollUiWheel,
    selectWavelengthAct: selectWavelength,
    updateTicAct: changeTic,
    selectCurveAct: selectCurve,
    zoomInAct: setUiSweepType,
    updateCurrentPageValueAct: updateCurrentPageValue,
  }, dispatch)
);

ViewerLineRect.propTypes = {
  classes: PropTypes.object.isRequired,
  uiSt: PropTypes.object.isRequired,
  curveSt: PropTypes.object.isRequired,
  ticEntities: PropTypes.array.isRequired,
  uvvisEntities: PropTypes.array.isRequired,
  mzEntities: PropTypes.array.isRequired,
  seed: PropTypes.array.isRequired,
  cLabel: PropTypes.string.isRequired,
  layoutSt: PropTypes.string.isRequired,
  integationSt: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  tTrEndPts: PropTypes.array.isRequired,
  isUiAddIntgSt: PropTypes.bool.isRequired,
  isUiNoBrushSt: PropTypes.bool.isRequired,
  resetAllAct: PropTypes.func.isRequired,
  clickUiTargetAct: PropTypes.func.isRequired,
  selectUiSweepAct: PropTypes.func.isRequired,
  scrollUiWheelAct: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired,
  hplcMsSt: PropTypes.object.isRequired,
  selectWavelengthAct: PropTypes.func.isRequired,
  updateTicAct: PropTypes.func.isRequired,
  selectCurveAct: PropTypes.func.isRequired,
  zoomInAct: PropTypes.func.isRequired,
  editPeakSt: PropTypes.object.isRequired,
  updateCurrentPageValueAct: PropTypes.func.isRequired,
};

// export default connect(mapStateToProps, mapDispatchToProps)(ViewerLineRect);
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ViewerLineRect);
