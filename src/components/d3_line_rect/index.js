/* eslint-disable no-mixed-operators, prefer-object-spread, react/function-component-definition */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '@mui/styles/withStyles';
import {
  Select, MenuItem, FormControl, InputLabel,
  Tooltip, CircularProgress,
} from '@mui/material';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import FindReplaceOutlinedIcon from '@mui/icons-material/FindReplaceOutlined';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { MuButton, commonStyle, focusStyle } from '../cmd_bar/common';

import {
  ToThresEndPts, convertThresEndPts,
} from '../../helpers/chem';
import { resetAll } from '../../actions/manager';
import {
  selectUiSweep, scrollUiWheel, clickUiTarget, setUiSweepType,
} from '../../actions/ui';
import {
  selectWavelength, changeTic, updateCurrentPageValue, uvvisUndo, uvvisRedo,
} from '../../actions/hplc_ms';
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
import renderWavelengthSelect from '../../features/lc-ms/ui/wavelengthSelect';
import { parseFeaturePageValue as parsePageValue } from '../../features/lc-ms/parsing/pageValue';
import {
  LIST_ROOT_SVG_GRAPH, LIST_BRUSH_SVG_GRAPH, LIST_HOST_HOOK_CLASS,
} from '../../constants/list_graph';
import PeakGroup from '../cmd_bar/08_peak_group';
import Threshold from '../cmd_bar/r03_threshold';
import Integration from '../cmd_bar/04_integration';
import Peak from '../cmd_bar/03_peak';
import { getLcMsInfo } from '../../helpers/extractEntityLCMS';

// Fallback viewBox, used only until the panes can be measured (and in jsdom, where
// clientWidth/clientHeight are 0).
const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI
const H = Math.round(window.innerHeight * 0.90 * 0.8 / 3); // ROI

// Below this, the drawable area net of the focus classes' margins (l:60 r:5 t:5 b:40)
// stops being meaningful; clamp rather than let a scale range invert.
const MIN_PANE_W = 240;
const MIN_PANE_H = 96;

// Each chart svg carries `preserveAspectRatio="xMinYMin meet"`, so it is the viewBox
// aspect - not the container - that decides how much of the pane the drawing fills. With
// a viewBox derived once from `window.innerWidth` at module load, a pane proportionally
// wider than that ratio scales the drawing down to its height and leaves the surplus
// width empty on the right, which is what a viewport wider than FHD produces. Measuring
// the pane and matching the viewBox to it removes the letterboxing in both directions.
export const measurePane = (node) => {
  if (!node) return null;
  const { clientWidth, clientHeight } = node;
  if (!clientWidth || !clientHeight) return null;
  return {
    width: Math.max(Math.round(clientWidth), MIN_PANE_W),
    height: Math.max(Math.round(clientHeight), MIN_PANE_H),
  };
};

export const sameSizes = (a, b) => Boolean(a) && Boolean(b)
  && ['line', 'multi', 'rect'].every((k) => (
    a[k].width === b[k].width && a[k].height === b[k].height
  ));

const toSeed = (xValues = [], yValues = []) => {
  const maxLength = Math.min(xValues.length, yValues.length);
  const seed = new Array(maxLength);
  for (let index = 0; index < maxLength; index += 1) {
    seed[index] = { x: xValues[index], y: yValues[index] };
  }
  return seed;
};

export const isLcmsMsPageLoading = (mzEntities = [], hplcMsSt = {}) => {
  const currentPageValue = hplcMsSt?.tic?.currentPageValue;
  if (!Number.isFinite(currentPageValue)) return false;

  const polarity = hplcMsSt?.tic?.polarity;
  const pickEntity = mzEntities?.find((ent) => (
    getLcMsInfo(ent).polarity === polarity
  )) || mzEntities?.[0];
  if (!pickEntity) return true;

  const { features } = extractParams(pickEntity, null, null);
  let featuresArr = [];
  if (Array.isArray(features)) {
    featuresArr = features;
  } else if (features && typeof features === 'object') {
    featuresArr = Object.values(features);
  }
  if (featuresArr.length === 0) return true;

  const pageValues = featuresArr
    .map((feature) => parsePageValue(feature))
    .filter((value) => Number.isFinite(value));
  if (pageValues.length === 0) return true;

  return !pageValues.some((value) => Math.abs(value - currentPageValue) < 1e-5);
};

