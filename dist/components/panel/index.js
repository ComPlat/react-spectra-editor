"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _styles = require("@mui/material/styles");
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _info = _interopRequireDefault(require("./info"));
var _peaks = _interopRequireDefault(require("./peaks"));
var _compare = _interopRequireDefault(require("./compare"));
var _multiplicity = _interopRequireDefault(require("./multiplicity"));
var _cyclic_voltamery_data = _interopRequireDefault(require("./cyclic_voltamery_data"));
var _graph_selection = _interopRequireDefault(require("./graph_selection"));
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/prop-types, react/require-default-props */

const theme = (0, _styles.createTheme)({
  typography: {
    useNextVariants: true
  },
  palette: {
    background: {
      default: '#D3D3D3'
    }
  }
});
const styles = () => ({
  panels: {
    maxHeight: 'calc(90vh - 220px)',
    // ROI
    display: 'table',
    overflowX: 'hidden',
    overflowY: 'auto',
    margin: '5px 0 0 0',
    padding: '0 0 0 0',
    width: '100%'
  }
});
class PanelViewer extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: 'info'
    };
    this.onExapnd = this.onExapnd.bind(this);
    this.handleDescriptionChanged = this.handleDescriptionChanged.bind(this);
  }
  handleDescriptionChanged(content, delta, source, editor) {
    if (source === 'user') {
      const contentChanged = editor.getContents();
      this.props.onDescriptionChanged(contentChanged); // eslint-disable-line
    }
  }
  onExapnd(input) {
    const {
      expand
    } = this.state;
    const nextExpand = input === expand ? '' : input;
    this.setState({
      expand: nextExpand
    });
  }
  render() {
    const {
      expand
    } = this.state;
    const {
      classes,
      feature,
      integration,
      editorOnly,
      molSvg,
      descriptions,
      layoutSt,
      canChangeDescription,
      jcampIdx,
      entityFileNames,
      curveSt,
      userManualLink,
      subLayoutsInfo,
      exactMass,
      hideCyclicVolta
    } = this.props;
    const onExapndInfo = () => this.onExapnd('info');
    const onExapndPeak = () => this.onExapnd('peak');
    const onExapndMpy = () => this.onExapnd('mpy');
    const onExapndCompare = () => this.onExapnd('compare');
    const onExapndCyclicVolta = () => this.onExapnd('cyclicvolta');
    const onExapndGraphSelection = () => this.onExapnd('graph');
    const {
      listCurves
    } = curveSt;
    const hideGraphSelection = listCurves === false || listCurves === undefined;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: (0, _classnames.default)(classes.panels),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_styles.StyledEngineProvider, {
        injectFirst: true,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_styles.ThemeProvider, {
          theme: theme,
          children: [hideGraphSelection ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_graph_selection.default, {
            jcampIdx: jcampIdx,
            entityFileNames: entityFileNames,
            expand: expand === 'graph',
            onExapnd: onExapndGraphSelection,
            subLayoutsInfo: subLayoutsInfo
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_info.default, {
            feature: feature,
            integration: integration,
            editorOnly: editorOnly,
            expand: expand === 'info',
            molSvg: molSvg,
            exactMass: exactMass,
            onExapnd: onExapndInfo,
            descriptions: descriptions,
            canChangeDescription: canChangeDescription,
            onDescriptionChanged: this.handleDescriptionChanged
          }), _cfg.default.hidePanelPeak(layoutSt) ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_peaks.default, {
            expand: expand === 'peak',
            onExapnd: onExapndPeak
          }), _cfg.default.hidePanelMpy(layoutSt) ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_multiplicity.default, {
            expand: expand === 'mpy',
            onExapnd: onExapndMpy
          }), _cfg.default.hidePanelCompare(layoutSt) || listCurves.length > 1 ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_compare.default, {
            expand: expand === 'compare',
            onExapnd: onExapndCompare
          }), _cfg.default.hidePanelCyclicVolta(layoutSt) || hideCyclicVolta ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_cyclic_voltamery_data.default, {
            jcampIdx: jcampIdx,
            feature: feature,
            expand: expand === 'cyclicvolta',
            onExapnd: onExapndCyclicVolta,
            userManualLink: userManualLink ? userManualLink.cv : undefined
          })]
        })
      })
    });
  }
}
const mapStateToProps = (state, _) => (
// eslint-disable-line
{
  layoutSt: state.layout,
  curveSt: state.curve
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({}, dispatch);
PanelViewer.propTypes = {
  classes: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  integration: _propTypes.default.object.isRequired,
  editorOnly: _propTypes.default.bool.isRequired,
  molSvg: _propTypes.default.string.isRequired,
  descriptions: _propTypes.default.array.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  canChangeDescription: _propTypes.default.bool.isRequired,
  onDescriptionChanged: _propTypes.default.func,
  entityFileNames: _propTypes.default.array,
  userManualLink: _propTypes.default.object,
  curveSt: _propTypes.default.object.isRequired,
  subLayoutsInfo: _propTypes.default.object,
  exactMass: _propTypes.default.string,
  hideCyclicVolta: _propTypes.default.bool
};
var _default = exports.default = (0, _reactRedux.connect)(
// eslint-disable-line
mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(PanelViewer)); // eslint-disable-line