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
var _styles = require("@mui/material/styles");
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _info = _interopRequireDefault(require("./info"));
var _peaks = _interopRequireDefault(require("./peaks"));
var _compare = _interopRequireDefault(require("./compare"));
var _multiplicity = _interopRequireDefault(require("./multiplicity"));
var _cyclic_voltamery_data = _interopRequireDefault(require("./cyclic_voltamery_data"));
var _graph_selection = _interopRequireDefault(require("./graph_selection"));
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _format = _interopRequireDefault(require("../../helpers/format"));
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/prop-types, react/require-default-props, max-len */

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
    this.onToggleExpand = this.onToggleExpand.bind(this);
    this.handleDescriptionChanged = this.handleDescriptionChanged.bind(this);
  }
  handleDescriptionChanged(content, delta, source, editor) {
    if (source === 'user') {
      const contentChanged = editor.getContents();
      this.props.onDescriptionChanged(contentChanged); // eslint-disable-line
    }
  }
  onToggleExpand(input) {
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
      entities,
      hideCyclicVolta
    } = this.props;
    const onExpandInfo = () => this.onToggleExpand('info');
    const onExpandPeak = () => this.onToggleExpand('peak');
    const onExpandMpy = () => this.onToggleExpand('mpy');
    const onExpandCompare = () => this.onToggleExpand('compare');
    const onExpandCyclicVolta = () => this.onToggleExpand('cyclicvolta');
    const onExpandGraphSelection = () => this.onToggleExpand('graph');
    const {
      listCurves
    } = curveSt;
    const curveCount = Array.isArray(listCurves) ? listCurves.length : 0;
    const hideGraphSelection = curveCount <= 1 || _format.default.isLCMsLayout(layoutSt);
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
            onExpand: onExpandGraphSelection,
            subLayoutsInfo: subLayoutsInfo
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_info.default, {
            entities: entities,
            feature: feature,
            integration: integration,
            editorOnly: editorOnly,
            expand: expand === 'info',
            molSvg: molSvg,
            exactMass: exactMass,
            onExpand: onExpandInfo,
            descriptions: descriptions,
            canChangeDescription: canChangeDescription,
            onDescriptionChanged: this.handleDescriptionChanged
          }), _cfg.default.hidePanelPeak(layoutSt) ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_peaks.default, {
            expand: expand === 'peak',
            onExapnd: onExpandPeak
          }), _cfg.default.hidePanelMpy(layoutSt) ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_multiplicity.default, {
            expand: expand === 'mpy',
            onExapnd: onExpandMpy
          }), _cfg.default.hidePanelCompare(layoutSt) || curveCount > 1 ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_compare.default, {
            expand: expand === 'compare',
            onExapnd: onExpandCompare
          }), _cfg.default.hidePanelCyclicVolta(layoutSt) || hideCyclicVolta ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_cyclic_voltamery_data.default, {
            jcampIdx: jcampIdx,
            feature: feature,
            expand: expand === 'cyclicvolta',
            onExapnd: onExpandCyclicVolta,
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
PanelViewer.propTypes = {
  classes: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  integration: _propTypes.default.object,
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
  hideCyclicVolta: _propTypes.default.bool,
  entities: _propTypes.default.array
};
PanelViewer.defaultProps = {
  integration: {}
};
var _default = exports.default = (0, _reactRedux.connect)(
// eslint-disable-line
mapStateToProps, null)((0, _withStyles.default)(styles)(PanelViewer)); // eslint-disable-line