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
var _styles = require("@material-ui/core/styles");
var _submit = require("./actions/submit");
var _manager = require("./actions/manager");
var _meta = require("./actions/meta");
var _jcamp = require("./actions/jcamp");
var _layer_prism = _interopRequireDefault(require("./layer_prism"));
var _format = _interopRequireDefault(require("./helpers/format"));
var _multi_jcamps_viewer = _interopRequireDefault(require("./components/multi_jcamps_viewer"));
var _curve = require("./actions/curve");
/* eslint-disable prefer-object-spread, default-param-last */

const styles = () => ({});
class LayerInit extends _react.default.Component {
  constructor(props) {
    super(props);
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
    this.updateMultiEntities();
  }
  componentDidUpdate(prevProps) {
    this.normChange(prevProps);
    this.updateOthers();
    this.updateMultiEntities();
  }
  normChange(prevProps) {
    const prevFeatures = prevProps.entity.features;
    const prevPeak = prevFeatures.editPeak || prevFeatures.autoPeak;
    const {
      entity
    } = this.props;
    const nextFeatures = entity.features;
    const nextPeak = nextFeatures.editPeak || nextFeatures.autoPeak;
    if (prevPeak !== nextPeak) {
      this.execReset();
    }
  }
  execReset() {
    const {
      entity,
      updateMetaPeaksAct,
      resetInitCommonAct,
      resetInitMsAct,
      resetInitNmrAct,
      resetInitCommonWithIntergationAct
    } = this.props;
    resetInitCommonAct();
    const {
      layout,
      features
    } = entity;
    if (_format.default.isMsLayout(layout)) {
      // const { autoPeak, editPeak } = features; // TBD
      const autoPeak = features.autoPeak || features[0];
      const editPeak = features.editPeak || features[0];
      const baseFeat = editPeak || autoPeak;
      resetInitMsAct(baseFeat);
    }
    if (_format.default.isNmrLayout(layout)) {
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
  updateMultiEntities() {
    const {
      multiEntities,
      setAllCurvesAct
    } = this.props;
    setAllCurvesAct(multiEntities);
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
    if (multiEntities) {
      return /*#__PURE__*/_react.default.createElement(_multi_jcamps_viewer.default, {
        multiEntities: multiEntities,
        entityFileNames: entityFileNames,
        userManualLink: userManualLink,
        molSvg: molSvg,
        operations: operations
      });
    } else if (_format.default.isCyclicVoltaLayout(layout)) {
      // eslint-disable-line
      return /*#__PURE__*/_react.default.createElement(_multi_jcamps_viewer.default, {
        multiEntities: [entity],
        entityFileNames: entityFileNames,
        userManualLink: userManualLink,
        molSvg: molSvg,
        operations: operations
      });
    }
    return /*#__PURE__*/_react.default.createElement(_layer_prism.default, {
      entity: entity,
      cLabel: cLabel,
      xLabel: xxLabel,
      yLabel: yyLabel,
      forecast: forecast,
      operations: operations,
      descriptions: descriptions,
      molSvg: molSvg,
      editorOnly: editorOnly,
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
  updateOperationAct: _submit.updateOperation,
  updateMetaPeaksAct: _meta.updateMetaPeaks,
  addOthersAct: _jcamp.addOthers,
  setAllCurvesAct: _curve.setAllCurves
}, dispatch);
LayerInit.propTypes = {
  entity: _propTypes.default.object.isRequired,
  multiEntities: _propTypes.default.array,
  // eslint-disable-line
  entityFileNames: _propTypes.default.array,
  // eslint-disable-line
  others: _propTypes.default.object.isRequired,
  cLabel: _propTypes.default.string.isRequired,
  xLabel: _propTypes.default.string.isRequired,
  yLabel: _propTypes.default.string.isRequired,
  molSvg: _propTypes.default.string.isRequired,
  editorOnly: _propTypes.default.bool.isRequired,
  forecast: _propTypes.default.object.isRequired,
  operations: _propTypes.default.array.isRequired,
  descriptions: _propTypes.default.array.isRequired,
  resetInitCommonAct: _propTypes.default.func.isRequired,
  resetInitNmrAct: _propTypes.default.func.isRequired,
  resetInitMsAct: _propTypes.default.func.isRequired,
  resetInitCommonWithIntergationAct: _propTypes.default.func.isRequired,
  updateOperationAct: _propTypes.default.func.isRequired,
  updateMetaPeaksAct: _propTypes.default.func.isRequired,
  addOthersAct: _propTypes.default.func.isRequired,
  canChangeDescription: _propTypes.default.bool.isRequired,
  onDescriptionChanged: _propTypes.default.func,
  // eslint-disable-line
  setAllCurvesAct: _propTypes.default.func.isRequired,
  userManualLink: _propTypes.default.object // eslint-disable-line
};
var _default = exports.default = (0, _reactRedux.connect)(
// eslint-disable-line
mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(LayerInit)); // eslint-disable-line