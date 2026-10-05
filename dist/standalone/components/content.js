"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.buildSavePayload = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _app = require("../../app");
var _action_file = require("../actions/action_file");
var _action_predict = require("../actions/action_predict");
var _action_desc = require("../actions/action_desc");
var _action_jcamp = require("../actions/action_jcamp");
var _helper = require("../utils/helper");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable no-shadow, react/no-unused-prop-types */

const titleStyle = {
  backgroundColor: '#f5f5f5',
  border: '2px solid #e3e3e3',
  borderRadius: '10px',
  height: 250,
  lineHeight: '250px',
  marginTop: 100,
  textAlign: 'center'
};
const txtStyle = {
  lineHeight: '200px'
};
const containerStyle = {
  margin: '5px 0 0 0'
};
const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI

const editorStyle = {
  border: '1px solid gray',
  borderRadius: '8px 0 0 8px',
  margin: '0 0 0 60px',
  width: W - 80
};
const renderTitle = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
  style: titleStyle,
  children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("h1", {
    style: txtStyle,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
      children: "Welcome to ChemSpectra"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("a", {
      target: "_blank",
      rel: "noopener noreferrer",
      href: "https://github.com/ComPlat/react-spectra-editor/blob/master/DEMO_MANUAL.md",
      children: "Step by step demo"
    })]
  })
});

// The editor's submit button calls an operation with
// { spectra_list: [perCurvePayload, ...], curveSt: { curveIdx } }. Each per-curve
// payload already holds the selected shift, integration and multiplicity as single
// entries. Pick the selected curve's payload and rebuild the index-keyed slices
// ({ shifts: [] } etc.) that formatPks, formatMpy and the FN helpers read.
const toSlice = (entry, key, curveIdx) => {
  if (!entry || Array.isArray(entry[key])) return entry;
  const list = [];
  list[curveIdx] = entry;
  return {
    [key]: list
  };
};
const resolveOperationParams = params => {
  const spectraList = Array.isArray(params?.spectra_list) ? params.spectra_list : [];
  const curveIdx = params?.curveSt?.curveIdx ?? 0;
  const spectrum = spectraList[curveIdx] || spectraList[0] || {};
  return {
    ...spectrum,
    shift: toSlice(spectrum.shift, 'shifts', curveIdx),
    integration: toSlice(spectrum.integration, 'integrations', curveIdx),
    multiplicity: toSlice(spectrum.multiplicity, 'multiplicities', curveIdx),
    curveSt: {
      curveIdx
    }
  };
};

