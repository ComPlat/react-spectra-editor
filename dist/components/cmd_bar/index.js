"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _common = require("./common");
var _viewer = _interopRequireDefault(require("./01_viewer"));
var _zoom = _interopRequireDefault(require("./02_zoom"));
var _peak = _interopRequireDefault(require("./03_peak"));
var _integration = _interopRequireDefault(require("./04_integration"));
var _multiplicity = _interopRequireDefault(require("./05_multiplicity"));
var _undo_redo = _interopRequireDefault(require("./06_undo_redo"));
var _r01_layout = _interopRequireDefault(require("./r01_layout"));
var _r03_threshold = _interopRequireDefault(require("./r03_threshold"));
var _r04_submit = _interopRequireDefault(require("./r04_submit"));
var _r07_wavelength_btn = _interopRequireDefault(require("./r07_wavelength_btn"));
var _pecker = _interopRequireDefault(require("./07_pecker"));
var _r08_change_axes = _interopRequireDefault(require("./r08_change_axes"));
var _r09_detector = _interopRequireDefault(require("./r09_detector"));
var _r10_cv_density = _interopRequireDefault(require("./r10_cv_density"));
var _format = _interopRequireDefault(require("../../helpers/format"));
var _list_graph = require("../../constants/list_graph");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props */

const styles = () => Object.assign({}, {
  cardFlex: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 8,
    rowGap: 4
  },
  lcMsToolbarLeft: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 4,
    rowGap: 4,
    flex: '1 1 auto',
    minWidth: 0
  },
  lcMsToolbarRight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: '0 1 auto',
    minWidth: 0
  },
  lcMsToolbarRightCluster: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 8,
    rowGap: 4
  },
  toolbarRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    columnGap: 8,
    rowGap: 12
  },
  toolbarLeft: {
    flex: '1 1 auto',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    rowGap: 4
  },
  // A plain `row`, so the visual order is the DOM order (and the tab order) and
  // matches the LC/MS branch below. Controls start at Layout and are left-aligned;
  // Submit pins itself to the far right with `groupRightMost`'s auto margin.
  toolbarRight: {
    flex: '1 1 auto',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    rowGap: 4
  }
}, _common.commonStyle);
const CmdBar = ({
  classes,
  feature,
  hasEdit,
  forecast,
  operations,
  editorOnly,
  jcampIdx,
  hideThreshold,
  hideMainEditTools,
  layoutSt,
  prependLcMsToolbar
}) => {
  const isCvLayout = _format.default.isCyclicVoltaLayout(layoutSt);

  // Layout first, Submit (its option dropdown and button) last, in every layout.
  const rightCluster = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_r01_layout.default, {
      feature: feature,
      hasEdit: hasEdit
    }), hideThreshold ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_r03_threshold.default, {
      feature: feature,
      hasEdit: hasEdit
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r07_wavelength_btn.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r10_cv_density.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r08_change_axes.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r09_detector.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r04_submit.default, {
      operations: operations,
      feature: feature,
      forecast: forecast,
      editorOnly: editorOnly,
      hideSwitch: false,
      disabled: false
    })]
  });
  if (prependLcMsToolbar) {
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: `${_list_graph.LIST_HOST_HOOK_CLASS.CMD_BAR} ${classes.card} ${classes.cardFlex}`,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: classes.lcMsToolbarLeft,
        children: prependLcMsToolbar
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: classes.lcMsToolbarRight,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: classes.lcMsToolbarRightCluster,
          children: rightCluster
        })
      })]
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: `${_list_graph.LIST_HOST_HOOK_CLASS.CMD_BAR} ${classes.card} ${classes.toolbarRow}`,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.toolbarLeft,
      children: hideMainEditTools ? null : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_viewer.default, {
          editorOnly: editorOnly
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_zoom.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_peak.default, {
          jcampIdx: jcampIdx,
          feature: feature
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_pecker.default, {
          jcampIdx: jcampIdx
        }), isCvLayout ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_integration.default, {}), isCvLayout ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_multiplicity.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_undo_redo.default, {})]
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.toolbarRight,
      children: rightCluster
    })]
  });
};
const mapStateToProps = (state, _) => (
// eslint-disable-line
{
  layoutSt: state.layout
});
CmdBar.propTypes = {
  classes: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  forecast: _propTypes.default.object.isRequired,
  hasEdit: _propTypes.default.bool.isRequired,
  operations: _propTypes.default.array.isRequired,
  editorOnly: _propTypes.default.bool.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  jcampIdx: _propTypes.default.any,
  hideThreshold: _propTypes.default.bool,
  hideMainEditTools: _propTypes.default.bool,
  prependLcMsToolbar: _propTypes.default.node
};
CmdBar.defaultProps = {
  prependLcMsToolbar: null
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, null), (0, _withStyles.default)(styles))(CmdBar);