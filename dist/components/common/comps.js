"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabLabel = void 0;
var _react = _interopRequireDefault(require("react"));
var _classnames = _interopRequireDefault(require("classnames"));
const TabLabel = function (classes, label) {
  let extClsName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'txt-tab-label';
  return /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.tabLabel, extClsName)
  }, label);
};
exports.TabLabel = TabLabel;