"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _styles = require("@mui/styles");
var _submit = require("./actions/submit");
var _layout = require("./actions/layout");
var _manager = require("./actions/manager");
var _meta = require("./actions/meta");
var _jcamp = require("./actions/jcamp");
var _layer_prism = _interopRequireDefault(require("./layer_prism"));
var _format = _interopRequireDefault(require("./helpers/format"));
var _multi_jcamps_viewer = _interopRequireDefault(require("./components/multi_jcamps_viewer"));
var _curve = require("./actions/curve");
var _ui = require("./actions/ui");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, default-param-last */

const hasActiveZoom = sweepExtent => {
  if (!sweepExtent) return false;
  return !!(sweepExtent.xExtent || sweepExtent.yExtent);
};
const styles = () => ({});
class LayerInit extends _react.default.Component {
  constructor(props) {
    super(props);
    const {
      sweepExtent,
      restoreSweepExtentAct
    } = props;
    if (hasActiveZoom(sweepExtent)) {
      restoreSweepExtentAct(sweepExtent);
    } else {
      // Clear any zoom left in the shared store by a previously opened
      // spectrum, so it cannot block the RESETALL/layout sync on mount.
      restoreSweepExtentAct({
        xExtent: false,
        yExtent: false
      });
    }
    this.normChange = this.normChange.bind(this);
    this.execReset = this.execReset.bind(this);
    this.initReducer = this.initReducer.bind(this);
    this.updateOthers = this.updateOthers.bind(this);
    this.updateMultiEntities = this.updateMultiEntities.bind(this);
  }
  componentDidMount() {
    this.execReset();
    this.initReducer();
    this.updateOthers();
    this.updateMultiEntities(true);
  }
  componentDidUpdate(prevProps) {
    this.normChange(prevProps);
    this.updateOthers();
    if (prevProps.multiEntities !== this.props.multiEntities || prevProps.entity !== this.props.entity) {
      this.updateMultiEntities(false);
    }
  }
  normChange(prevProps) {
    const {
      entity
    } = this.props;
    if (prevProps.entity !== entity) {
      this.execReset();
    }
  }
  execReset() {
    const {
      entity,
      updateMetaPeaksAct,
      updateLayoutAct,
      resetInitCommonAct,
      resetInitMsAct,
      resetInitNmrAct,
      resetInitCommonWithIntergationAct,
      resetDetectorAct,
      updateDSCMetaDataAct,
      resetMultiplicityAct
    } = this.props;
    resetInitCommonAct();
    resetDetectorAct();
    const {
      layout,
      features
    } = entity;
    // Sync the layout deterministically on every spectrum open. Otherwise it
    // only updates via the d3 RESETALL, which can be skipped (active zoom or
    // same multi-comparison curve count), leaving a stale layout from the
    // previously opened spectrum.
    updateLayoutAct(layout);
    if (_format.default.isMsLayout(layout)) {
      const autoPeak = features.autoPeak || features[0];
      const editPeak = features.editPeak || features[0];
      const baseFeat = editPeak || autoPeak;
      resetInitMsAct(baseFeat);
    } else if (_format.default.isNmrLayout(layout)) {
      const {
        integration,
        multiplicity,
        simulation
      } = features;
      updateMetaPeaksAct(entity);
      resetInitNmrAct({
        integration,
        multiplicity,
        simulation
      });
    } else if (_format.default.isHplcUvVisLayout(layout)) {
      const {
        integration
      } = features;
      updateMetaPeaksAct(entity);
      resetInitCommonWithIntergationAct({
        integration
      });
    } else if (_format.default.isDSCLayout(layout)) {
      const {
        dscMetaData
      } = features;
      updateDSCMetaDataAct(dscMetaData);
    }
    if (!_format.default.isNmrLayout(layout)) {
      resetMultiplicityAct();
    }
  }
  initReducer() {
    const {
      operations,
      updateOperationAct
    } = this.props;
    updateOperationAct(operations[0]);
  }
  updateOthers() {
    const {
      others,
      addOthersAct
    } = this.props;
    addOthersAct(others);
  }
  buildSetAllCurvesPayload(entities, isInitial) {
    const {
      curveIdx
    } = this.props;
    if (isInitial && Number.isFinite(curveIdx)) {
      return {
        entities,
        curveIdx
      };
    }
    return entities;
  }
  updateMultiEntities(isInitial = false) {
    const {
      multiEntities,
      setAllCurvesAct,
      entity
    } = this.props;
    const isMultiSpectra = Array.isArray(multiEntities) && multiEntities.length > 1;
    if (isMultiSpectra) {
      setAllCurvesAct(this.buildSetAllCurvesPayload(multiEntities, isInitial));
      return;
    }
    if (_format.default.isCyclicVoltaLayout(entity.layout)) {
      const entities = Array.isArray(multiEntities) && multiEntities.length > 0 ? multiEntities : [entity];
      setAllCurvesAct(this.buildSetAllCurvesPayload(entities, isInitial));
      return;
    }
    setAllCurvesAct(false);
  }
  render() {
    const {
      entity,
      cLabel,
      xLabel,
      yLabel,
      forecast,
      operations,
      descriptions,
      molSvg,
      editorOnly,
      exactMass,
      canChangeDescription,
      onDescriptionChanged,
      multiEntities,
      entityFileNames,
      userManualLink
    } = this.props;
    const target = entity.spectra[0];
    const {
      layout
    } = entity;
    const xxLabel = !xLabel && xLabel === '' ? `X (${target.xUnit})` : xLabel;
    const yyLabel = !yLabel && yLabel === '' ? `Y (${target.yUnit})` : yLabel;
    const isMultiSpectra = Array.isArray(multiEntities) && multiEntities.length > 1;
    if (isMultiSpectra) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_multi_jcamps_viewer.default, {
        multiEntities: multiEntities,
        entityFileNames: entityFileNames,
        userManualLink: userManualLink,
        molSvg: molSvg,
        exactMass: exactMass,
        operations: operations,
        descriptions: descriptions,
        canChangeDescription: canChangeDescription,
        onDescriptionChanged: onDescriptionChanged
      });
    } else if (_format.default.isCyclicVoltaLayout(layout)) {
      // eslint-disable-line
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_multi_jcamps_viewer.default, {
        multiEntities: [entity],
        entityFileNames: entityFileNames,
        userManualLink: userManualLink,
        molSvg: molSvg,
        exactMass: exactMass,
        operations: operations,
        descriptions: descriptions,
        canChangeDescription: canChangeDescription,
        onDescriptionChanged: onDescriptionChanged
      });
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_layer_prism.default, {
      entity: entity,
      cLabel: cLabel,
      xLabel: xxLabel,
      yLabel: yyLabel,
      forecast: forecast,
      operations: operations,
      descriptions: descriptions,
      molSvg: molSvg,
      editorOnly: editorOnly,
      exactMass: exactMass,
      canChangeDescription: canChangeDescription,
      onDescriptionChanged: onDescriptionChanged
    });
  }
}
const mapStateToProps = (state, props) => (
// eslint-disable-line
{});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  resetInitCommonAct: _manager.resetInitCommon,
  resetInitNmrAct: _manager.resetInitNmr,
  resetInitMsAct: _manager.resetInitMs,
  resetInitCommonWithIntergationAct: _manager.resetInitCommonWithIntergation,
  resetDetectorAct: _manager.resetDetector,
  resetMultiplicityAct: _manager.resetMultiplicity,
  updateOperationAct: _submit.updateOperation,
  updateLayoutAct: _layout.updateLayout,
  updateMetaPeaksAct: _meta.updateMetaPeaks,
  addOthersAct: _jcamp.addOthers,
  setAllCurvesAct: _curve.setAllCurves,
  updateDSCMetaDataAct: _meta.updateDSCMetaData,
  restoreSweepExtentAct: _ui.restoreSweepExtent
}, dispatch);
LayerInit.propTypes = {
  entity: _propTypes.default.object.isRequired,
  multiEntities: _propTypes.default.array,
  // eslint-disable-line
  curveIdx: _propTypes.default.number,
  sweepExtent: _propTypes.default.object,
  entityFileNames: _propTypes.default.array,
  // eslint-disable-line
  restoreSweepExtentAct: _propTypes.default.func.isRequired,
  others: _propTypes.default.object.isRequired,
  cLabel: _propTypes.default.string.isRequired,
  xLabel: _propTypes.default.string.isRequired,
  yLabel: _propTypes.default.string.isRequired,
  molSvg: _propTypes.default.string.isRequired,
  editorOnly: _propTypes.default.bool.isRequired,
  exactMass: _propTypes.default.string.isRequired,
  forecast: _propTypes.default.object.isRequired,
  operations: _propTypes.default.array.isRequired,
  descriptions: _propTypes.default.array.isRequired,
  resetInitCommonAct: _propTypes.default.func.isRequired,
  resetInitNmrAct: _propTypes.default.func.isRequired,
  resetInitMsAct: _propTypes.default.func.isRequired,
  resetInitCommonWithIntergationAct: _propTypes.default.func.isRequired,
  updateOperationAct: _propTypes.default.func.isRequired,
  updateLayoutAct: _propTypes.default.func.isRequired,
  updateMetaPeaksAct: _propTypes.default.func.isRequired,
  addOthersAct: _propTypes.default.func.isRequired,
  canChangeDescription: _propTypes.default.bool.isRequired,
  onDescriptionChanged: _propTypes.default.func,
  // eslint-disable-line
  setAllCurvesAct: _propTypes.default.func.isRequired,
  userManualLink: _propTypes.default.object,
  // eslint-disable-line
  resetDetectorAct: _propTypes.default.func.isRequired,
  resetMultiplicityAct: _propTypes.default.func.isRequired,
  updateDSCMetaDataAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(
// eslint-disable-line
mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(LayerInit)); // eslint-disable-line