const styles = () => (
  Object.assign(
    {},
    {
      lcMsStackRoot: {
        margin: '0 0 5px 52px',
        // This is the only place the editor mounts three chart containers stacked in one
        // pane instead of a single one. A host stylesheet that stretches a single chart
        // with `.d3Line { height: 100% }` would otherwise make each of the three as tall
        // as this whole pane and push the TIC and m/z graphs out of a bounded, clipped
        // container. As a flex column they share the pane instead, so the stack fits
        // whether or not the host ships such a rule.
        display: 'flex',
        flexDirection: 'column',
        // Load-bearing under a host that makes this node a flex item (chemotion_ELN's
        // `.MuiGrid-grid-xs-9 { display: flex; flex-direction: column }` does), where the
        // initial `min-height: auto` would otherwise resolve to the stack's content size
        // and defeat the shrink below.
        minHeight: 0,
        // All three panes need the SAME flex-basis or the deficit is shared in proportion
        // to basis and one of them is squeezed to a fraction of a third. `height: 100%`
        // rather than `flex-basis: 0`, because a host stylesheet loads after this JSS and
        // chemotion_ELN already puts `height: 100%` on the two bare mounts with a higher
        // specificity than anything reachable from here - a basis of 0 would lose that
        // contest on `.d3Line`/`.d3Multi`, apply to the m/z panel alone, and collapse it to
        // zero. Restating the same declaration agrees with such a host and supplies it for
        // one that bounds our height without styling the mounts itself. Against an
        // unbounded parent it computes to `auto`, i.e. the content height, as before.
        '& > .d3Line, & > .d3Multi': {
          flex: '1 1 auto',
          minHeight: 0,
          height: '100%',
        },
      },
      lcMsToolbarRow: {
        // Never absorb the shrink the chart panes above negotiate.
        flexShrink: 0,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 8,
        rowGap: 4,
      },
      lcMsToolbarLeft: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: 4,
        rowGap: 4,
        flex: '1 1 auto',
        minWidth: 0,
      },
      lcMsToolbarRight: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end',
        columnGap: 8,
        rowGap: 4,
        flex: '0 1 auto',
      },
      lcMsGraphPanel: {
        position: 'relative',
        // Wraps the m/z chart plus its loading overlay, so this - not `.d3Rect` - is the
        // flex item beside the two bare mounts, and takes the same basis as they do.
        flex: '1 1 auto',
        minHeight: 0,
        height: '100%',
      },
      lcMsLoadingOverlay: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        pointerEvents: 'none',
        zIndex: 2,
      },
      lcMsLoadingIndicator: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.18)',
      },
    },
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
    const resetPayload = {
      graphIndex,
      sweepType: LIST_UI_SWEEP_TYPE.ZOOMRESET,
    };
    zoomInAct(resetPayload);
    // Re-enable zoom brush immediately after reset for LC/MS flow.
    zoomInAct({
      graphIndex,
      sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN,
    });
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

const wavelengthSelect = (classes, hplcMsSt, updateWavelengthAct) => (
  renderWavelengthSelect(classes, hplcMsSt, updateWavelengthAct)
);

const countAvailableTicPolarities = (hplcMsSt) => {
  const a = hplcMsSt?.tic?.available;
  if (!a || typeof a !== 'object') return 0;
  return ['positive', 'negative', 'neutral'].filter((k) => a[k]).length;
};

