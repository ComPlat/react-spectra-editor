"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabLabel = void 0;
var _react = _interopRequireDefault(require("react"));
var _classnames = _interopRequireDefault(require("classnames"));
var _jsxRuntime = require("react/jsx-runtime");
const TabLabel = (classes, label, extClsName = 'txt-tab-label') => /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
  className: (0, _classnames.default)(classes.tabLabel, extClsName),
  children: label
});
exports.TabLabel = TabLabel;