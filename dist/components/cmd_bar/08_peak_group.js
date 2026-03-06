"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _classnames = _interopRequireDefault(require("classnames"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _Troubleshoot = _interopRequireDefault(require("@mui/icons-material/Troubleshoot"));
var _ui = require("../../actions/ui");
var _common = require("./common");
var _list_ui = require("../../constants/list_ui");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, react/function-component-definition */

const styles = () => Object.assign({}, _common.commonStyle);
const PeakGroup = ({
  classes,
  feature,
  isSelectingGroupSt,
  setUiSweepTypeAct,
  graphIndex
}) => {
  if (!feature || !feature.operation) {
    return null;
  }
  const {
    operation
  } = feature;
  const {
    layout
  } = operation || {};
  if (!layout || !_format.default.isLCMsLayout(layout)) {
    return null;
  }
  const onSelectPeakGroup = () => {
    const payload = {
      graphIndex,
      sweepType: _list_ui.LIST_UI_SWEEP_TYPE.PEAK_GROUP_SELECT
    };
    setUiSweepTypeAct(payload);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: classes.group,
    "data-testid": "Zoom",
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Select peak group"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
        className: (0, _classnames.default)((0, _common.focusStyle)(isSelectingGroupSt, classes), 'btn-sv-bar-zoomin'),
        onClick: onSelectPeakGroup,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Troubleshoot.default, {
          className: (0, _classnames.default)(classes.icon, classes.iconWp)
        })
      })
    })
  });
};
const mapStateToProps = (state, _) => (
// eslint-disable-line
{
  isSelectingGroupSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.PEAK_GROUP_SELECT
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setUiSweepTypeAct: _ui.setUiSweepType
}, dispatch);
PeakGroup.propTypes = {
  classes: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  isSelectingGroupSt: _propTypes.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes.default.func.isRequired,
  graphIndex: _propTypes.default.number.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withStyles.default)(styles))(PeakGroup);