const ticSelect = (classes, hplcMsSt, handleTicChanged) => {
  const { tic = {} } = hplcMsSt || {};
  const { polarity, available } = tic;
  const listTIC = [
    { name: 'PLUS', value: 'positive', enabled: available?.positive },
    { name: 'MINUS', value: 'negative', enabled: available?.negative },
    { name: 'NEUTRAL', value: 'neutral', enabled: available?.neutral },
  ];
  const filtered = listTIC.filter((d) => d.enabled);
  if (filtered.length <= 1) {
    return null;
  }
  const listOptions = filtered;
  const options = listOptions.map((d) => (
    <MenuItem value={d.value} key={d.value}>
      <span className={classNames(classes.txtOpt, 'option-sv-bar-decimal')}>
        {d.name}
      </span>
    </MenuItem>
  ));

  const onTicChange = (event) => {
    handleTicChanged(event);
  };
  const optionValues = listOptions.map((d) => d.value);
  const resolvedPolarity = optionValues.includes(polarity) ? polarity : optionValues[0];

  return (
    <FormControl
      className={classNames(classes.fieldDecimal)}
      variant="outlined"
      style={{ width: '110px' }}
    >
      <InputLabel id="select-decimal-label" className={classNames(classes.selectLabel, 'select-sv-bar-label')}>
        TIC
      </InputLabel>
      <Select
        labelId="select-decimal-label"
        label="Decimal"
        value={resolvedPolarity}
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

    this.rootKlassLine = `.${LIST_ROOT_SVG_GRAPH.LINE}`;
    this.rootKlassMulti = `.${LIST_ROOT_SVG_GRAPH.MULTI}`;
    this.rootKlassRect = `.${LIST_ROOT_SVG_GRAPH.RECT}`;

    this.stackRef = React.createRef();
    this.lineRef = React.createRef();
    this.multiRef = React.createRef();
    this.rectRef = React.createRef();
    this.resizeObserver = null;
    this.currentSizes = null;

    // Nothing is mounted yet, so this resolves to the fallback; componentDidMount
    // re-measures and rebuilds against the real panes.
    this.createFocuses(this.resolvePaneSizes());

    this.handleResize = this.handleResize.bind(this);
    this.extractSubView = this.extractSubView.bind(this);
    this.notifyHostOnSubViewerChange = this.notifyHostOnSubViewerChange.bind(this);
    this.extractUvvisView = this.extractUvvisView.bind(this);
    this.handleUvvisUndo = this.handleUvvisUndo.bind(this);
    this.handleUvvisRedo = this.handleUvvisRedo.bind(this);
  }

  componentDidMount() {
    this.setupResizeObserver();
    this.mountCharts(this.resolvePaneSizes(), true);
  }

  componentDidUpdate(prevProps) {
    const {
      ticEntities, curveSt,
      tTrEndPts, layoutSt,
      isUiAddIntgSt, isUiNoBrushSt,
      isHidden, uiSt, hplcMsSt, integrationSt,
      editPeakSt,
    } = this.props;
    const { zoom } = uiSt;
    const { sweepExtent } = zoom || {};
    if (!Array.isArray(sweepExtent)) return;

    const uvvisViewFeature = this.extractUvvisView();
    if (uvvisViewFeature?.data?.[0]) {
      const hasLineSvg = !!document.querySelector(
        `${this.rootKlassLine} .${LIST_BRUSH_SVG_GRAPH.LINE}`,
      );
      if (!hasLineSvg) {
        drawMain(
          this.rootKlassLine,
          this.currentSizes.line.width,
          this.currentSizes.line.height,
          LIST_BRUSH_SVG_GRAPH.LINE,
        );
      }
      const currentData = uvvisViewFeature.data[0];
      const { x, y } = currentData;
      const uvvisSeed = toSeed(x, y);
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
          integrationSt,
          hplcMsSt,
          editPeakSt,
        });
      }
      drawLabel(this.rootKlassLine, null, 'Minutes', 'Intensity');
      drawDisplay(this.rootKlassLine, false);
    }

    if (this.multiFocus) {
      const hasMultiSvg = !!document.querySelector(
        `${this.rootKlassMulti} .${LIST_BRUSH_SVG_GRAPH.MULTI}`,
      );
      if (!hasMultiSvg) {
        drawMain(
          this.rootKlassMulti,
          this.currentSizes.multi.width,
          this.currentSizes.multi.height,
          LIST_BRUSH_SVG_GRAPH.MULTI,
        );
      }
      this.multiFocus.update({
        curveSt,
        ticEntities,
        hplcMsSt,
        tTrEndPts,
        layoutSt,
        sweepExtentSt: sweepExtent[1],
        isUiAddIntgSt,
        isUiNoBrushSt,
        uiSt,
        editPeakSt,
      });
    }
    const { polarity } = hplcMsSt.tic;
    const ticPolarityCount = countAvailableTicPolarities(hplcMsSt);
    let ticLabel = null;
    if (ticPolarityCount > 1) {
      ticLabel = 'NEUTRAL';
      if (polarity === 'negative') {
        ticLabel = 'MINUS';
      } else if (polarity === 'positive') {
        ticLabel = 'PLUS';
      }
    }
    drawLabel(this.rootKlassMulti, ticLabel, 'Minutes', 'Intensity');
    drawDisplay(this.rootKlassMulti, isHidden);

    this.notifyHostOnSubViewerChange(prevProps);
    const subViewFeature = this.extractSubView();
    if (subViewFeature) {
      const hasRectSvg = !!document.querySelector(
        `${this.rootKlassRect} .${LIST_BRUSH_SVG_GRAPH.RECT}`,
      );
      if (!hasRectSvg) {
        drawMain(
          this.rootKlassRect,
          this.currentSizes.rect.width,
          this.currentSizes.rect.height,
          LIST_BRUSH_SVG_GRAPH.RECT,
        );
      }
      const { threshold } = hplcMsSt;
      const curTrEndPts = convertThresEndPts(subViewFeature, threshold.value);
      const { data } = subViewFeature;
      const pageValue = parsePageValue(subViewFeature);
      const labelValue = Number.isFinite(pageValue)
        ? pageValue
        : (subViewFeature?.pageValue ?? subViewFeature?.page ?? null);
      const currentData = data[0];
      const { x, y } = currentData;
      const subSeed = toSeed(x, y);
      if (this.rectFocus) {
        this.rectFocus.update({
          filterSeed: subSeed,
          filterPeak: [],
          tTrEndPts: curTrEndPts,
          layoutSt,
          isUiNoBrushSt: true,
          sweepExtentSt: sweepExtent[2],
          uiSt,
        });
      }
      drawLabel(
        this.rootKlassRect,
        labelValue != null ? `${labelValue} min` : null,
        'm/z',
        'Intensity',
      );
      drawDisplay(this.rootKlassRect, false);
    }
  }

  componentWillUnmount() {
    this.teardownResizeObserver();
    drawDestroy(this.rootKlassLine);
    drawDestroy(this.rootKlassMulti);
    drawDestroy(this.rootKlassRect);
  }

  // Redraw only when a pane actually changed size. Against an unbounded host the measured
  // size is the one the current viewBox already produces, so this settles after the first
  // pass instead of feeding itself.
  handleResize() {
    const sizes = this.resolvePaneSizes();
    if (sameSizes(sizes, this.currentSizes)) return;
    this.mountCharts(sizes, false);
  }

  handleUvvisUndo() {
    const { uvvisUndoAct } = this.props;
    uvvisUndoAct();
  }

  handleUvvisRedo() {
    const { uvvisRedoAct } = this.props;
    uvvisRedoAct();
  }

  setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    if (!this.stackRef.current || this.resizeObserver) return;
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.stackRef.current);
  }

  // Measure every pane, so a stack whose three panes differ in height (a host that has
  // not equalised them) still gets a correct viewBox each.
  resolvePaneSizes() {
    const fallback = { width: W, height: H };
    return {
      line: measurePane(this.lineRef?.current) || fallback,
      multi: measurePane(this.multiRef?.current) || fallback,
      rect: measurePane(this.rectRef?.current) || fallback,
    };
  }

  createFocuses(sizes) {
    const {
      clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct,
      ticEntities, uvvisEntities, uiSt,
    } = this.props;
    const shared = {
      clickUiTargetAct, selectUiSweepAct, scrollUiWheelAct, uiSt,
    };

    this.lineFocus = new LineFocus({
      W: sizes.line.width,
      H: sizes.line.height,
      uvvisEntities,
      graphIndex: 0,
      ...shared,
    });
    this.multiFocus = new MultiFocus({
      W: sizes.multi.width,
      H: sizes.multi.height,
      ticEntities,
      graphIndex: 1,
      ...shared,
    });
    this.rectFocus = new RectFocus({
      W: sizes.rect.width,
      H: sizes.rect.height,
      graphIndex: 2,
      ...shared,
    });
  }

  teardownResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  // The whole draw sequence, parameterised by pane size so a resize can re-run it. Only
  // the first run resets redux (`shouldReset`); a resize must not discard the user's zoom,
  // threshold or selection.
  mountCharts(sizes, shouldReset = false) {
    const {
      curveSt, feature, ticEntities, hplcMsSt,
      tTrEndPts, layoutSt,
      isUiAddIntgSt, isUiNoBrushSt,
      integrationSt,
      isHidden,
      resetAllAct, uiSt,
      editPeakSt,
    } = this.props;
    this.currentSizes = sizes;
    drawDestroy(this.rootKlassMulti);
    drawDestroy(this.rootKlassLine);
    drawDestroy(this.rootKlassRect);
    if (shouldReset) {
      resetAllAct(feature);
    }
    this.createFocuses(sizes);

    const { zoom } = uiSt;
    const { sweepExtent } = zoom;

    const uvvisViewFeature = this.extractUvvisView();
    let uvvisSeed = [];
    if (uvvisViewFeature?.data?.[0]) {
      const currentData = uvvisViewFeature.data[0];
      const { x, y } = currentData;
      uvvisSeed = toSeed(x, y);
    }
    drawMain(this.rootKlassLine, sizes.line.width, sizes.line.height, LIST_BRUSH_SVG_GRAPH.LINE);
    this.lineFocus.create({
      filterSeed: uvvisSeed,
      filterPeak: [],
      tTrEndPts,
      layoutSt,
      isUiNoBrushSt: true,
      sweepExtentSt: sweepExtent[0],
      integrationSt,
      isUiAddIntgSt,
      editPeakSt,
      hplcMsSt,
    });
    drawLabel(this.rootKlassLine, null, 'Minutes', 'Intensity');
    drawDisplay(this.rootKlassLine, false);

    const multiSize = sizes.multi;
    drawMain(this.rootKlassMulti, multiSize.width, multiSize.height, LIST_BRUSH_SVG_GRAPH.MULTI);
    this.multiFocus.create({
      ticEntities,
      curveSt,
      hplcMsSt,
      tTrEndPts,
      layoutSt,
      sweepExtentSt: sweepExtent[1],
      isUiAddIntgSt,
      isUiNoBrushSt,
    });
    drawLabel(this.rootKlassMulti, null, 'Minutes', 'Intensity');
    drawDisplay(this.rootKlassMulti, isHidden);

    drawMain(this.rootKlassRect, sizes.rect.width, sizes.rect.height, LIST_BRUSH_SVG_GRAPH.RECT);
    this.rectFocus.create({
      filterSeed: [],
      filterPeak: [],
      tTrEndPts,
      layoutSt,
      isUiNoBrushSt: true,
      sweepExtentSt: sweepExtent[2],
    });
    drawLabel(this.rootKlassRect, null, 'm/z', 'Intensity');
    drawDisplay(this.rootKlassRect, false);
  }

  extractUvvisView() {
    const { uvvisEntities, hplcMsSt } = this.props;
    if (!uvvisEntities || !uvvisEntities[0]) {
      return null;
    }
    const { features } = extractParams(uvvisEntities[0], null, null);
    let featuresArr = [];
    if (Array.isArray(features)) {
      featuresArr = features;
    } else if (features && typeof features === 'object') {
      featuresArr = Object.values(features);
    }
    if (featuresArr.length === 0) {
      return null;
    }
    const { uvvis } = hplcMsSt;
    const { wavelengthIdx } = uvvis;
    if (wavelengthIdx < 0 || wavelengthIdx >= featuresArr.length) {
      return null;
    }
    return featuresArr[wavelengthIdx];
  }

  extractSubView() {
    const { uiSt, mzEntities, hplcMsSt } = this.props;
    const { polarity } = hplcMsSt.tic;
    const pickEntity = mzEntities?.find((ent) => (
      getLcMsInfo(ent).polarity === polarity
    )) || mzEntities?.[0];
    if (!pickEntity || !pickEntity.layout) return null;

    const { features } = extractParams(pickEntity, null, null);
    let featuresArr = [];
    if (Array.isArray(features)) featuresArr = features;
    else if (features && typeof features === 'object') featuresArr = Object.values(features);
    if (featuresArr.length === 0) return null;

    const { subViewerAt } = uiSt;
    const pageValues = featuresArr
      .map((fe) => parsePageValue(fe))
      .filter((val) => Number.isFinite(val));
    if (pageValues.length === 0) return featuresArr[0];

    let requestedPageValue;
    if (subViewerAt != null && Number.isFinite(subViewerAt.x)) {
      requestedPageValue = subViewerAt.x;
    } else if (Number.isFinite(hplcMsSt.tic.currentPageValue)) {
      requestedPageValue = hplcMsSt.tic.currentPageValue;
    } else {
      requestedPageValue = pageValues[Math.floor(pageValues.length / 2)];
    }
    const closestPage = findClosest(pageValues, requestedPageValue);
    const selectFeature = featuresArr.find((fe) => {
      const value = parsePageValue(fe);
      return Number.isFinite(value) && Math.abs(value - closestPage) < 1e-9;
    });
    return selectFeature || featuresArr[0];
  }

  notifyHostOnSubViewerChange(prevProps) {
    const {
      uiSt, hplcMsSt, mzEntities, onLcmsPageRequest, updateCurrentPageValueAct,
    } = this.props;
    const subViewerAt = uiSt?.subViewerAt;
    if (!subViewerAt || !Number.isFinite(subViewerAt.x)) return;

    const prevSubViewerAt = prevProps?.uiSt?.subViewerAt;
    const sameClickAsBefore = prevSubViewerAt
      && Number.isFinite(prevSubViewerAt.x)
      && Math.abs(subViewerAt.x - prevSubViewerAt.x) < 1e-9
      && Math.abs((subViewerAt.y ?? 0) - (prevSubViewerAt.y ?? 0)) < 1e-9;
    if (sameClickAsBefore) return;

    const { polarity } = hplcMsSt.tic;
    const pickEntity = mzEntities?.find((ent) => (
      getLcMsInfo(ent).polarity === polarity
    )) || mzEntities?.[0];
    if (!pickEntity || !pickEntity.layout) return;

    const { features } = extractParams(pickEntity, null, null);
    let featuresArr = [];
    if (Array.isArray(features)) featuresArr = features;
    else if (features && typeof features === 'object') featuresArr = Object.values(features);

    const pageValues = featuresArr
      .map((fe) => parsePageValue(fe))
      .filter((val) => Number.isFinite(val));

    const requestedRt = subViewerAt.x;
    const matchesLoadedScan = pageValues.some((pv) => Math.abs(pv - requestedRt) < 1e-5);
    const needsRemoteFetch = !matchesLoadedScan;

    const exactFeature = featuresArr.find((fe) => {
      const value = parsePageValue(fe);
      return Number.isFinite(value) && Math.abs(value - requestedRt) < 1e-9;
    });
    const requestRetentionTime = exactFeature?.pageSymbol
      ?? exactFeature?.page
      ?? exactFeature?.pageValue
      ?? requestedRt;

    const persistedRt = needsRemoteFetch
      ? requestedRt
      : findClosest(pageValues, requestedRt);

    const prevPersistedRt = hplcMsSt.tic.currentPageValue;
    if (!Number.isFinite(prevPersistedRt) || Math.abs(persistedRt - prevPersistedRt) > 1e-5) {
      updateCurrentPageValueAct(persistedRt);
    }

    if (needsRemoteFetch && typeof onLcmsPageRequest === 'function') {
      onLcmsPageRequest({
        retentionTime: requestRetentionTime,
        polarity,
        trigger: 'user_click',
      });
    }
  }

  render() {
    const {
      classes, hplcMsSt, selectWavelengthAct, updateTicAct, selectCurveAct,
      feature, zoomInAct, uiSt, ticEntities, mzEntities, omitUvvisToolbarRow,
      onLcmsPageRequest,
    } = this.props;
    const resolvedFeature = feature || {};
    const hasEdit = !!resolvedFeature?.data?.[0]?.x?.length;
    const isMsLoading = isLcmsMsPageLoading(mzEntities, hplcMsSt);
    const handleTicChanged = (event) => {
      const selectedPolarity = event.target.value;
      updateTicAct({ polarity: selectedPolarity });
      const targetEntity = ticEntities?.find((ent) => (
        getLcMsInfo(ent).polarity === selectedPolarity
      ));
      if (targetEntity?.curveIdx !== undefined) {
        selectCurveAct(targetEntity.curveIdx);
      }
      const rt = hplcMsSt?.tic?.currentPageValue;
      // Always notify the host on polarity change so it can fetch the mz page for the
      // other trace. If RT is not set yet, pass undefined — ELN resolves initial RT.
      if (typeof onLcmsPageRequest === 'function') {
        onLcmsPageRequest({
          retentionTime: Number.isFinite(rt) ? rt : undefined,
          polarity: selectedPolarity,
          trigger: 'tic_polarity',
        });
      }
    };
    const handleWavelengthChange = (event) => {
      selectWavelengthAct(event);
    };
    return (
      <div
        className={`${LIST_HOST_HOOK_CLASS.LCMS_STACK} ${classes.lcMsStackRoot}`}
        ref={this.stackRef}
      >
        {
          omitUvvisToolbarRow ? null : (
            <div className={classes.lcMsToolbarRow}>
              <div className={classes.lcMsToolbarLeft}>
                {
                  zoomView(classes, 0, uiSt, zoomInAct)
                }
                {
                  wavelengthSelect(classes, hplcMsSt, handleWavelengthChange)
                }
                <Integration />
                <Peak feature={resolvedFeature} />
                {
                  (() => {
                    const hist = hplcMsSt?.uvvisEditHistory || { past: [], future: [] };
                    const canUndo = hist.past && hist.past.length > 0;
                    const canRedo = hist.future && hist.future.length > 0;
                    return (
                      <span className={classes.group} style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Tooltip title={<span className="txt-sv-tp">Undo</span>}>
                          <MuButton
                            className="btn-sv-bar-uvvis-undo"
                            disabled={!canUndo}
                            onClick={this.handleUvvisUndo}
                          >
                            <UndoIcon className={classes.icon} />
                          </MuButton>
                        </Tooltip>
                        <Tooltip title={<span className="txt-sv-tp">Redo</span>}>
                          <MuButton
                            className="btn-sv-bar-uvvis-redo"
                            disabled={!canRedo}
                            onClick={this.handleUvvisRedo}
                          >
                            <RedoIcon className={classes.icon} />
                          </MuButton>
                        </Tooltip>
                      </span>
                    );
                  })()
                }
              </div>
              <div className={classes.lcMsToolbarRight} />
            </div>
          )
        }
        <div className={LIST_ROOT_SVG_GRAPH.LINE} ref={this.lineRef} />
        <div className={classes.lcMsToolbarRow}>
          <div className={classes.lcMsToolbarLeft}>
            {
              zoomView(classes, 1, uiSt, zoomInAct)
            }
            {
              ticSelect(classes, hplcMsSt, handleTicChanged)
            }
            <span style={{ display: 'inline-flex' }}>
              <PeakGroup feature={resolvedFeature} graphIndex={1} />
            </span>
          </div>
          <div className={classes.lcMsToolbarRight} />
        </div>
        <div className={LIST_ROOT_SVG_GRAPH.MULTI} ref={this.multiRef} />
        <div className={classes.lcMsToolbarRow}>
          <div className={classes.lcMsToolbarLeft}>
            {
              zoomView(classes, 2, uiSt, zoomInAct)
            }
            <Threshold feature={resolvedFeature} hasEdit={hasEdit} />
          </div>
          <div className={classes.lcMsToolbarRight} />
        </div>
        <div className={`${LIST_HOST_HOOK_CLASS.LCMS_GRAPH_PANEL} ${classes.lcMsGraphPanel}`}>
          <div className={LIST_ROOT_SVG_GRAPH.RECT} ref={this.rectRef} />
          {
            isMsLoading ? (
              <div
                className={classes.lcMsLoadingOverlay}
                data-testid="lcms-ms-loading"
                aria-label="Loading MS spectrum"
              >
                <div className={classes.lcMsLoadingIndicator}>
                  <CircularProgress size={28} />
                </div>
              </div>
            ) : null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => (
  {
    curveSt: state.curve,
    tTrEndPts: ToThresEndPts(state, props),
    isUiAddIntgSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
    isUiNoBrushSt: LIST_NON_BRUSH_TYPES.indexOf(state.ui.sweepType) < 0,
    uiSt: state.ui,
    layoutSt: state.layout,
    hplcMsSt: state.hplcMs,
    editPeakSt: state.editPeak.present,
    integrationSt: state.integration.present,
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
    uvvisUndoAct: uvvisUndo,
    uvvisRedoAct: uvvisRedo,
  }, dispatch)
);

ViewerLineRect.propTypes = {
  classes: PropTypes.object.isRequired,
  uiSt: PropTypes.object.isRequired,
  curveSt: PropTypes.object.isRequired,
  ticEntities: PropTypes.array.isRequired,
  uvvisEntities: PropTypes.array.isRequired,
  mzEntities: PropTypes.array.isRequired,
  layoutSt: PropTypes.string.isRequired,
  integrationSt: PropTypes.object.isRequired,
  feature: PropTypes.object,
  tTrEndPts: PropTypes.array.isRequired,
  isUiAddIntgSt: PropTypes.bool.isRequired,
  isUiNoBrushSt: PropTypes.bool.isRequired,
  resetAllAct: PropTypes.func.isRequired,
  clickUiTargetAct: PropTypes.func.isRequired,
  selectUiSweepAct: PropTypes.func.isRequired,
  scrollUiWheelAct: PropTypes.func.isRequired,
  isHidden: PropTypes.bool,
  hplcMsSt: PropTypes.object.isRequired,
  selectWavelengthAct: PropTypes.func.isRequired,
  updateTicAct: PropTypes.func.isRequired,
  selectCurveAct: PropTypes.func.isRequired,
  zoomInAct: PropTypes.func.isRequired,
  editPeakSt: PropTypes.object.isRequired,
  updateCurrentPageValueAct: PropTypes.func.isRequired,
  uvvisUndoAct: PropTypes.func.isRequired,
  uvvisRedoAct: PropTypes.func.isRequired,
  omitUvvisToolbarRow: PropTypes.bool,
  onLcmsPageRequest: PropTypes.func,
};

ViewerLineRect.defaultProps = {
  feature: {},
  isHidden: false,
  omitUvvisToolbarRow: false,
  onLcmsPageRequest: null,
};

// export default connect(mapStateToProps, mapDispatchToProps)(ViewerLineRect);
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ViewerLineRect);
