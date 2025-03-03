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
import { selectWavelength, changeTic } from '../../actions/hplcms';
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
  const { uvvis } = hplcMsSt;
  const { listWaveLength, selectedWaveLength } = uvvis;
  const options = listWaveLength.map((d) => (
    <MenuItem value={d} key={d}>
      <span className={classNames(classes.txtOpt, 'option-sv-bar-decimal')}>
        {d}
      </span>
    </MenuItem>
  ));

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

const ticSelect = (classes, hplcMsSt, updateTicAct) => {
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

  return (
    <FormControl
      className={classNames(classes.fieldDecimal)}
      variant="outlined"
      style={{ position: 'absolute' }}
    >
      <InputLabel id="select-decimal-label" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        TIC
      </InputLabel>
      <Select
        labelId="select-decimal-label"
        label="Decimal"
        value={isNegative ? 1 : 0}
        onChange={updateTicAct}
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
      clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct, entities,
    } = props;

    this.rootKlassLine = `.${LIST_ROOT_SVG_GRAPH.LINE}`;
    this.lineFocus = new LineFocus({
      W, H, entities, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct,
    });

    this.rootKlassMulti = `.${LIST_ROOT_SVG_GRAPH.MULTI}`;
    this.multiFocus = new MultiFocus({
      W, H, entities, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct,
    });

    this.rootKlassRect = `.${LIST_ROOT_SVG_GRAPH.RECT}`;
    this.rectFocus = new RectFocus({
      W, H, clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct,
    });

    this.normChange = this.normChange.bind(this);
    this.extractSubView = this.extractSubView.bind(this);
    this.extractUvvisView = this.extractUvvisView.bind(this);
  }

  componentDidMount() {
    const {
      entities, curveSt, seed, cLabel, feature,
      tTrEndPts, layoutSt,
      isUiAddIntgSt, isUiNoBrushSt,
      isHidden,
      resetAllAct, uiSt,
    } = this.props;
    drawDestroy(this.rootKlassMulti);
    drawDestroy(this.rootKlassLine);
    drawDestroy(this.rootKlassRect);
    resetAllAct(feature);

    const { zoom } = uiSt;
    const { sweepExtent } = zoom;

    const uvvisViewFeature = this.extractUvvisView();
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
    });
    drawLabel(this.rootKlassLine, null, 'Minutes', 'Intensity');
    drawDisplay(this.rootKlassLine, false);

    const filterSeed = seed;

    drawMain(this.rootKlassMulti, W, H, LIST_BRUSH_SVG_GRAPH.MULTI);
    this.multiFocus.create({
      entities,
      curveSt,
      filterSeed,
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
    drawLabel(this.rootKlassRect, null, 'M/Z', 'Intensity');
    drawDisplay(this.rootKlassRect, false);
  }

  componentDidUpdate(prevProps) {
    const {
      entities, curveSt, seed, cLabel,
      tTrEndPts, layoutSt,
      isUiAddIntgSt, isUiNoBrushSt,
      isHidden, uiSt, hplcMsSt,
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
      this.lineFocus.update({
        filterSeed: uvvisSeed,
        filterPeak: [],
        tTrEndPts,
        isUiNoBrushSt: true,
        sweepExtentSt: sweepExtent[0],
      });
      drawLabel(this.rootKlassLine, null, 'Minutes', 'Intensity');
      drawDisplay(this.rootKlassLine, false);
    }

    const filterSeed = seed;

    this.multiFocus.update({
      entities,
      curveSt,
      filterSeed,
      tTrEndPts,
      layoutSt,
      sweepExtentSt: sweepExtent[1],
      isUiAddIntgSt,
      isUiNoBrushSt,
    });
    drawLabel(this.rootKlassMulti, cLabel, 'Minutes', 'Intensity');
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
      this.rectFocus.update({
        filterSeed: subSeed,
        filterPeak: [],
        tTrEndPts: curTrEndPts,
        isUiNoBrushSt: true,
        sweepExtentSt: sweepExtent[2],
      });
      drawLabel(this.rootKlassRect, `${pageValue} min`, 'M/Z', 'Intensity');
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
    const { subEntities, hplcMsSt } = this.props;
    const {
      features,
    } = extractParams(subEntities[0], 0, 1);
    const { uvvis } = hplcMsSt;
    const { wavelengthIdx } = uvvis;
    return features[wavelengthIdx];
  }

  extractSubView() {
    const { uiSt, subEntities, hplcMsSt } = this.props;
    const { tic } = hplcMsSt;
    const { isNegative } = tic;
    const entityIdx = isNegative ? 2 : 1;
    const { subViewerAt } = uiSt;
    const { features } = extractParams(subEntities[entityIdx], 0, 1);
    if (features.length === 0) return null;

    const arrPageValues = features.map((fe) => fe.pageValue);
    const hasValidClick = subViewerAt && subViewerAt.x !== undefined;
    const closestPage = hasValidClick
      ? findClosest(arrPageValues, subViewerAt.x)
      : arrPageValues[Math.floor(arrPageValues.length / 2)];
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
    return (
      <div>
        {
          zoomView(classNames, 0, uiSt, zoomInAct)
        }
        {
          waveLengthSelect(classes, hplcMsSt, selectWavelengthAct)
        }
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
    hplcMsSt: state.hplcMs,
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
  }, dispatch)
);

ViewerLineRect.propTypes = {
  classes: PropTypes.object.isRequired,
  uiSt: PropTypes.object.isRequired,
  curveSt: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  subEntities: PropTypes.array.isRequired,
  seed: PropTypes.array.isRequired,
  cLabel: PropTypes.string.isRequired,
  layoutSt: PropTypes.string.isRequired,
  feature: PropTypes.object.isRequired,
  tTrEndPts: PropTypes.array.isRequired,
  isUiAddIntgSt: PropTypes.bool.isRequired,
  isUiNoBrushSt: PropTypes.bool.isRequired,
  resetAllAct: PropTypes.func.isRequired,
  clickUiTargetAct: PropTypes.func.isRequired,
  selectUiSweepAct: PropTypes.func.isRequired,
  scrollUiWheelAct: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired,
  hplcMsSt: PropTypes.bool.isRequired,
  selectWavelengthAct: PropTypes.func.isRequired,
  updateTicAct: PropTypes.func.isRequired,
  selectCurveAct: PropTypes.func.isRequired,
  zoomInAct: PropTypes.func.isRequired,
};

// export default connect(mapStateToProps, mapDispatchToProps)(ViewerLineRect);
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ViewerLineRect);