// The save request for the selected curve. A curve the editor holds no shift, integration
// or multiplicity entry for (its lists shorter than the curve list) is saved with its peaks
// as they are and with '{}', which the backend reads as "none", rather than with another
// curve's data or the string "undefined".
const buildSavePayload = (params, mass) => {
  const {
    peaks,
    shift,
    scan,
    thres,
    analysis,
    integration,
    multiplicity,
    waveLength,
    cyclicvoltaSt,
    curveSt,
    dscMetaData
  } = resolveOperationParams(params);
  const {
    curveIdx
  } = curveSt;
  const selectedShift = shift?.shifts?.[curveIdx];
  const fPeaks = selectedShift ? _app.FN.rmRef(peaks, shift, curveIdx) : peaks;
  return {
    peakStr: _app.FN.toPeakStr(fPeaks),
    shift: selectedShift,
    mass,
    scan,
    thres,
    predict: JSON.stringify(analysis),
    integration: JSON.stringify(integration?.integrations?.[curveIdx] ?? {}),
    multiplicity: JSON.stringify(multiplicity?.multiplicities?.[curveIdx] ?? {}),
    waveLength: JSON.stringify(waveLength),
    cyclicvolta: JSON.stringify(cyclicvoltaSt),
    dscMetaData: JSON.stringify(dscMetaData)
  };
};
exports.buildSavePayload = buildSavePayload;
class Content extends _react.default.Component {
  constructor(props) {
    super(props);
    this.writeMpy = this.writeMpy.bind(this);
    this.writePeak = this.writePeak.bind(this);
    this.formatPks = this.formatPks.bind(this);
    this.formatMpy = this.formatMpy.bind(this);
    this.checkWriteOp = this.checkWriteOp.bind(this);
    this.saveOp = this.saveOp.bind(this);
    this.refreshOp = this.refreshOp.bind(this);
    this.predictOp = this.predictOp.bind(this);
    // this.updatInput = this.updatInput.bind(this);
    this.buildOpsByLayout = this.buildOpsByLayout.bind(this);
    this.buildForecast = this.buildForecast.bind(this);
    this.buildOthers = this.buildOthers.bind(this);
  }
  getPeaksByLayout(peaks, layout, multiplicity, curveIdx = 0) {
    if (['IR'].indexOf(layout) >= 0) return peaks;
    if (['13C'].indexOf(layout) >= 0) return _app.FN.CarbonFeatures(peaks, multiplicity);
    const {
      multiplicities
    } = multiplicity;
    const selectedMultiplicity = multiplicities[curveIdx];
    const {
      stack,
      shift
    } = selectedMultiplicity;
    const nmrMpyCenters = stack.map(stk => {
      const {
        mpyType
      } = stk;
      const centers = stk.peaks;
      return {
        x: _app.FN.CalcMpyCenter(centers, shift, mpyType),
        y: 0
      };
    });
    const defaultCenters = [{
      x: -1000.0,
      y: 0
    }];
    return nmrMpyCenters.length > 0 ? nmrMpyCenters : defaultCenters;
  }
  formatPks({
    peaks,
    layout,
    shift,
    isAscend,
    decimal,
    isIntensity,
    integration,
    curveSt,
    waveLength
  }) {
    const {
      fileSt
    } = this.props;
    const {
      jcamp,
      jcampList
    } = fileSt;
    let data = null;
    if (jcamp) {
      data = _app.FN.buildData(jcamp);
    } else {
      const {
        curveIdx
      } = curveSt;
      const selectedJcamp = jcampList[curveIdx];
      data = _app.FN.buildData(selectedJcamp);
    }
    const {
      entity
    } = data;
    const {
      features
    } = entity;
    const {
      temperature
    } = entity;
    const {
      maxY,
      minY
    } = Array.isArray(features) ? {} : features.editPeak || features.autoPeak;
    const boundary = {
      maxY,
      minY
    };
    const {
      curveIdx: atIndex = 0
    } = curveSt || {};
    const body = _app.FN.peaksBody({
      peaks,
      layout,
      decimal,
      shift,
      isAscend,
      isIntensity,
      boundary,
      integration,
      atIndex,
      waveLength,
      temperature
    }); //eslint-disable-line
    const wrapper = _app.FN.peaksWrapper(layout, shift, atIndex);
    const desc = (0, _helper.RmDollarSign)(wrapper.head) + body + wrapper.tail;
    return desc;
  }
  formatMpy({
    multiplicity,
    integration,
    shift,
    isAscend,
    decimal,
    layout,
    curveSt
  }) {
    const {
      curveIdx
    } = curveSt;
    // obsv freq
    const {
      fileSt
    } = this.props;
    const {
      entity
    } = _app.FN.buildData(fileSt.jcamp);
    const {
      features
    } = entity;
    const {
      observeFrequency
    } = Array.isArray(features) ? features[0] : features.editPeak || features.autoPeak;
    const freq = observeFrequency;
    const freqStr = freq ? `${parseInt(freq, 10)} MHz, ` : '';
    // multiplicity
    const {
      integrations
    } = integration;
    const selectedIntegration = integrations[curveIdx];
    const {
      refArea,
      refFactor
    } = selectedIntegration;
    const {
      multiplicities
    } = multiplicity;
    const selectedMultiplicity = multiplicities[curveIdx];
    const shiftVal = selectedMultiplicity.shift;
    const ms = selectedMultiplicity.stack;
    const is = selectedIntegration.stack;
    const macs = ms.map(m => {
      const {
        peaks,
        mpyType,
        xExtent
      } = m;
      const {
        xL,
        xU
      } = xExtent;
      const it = is.filter(i => i.xL === xL && i.xU === xU)[0] || {
        area: 0
      };
      const area = it.area * refFactor / refArea;
      const center = _app.FN.calcMpyCenter(peaks, shiftVal, mpyType);
      const xs = m.peaks.map(p => p.x).sort((a, b) => a - b);
      const [aIdx, bIdx] = isAscend ? [0, xs.length - 1] : [xs.length - 1, 0];
      const mxA = mpyType === 'm' ? (xs[aIdx] - shiftVal).toFixed(decimal) : 0;
      const mxB = mpyType === 'm' ? (xs[bIdx] - shiftVal).toFixed(decimal) : 0;
      return {
        ...m,
        area,
        center,
        mxA,
        mxB
      };
    }).sort((a, b) => isAscend ? a.center - b.center : b.center - a.center);
    const str = macs.map(m => {
      const c = m.center;
      const type = m.mpyType;
      const it = Math.round(m.area);
      const js = m.js.map(j => `J = ${j.toFixed(1)} Hz`).join(', ');
      const atomCount = layout === '1H' ? `, ${it}H` : '';
      const location = type === 'm' ? `${m.mxA}–${m.mxB}` : `${c.toFixed(decimal)}`;
      return m.js.length === 0 ? `${location} (${type}${atomCount})` : `${location} (${type}, ${js}${atomCount})`;
    }).join(', ');
    const {
      shifts
    } = shift;
    const selectedShift = shifts[curveIdx];
    const {
      label,
      value,
      name
    } = selectedShift.ref;
    const solvent = label ? `${name.split('(')[0].trim()} [${value.toFixed(decimal)} ppm], ` : '';
    return `${layout} NMR (${freqStr}${solvent}ppm) δ = ${str}.`;
  }
  writeMpy(params) {
    const {
      layout,
      shift,
      isAscend,
      decimal,
      multiplicity,
      integration,
      curveSt
    } = resolveOperationParams(params);
    if (['1H', '13C', '19F'].indexOf(layout) < 0) return;
    const desc = this.formatMpy({
      multiplicity,
      integration,
      shift,
      isAscend,
      decimal,
      layout,
      curveSt
    });
    const {
      updateDescAct
    } = this.props;
    updateDescAct(desc);
  }
  writePeak(params) {
    const {
      peaks,
      layout,
      shift,
      isAscend,
      decimal,
      isIntensity,
      integration,
      curveSt,
      waveLength
    } = resolveOperationParams(params);
    const desc = this.formatPks({
      peaks,
      layout,
      shift,
      isAscend,
      decimal,
      isIntensity,
      integration,
      curveSt,
      waveLength
    });
    const {
      updateDescAct
    } = this.props;
    updateDescAct(desc);
  }
  checkWriteOp({
    peaks,
    layout,
    shift,
    isAscend,
    decimal
  }) {
    const {
      predictToWriteInitAct,
      molSt,
      fileSt
    } = this.props;
    const molfile = molSt.src;
    const cleanPeaks = _app.FN.rmShiftFromPeaks(peaks, shift);
    predictToWriteInitAct({
      molfile,
      layout,
      shift,
      isAscend,
      decimal,
      peaks: cleanPeaks,
      spectrum: fileSt.src
    });
  }
  saveOp(params) {
    const {
      saveFileInitAct,
      molSt
    } = this.props;
    saveFileInitAct(buildSavePayload(params, molSt.mass));
  }
  refreshOp({
    peaks,
    scan,
    shift,
    thres,
    analysis,
    integration,
    multiplicity,
    curveSt
  }) {
    const {
      refreshFileInitAct,
      molSt
    } = this.props;
    const {
      mass
    } = molSt;
    const fPeaks = _app.FN.rmRef(peaks, shift);
    const peakStr = _app.FN.toPeakStr(fPeaks);
    const predict = JSON.stringify(analysis);
    const {
      curveIdx
    } = curveSt;
    const {
      shifts
    } = shift;
    const selectedShift = shifts[curveIdx];
    const {
      integrations
    } = integration;
    const selectedIntegration = integrations[curveIdx];
    const {
      multiplicities
    } = multiplicity;
    const selectedMultiplicity = multiplicities[curveIdx];
    refreshFileInitAct({
      peakStr,
      shift: selectedShift,
      mass,
      scan,
      thres,
      predict,
      integration: JSON.stringify(selectedIntegration),
      multiplicity: JSON.stringify(selectedMultiplicity)
    });
  }
  predictOp({
    peaks,
    layout,
    shift,
    multiplicity,
    curveSt
  }) {
    const {
      predictInitAct,
      molSt,
      fileSt
    } = this.props;
    const molfile = molSt.src;
    const {
      curveIdx
    } = curveSt;
    const targetPeaks = this.getPeaksByLayout(peaks, layout, multiplicity, curveIdx);
    const {
      shifts
    } = shift;
    const selectedShift = shifts[curveIdx];
    predictInitAct({
      molfile,
      peaks: targetPeaks,
      layout,
      shift: selectedShift,
      spectrum: fileSt.src
    });
  }

