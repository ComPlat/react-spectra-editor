'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabLabel = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TabLabel = function TabLabel(classes, label) {
  var extClsName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'txt-tab-label';
  return _react2.default.createElement(
    'span',
    {
      className: (0, _classnames2.default)(classes.tabLabel, extClsName)
    },
    label
  );
};

exports.TabLabel = TabLabel;