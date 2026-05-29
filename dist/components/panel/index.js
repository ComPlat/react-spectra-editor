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
      default: '#fff'
    }
  }
});
const styles = () => ({
  panels: {
    maxHeight: 'calc(90vh - 220px)',
    // ROI
    display: 'block',
    overflowX: 'hidden',
    overflowY: 'auto',
    boxSizing: 'border-box',
    margin: '4px 4px 0 4px',
    padding: 0,
    width: 'calc(100% - 8px)',
    backgroundColor: '#fff',
    overflow: 'hidden auto',
    fontFamily: 'Helvetica, Arial, sans-serif',
    '& .MuiAccordion-root': {
      backgroundColor: '#fff',
      borderBottom: '1px solid #e6e8eb',
      boxShadow: 'none'
    },
    '& .MuiAccordion-root:last-child': {
      borderBottom: 'none'
    },
    '& .MuiAccordion-root.Mui-expanded': {
      margin: 0
    },
    '& .MuiAccordionSummary-root': {
      minHeight: 38,
      height: 38,
      padding: '0 12px',
      background: 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)',
      color: '#25313b',
      borderBottom: '1px solid transparent'
    },
    '& .MuiAccordionSummary-root.Mui-expanded': {
      minHeight: 38,
      height: 38,
      borderBottom: '1px solid #e1e5e8'
    },
    '& .MuiAccordionSummary-content': {
      margin: 0,
      alignItems: 'center'
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
      margin: 0
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: '#66727c'
    },
    '& .txt-panel-header': {
      width: '100%'
    },
    '& .txt-sv-panel-title': {
      fontSize: '0.72rem',
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#25313b'
    },
    '& .MuiDivider-root': {
      display: 'none'
    },
    '& .MuiList-root': {
      padding: '4px 0'
    },
    '&::-webkit-scrollbar': {
      width: 8
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#cbd5df',
      borderRadius: 8
    }
  }
});
class PanelViewer extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: ['info', 'graph']
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
    const nextExpand = expand.includes(input) ? expand.filter(item => item !== input) : [...expand, input];
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
    const isExpanded = name => expand.includes(name);
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
            expand: isExpanded('graph'),
            onExapnd: onExapndGraphSelection,
            subLayoutsInfo: subLayoutsInfo
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_info.default, {
            feature: feature,
            integration: integration,
            editorOnly: editorOnly,
            expand: isExpanded('info'),
            molSvg: molSvg,
            exactMass: exactMass,
            onExapnd: onExapndInfo,
            descriptions: descriptions,
            canChangeDescription: canChangeDescription,
            onDescriptionChanged: this.handleDescriptionChanged
          }), _cfg.default.hidePanelPeak(layoutSt) ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_peaks.default, {
            expand: isExpanded('peak'),
            onExapnd: onExapndPeak
          }), _cfg.default.hidePanelMpy(layoutSt) ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_multiplicity.default, {
            expand: isExpanded('mpy'),
            onExapnd: onExapndMpy
          }), _cfg.default.hidePanelCompare(layoutSt) || listCurves.length > 1 ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_compare.default, {
            expand: isExpanded('compare'),
            onExapnd: onExapndCompare
          }), _cfg.default.hidePanelCyclicVolta(layoutSt) || hideCyclicVolta ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_cyclic_voltamery_data.default, {
            jcampIdx: jcampIdx,
            feature: feature,
            expand: isExpanded('cyclicvolta'),
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