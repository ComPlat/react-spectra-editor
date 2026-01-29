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
var _classnames = _interopRequireDefault(require("classnames"));
var _reduxUndo = require("redux-undo");
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _RedoOutlined = _interopRequireDefault(require("@mui/icons-material/RedoOutlined"));
var _UndoOutlined = _interopRequireDefault(require("@mui/icons-material/UndoOutlined"));
var _common = require("./common");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props, max-len,
react/no-unused-prop-types */

const styles = () => Object.assign({}, _common.commonStyle);
const UndoRedo = _ref => {
  let {
    classes,
    canUndo,
    canRedo,
    onUndoAct,
    onRedoAct
  } = _ref;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
    className: classes.group,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Undo"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: (0, _classnames.default)('btn-sv-bar-undo'),
          disabled: !canUndo,
          onClick: onUndoAct,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_UndoOutlined.default, {
            className: classes.icon
          })
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "txt-sv-tp",
        children: "Redo"
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: (0, _classnames.default)('btn-sv-bar-redo'),
          disabled: !canRedo,
          onClick: onRedoAct,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_RedoOutlined.default, {
            className: classes.icon
          })
        })
      })
    })]
  });
};
const canUndoFunc = state => state.editPeak.past.length > 0 || state.integration.past.length > 0 || state.multiplicity.past.length > 0;
const canRedoFunc = state => state.editPeak.future.length > 0 || state.integration.future.length > 0 || state.multiplicity.future.length > 0;
const mapStateToProps = (state, _) => (
// eslint-disable-line
{
  canUndo: canUndoFunc(state),
  canRedo: canRedoFunc(state)
});
const mapDispatchToProps = dispatch => ({
  onUndoAct: () => dispatch(_reduxUndo.ActionCreators.undo()),
  onRedoAct: () => dispatch(_reduxUndo.ActionCreators.redo())
});
UndoRedo.propTypes = {
  classes: _propTypes.default.object.isRequired,
  canUndo: _propTypes.default.bool.isRequired,
  canRedo: _propTypes.default.bool.isRequired,
  onUndoAct: _propTypes.default.func.isRequired,
  onRedoAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withStyles.default)(styles))(UndoRedo);