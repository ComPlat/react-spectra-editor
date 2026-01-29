"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabLabel = void 0;
var _react = _interopRequireDefault(require("react"));
var _classnames = _interopRequireDefault(require("classnames"));
var _jsxRuntime = require("react/jsx-runtime");
const TabLabel = exports.TabLabel = function TabLabel(classes, label) {
  let extClsName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'txt-tab-label';
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: (0, _classnames.default)(classes.tabLabel, extClsName),
    children: label
  });
};