  // updatInput(e) {
  //   const molecule = e.target.value;
  //   this.setState({ molecule });
  // }

  buildForecast() {
    const {
      molSt,
      predictSt
    } = this.props;
    const predictObj = {
      btnCb: this.predictOp,
      refreshCb: this.refreshOp,
      molecule: molSt.src ? molSt.src.name : '',
      predictions: predictSt
    };
    return predictObj;
  }
  buildOpsByLayout(entity, editorOnly) {
    // eslint-disable-line
    let ops = [{
      name: 'write peaks',
      value: this.writePeak
    }, {
      name: 'save',
      value: this.saveOp
    }];
    if (['1H', '13C', '19F'].indexOf(entity.layout) >= 0) {
      ops = [{
        name: 'write multiplicity',
        value: this.writeMpy
      }, ...ops];
    }
    return ops;
    // { name: 'check & write', value: this.checkWriteOp },
  }
  buildOthers() {
    const {
      addOthersInitAct,
      othersSt
    } = this.props;
    return {
      others: othersSt,
      addOthersCb: addOthersInitAct
    };
  }
  render() {
    const {
      fileSt,
      descSt,
      editorOnly,
      molSt
    } = this.props;
    if (!fileSt) return renderTitle();
    const {
      entity,
      xLabel,
      yLabel,
      isExist
    } = _app.FN.buildData(fileSt.jcamp);
    let currEntity = entity;
    let currXLabel = xLabel;
    let currYLabel = yLabel;
    let multiEntities = [];
    if (!isExist) {
      const {
        jcampList
      } = fileSt;
      if (!jcampList || jcampList.length === 0) return renderTitle();
      multiEntities = jcampList.map(jcamp => {
        const {
          entity,
          xLabel,
          yLabel
        } = _app.FN.buildData(jcamp);
        currEntity = entity;
        currXLabel = xLabel;
        currYLabel = yLabel;
        return entity;
      });
    }

    // if (!isExist) return renderTitle();

    const {
      svg
    } = molSt;
    const operations = this.buildOpsByLayout(currEntity, editorOnly);
    const forecast = this.buildForecast();
    const others = this.buildOthers();
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      style: containerStyle,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_app.SpectraEditor, {
        entity: currEntity,
        multiEntities: multiEntities,
        others: others,
        xLabel: currXLabel,
        yLabel: currYLabel,
        forecast: forecast,
        operations: operations,
        editorOnly: editorOnly,
        molSvg: svg
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("textarea", {
          rows: "2",
          cols: "180",
          placeholder: "peaks",
          style: editorStyle,
          value: descSt,
          readOnly: true
        })
      })]
    });
  }
}
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  molSt: state.mol,
  fileSt: state.file,
  predictSt: state.predict,
  descSt: state.desc,
  othersSt: state.jcamp.others
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  saveFileInitAct: _action_file.saveFileInit,
  refreshFileInitAct: _action_file.refreshFileInit,
  predictInitAct: _action_predict.predictInit,
  predictToWriteInitAct: _action_predict.predictToWriteInit,
  updateDescAct: _action_desc.updateDesc,
  addOthersInitAct: _action_jcamp.addOthersInit
}, dispatch);
Content.propTypes = {
  molSt: _propTypes.default.object.isRequired,
  fileSt: _propTypes.default.object.isRequired,
  predictSt: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.bool]).isRequired,
  descSt: _propTypes.default.string.isRequired,
  othersSt: _propTypes.default.array.isRequired,
  saveFileInitAct: _propTypes.default.func.isRequired,
  refreshFileInitAct: _propTypes.default.func.isRequired,
  predictInitAct: _propTypes.default.func.isRequired,
  predictToWriteInitAct: _propTypes.default.func.isRequired,
  updateDescAct: _propTypes.default.func.isRequired,
  addOthersAct: _propTypes.default.func.isRequired,
  editorOnly: _propTypes.default.bool.isRequired,
  addOthersInitAct: _propTypes.default.func.isRequired
};
// exported for tests
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Content);