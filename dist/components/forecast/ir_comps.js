"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IrTableHeader = exports.IrTableBodyRow = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _classnames = _interopRequireDefault(require("classnames"));
var _Select = _interopRequireDefault(require("@material-ui/core/Select"));
var _FormControl = _interopRequireDefault(require("@material-ui/core/FormControl"));
var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));
var _CheckCircleOutline = _interopRequireDefault(require("@material-ui/icons/CheckCircleOutline"));
var _HighlightOff = _interopRequireDefault(require("@material-ui/icons/HighlightOff"));
var _TableCell = _interopRequireDefault(require("@material-ui/core/TableCell"));
var _TableHead = _interopRequireDefault(require("@material-ui/core/TableHead"));
var _TableRow = _interopRequireDefault(require("@material-ui/core/TableRow"));
var _comps = require("./comps");
var _forecast = require("../../actions/forecast");
/* eslint-disable react/function-component-definition, function-paren-newline,
prefer-object-spread */

// import SmaToSvg from '../common/chem';

const baseSelectIrStatus = _ref => {
  let {
    sma,
    status,
    identity,
    setIrStatusAct
  } = _ref;
  const theStatus = ['accept', 'reject'].includes(status) ? status : '';
  return /*#__PURE__*/_react.default.createElement(_FormControl.default, null, /*#__PURE__*/_react.default.createElement(_Select.default, {
    value: theStatus,
    onChange: e => {
      setIrStatusAct({
        predictions: {
          sma,
          identity,
          value: e.target.value
        },
        svgs: []
      });
    }
  }, /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: "accept"
  }, /*#__PURE__*/_react.default.createElement(_CheckCircleOutline.default, {
    style: {
      color: '#4caf50'
    }
  })), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: "reject"
  }, /*#__PURE__*/_react.default.createElement(_HighlightOff.default, {
    style: {
      color: '#e91e63'
    }
  })), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    value: ""
  }, /*#__PURE__*/_react.default.createElement("span", null))));
};
const bssMapStateToProps = (state, props) => (
// eslint-disable-line
{});
const bssMapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setIrStatusAct: _forecast.setIrStatus
}, dispatch);
baseSelectIrStatus.propTypes = {
  sma: _propTypes.default.string.isRequired,
  status: _propTypes.default.string,
  identity: _propTypes.default.string.isRequired,
  setIrStatusAct: _propTypes.default.func.isRequired
};
baseSelectIrStatus.defaultProps = {
  status: ''
};
const SelectIrStatus = (0, _reactRedux.connect)(bssMapStateToProps, bssMapDispatchToProps)(baseSelectIrStatus);
const IrTableHeader = classes => /*#__PURE__*/_react.default.createElement(_TableHead.default, null, /*#__PURE__*/_react.default.createElement(_TableRow.default, null, /*#__PURE__*/_react.default.createElement(_TableCell.default, null), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
  align: "left"
}, (0, _comps.TxtLabel)(classes, 'FG SMARTS', 'txt-prd-table-title')), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
  align: "right"
}, (0, _comps.TxtLabel)(classes, 'Machine Confidence', 'txt-prd-table-title')), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
  align: "right"
}, (0, _comps.TxtLabel)(classes, 'Machine', 'txt-prd-table-title')), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
  align: "right"
}, (0, _comps.TxtLabel)(classes, 'Owner', 'txt-prd-table-title'))));
exports.IrTableHeader = IrTableHeader;
const colorStyles = [{
  backgroundColor: '#FFFF00'
}, {
  backgroundColor: '#87CEFA'
}, {
  backgroundColor: '#FFB6C1'
}, {
  backgroundColor: '#00FF00'
}, {
  backgroundColor: '#E6E6FA'
}, {
  backgroundColor: '#FFD700'
}, {
  backgroundColor: '#F0FFFF'
}, {
  backgroundColor: '#F5F5DC'
}];
const colorLabel = function (classes, idx) {
  let extClsName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'txt-label';
  const style = Object.assign({}, colorStyles[idx % 8], {
    width: 20,
    borderRadius: 20,
    textAlign: 'center'
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    style: style
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtLabel, extClsName)
  }, idx + 1));
};
const IrTableBodyRow = (classes, idx, fg) => /*#__PURE__*/_react.default.createElement(_TableRow.default, {
  key: `${idx}-${fg.name}`
}, /*#__PURE__*/_react.default.createElement(_TableCell.default, {
  component: "th",
  scope: "row"
}, colorLabel(classes, idx)), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
  align: "left"
}, (0, _comps.TxtLabel)(classes, fg.sma, 'txt-prd-table-content')), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
  align: "right"
}, (0, _comps.ConfidenceLabel)(classes, fg.confidence, 'txt-prd-table-content')), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
  align: "right"
}, (0, _comps.StatusIcon)(fg.status)), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
  align: "right"
}, /*#__PURE__*/_react.default.createElement(SelectIrStatus, {
  sma: fg.sma,
  status: fg.statusOwner,
  identity: "Owner"
})));
exports.IrTableBodyRow = IrTableBodyRow;