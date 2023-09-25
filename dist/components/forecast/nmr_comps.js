"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SectionReference = exports.NmrTableHeader = exports.NmrTableBodyRow = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _material = require("@mui/material");
var _CheckCircleOutline = _interopRequireDefault(require("@mui/icons-material/CheckCircleOutline"));
var _HighlightOff = _interopRequireDefault(require("@mui/icons-material/HighlightOff"));
var _comps = require("./comps");
var _forecast = require("../../actions/forecast");
/* eslint-disable react/function-component-definition, react/destructuring-assignment */

const baseSelectNmrStatus = _ref => {
  let {
    // eslint-disable-line
    idx,
    atom,
    status,
    identity,
    setNmrStatusAct
  } = _ref;
  const theStatus = ['accept', 'reject'].includes(status) ? status : '';
  return /*#__PURE__*/_react.default.createElement(_material.FormControl, null, /*#__PURE__*/_react.default.createElement(_material.Select, {
    value: theStatus,
    onChange: e => {
      setNmrStatusAct({
        predictions: {
          idx,
          atom,
          identity,
          value: e.target.value
        },
        svgs: []
      });
    }
  }, /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: "accept"
  }, /*#__PURE__*/_react.default.createElement(_CheckCircleOutline.default, {
    style: {
      color: '#4caf50'
    }
  })), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: "reject"
  }, /*#__PURE__*/_react.default.createElement(_HighlightOff.default, {
    style: {
      color: '#e91e63'
    }
  })), /*#__PURE__*/_react.default.createElement(_material.MenuItem, {
    value: ""
  }, /*#__PURE__*/_react.default.createElement("span", null))));
};
const bssMapStateToProps = (state, props) => (
// eslint-disable-line
{});
const bssMapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setNmrStatusAct: _forecast.setNmrStatus
}, dispatch);
baseSelectNmrStatus.propTypes = {
  idx: _propTypes.default.number.isRequired,
  atom: _propTypes.default.number.isRequired,
  status: _propTypes.default.string,
  identity: _propTypes.default.string.isRequired,
  setNmrStatusAct: _propTypes.default.func.isRequired
};
baseSelectNmrStatus.defaultProps = {
  status: ''
};
const SelectNmrStatus = (0, _reactRedux.connect)(
// eslint-disable-line
bssMapStateToProps, bssMapDispatchToProps)(baseSelectNmrStatus); // eslint-disable-line

const numFormat = input => parseFloat(input).toFixed(2);
const realFormat = (val, status) => {
  if (status === 'missing') {
    return '- - -';
  }
  return numFormat(val);
};
const NmrTableHeader = classes => /*#__PURE__*/_react.default.createElement(_material.TableHead, null, /*#__PURE__*/_react.default.createElement(_material.TableRow, null, /*#__PURE__*/_react.default.createElement(_material.TableCell, null, (0, _comps.TxtLabel)(classes, 'Atom', 'txt-prd-table-title')), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
  align: "right"
}, (0, _comps.TxtLabel)(classes, 'Prediction (ppm)', 'txt-prd-table-title')), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
  align: "right"
}, (0, _comps.TxtLabel)(classes, 'Real (ppm)', 'txt-prd-table-title')), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
  align: "right"
}, (0, _comps.TxtLabel)(classes, 'Diff (ppm)', 'txt-prd-table-title')), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
  align: "right"
}, (0, _comps.TxtLabel)(classes, 'Machine', 'txt-prd-table-title')), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
  align: "right"
}, (0, _comps.TxtLabel)(classes, 'Owner', 'txt-prd-table-title'))));
exports.NmrTableHeader = NmrTableHeader;
const NmrTableBodyRow = (classes, row, idx) => /*#__PURE__*/_react.default.createElement(_material.TableRow, {
  key: `${idx}-${row.atom}`
}, /*#__PURE__*/_react.default.createElement(_material.TableCell, {
  component: "th",
  scope: "row"
}, (0, _comps.TxtLabel)(classes, row.atom, 'txt-prd-table-content')), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
  align: "right"
}, (0, _comps.TxtLabel)(classes, numFormat(row.prediction), 'txt-prd-table-content')), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
  align: "right"
}, (0, _comps.TxtLabel)(classes, realFormat(row.real, row.status), 'txt-prd-table-content')), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
  align: "right"
}, (0, _comps.TxtLabel)(classes, realFormat(row.diff, row.status), 'txt-prd-table-content')), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
  align: "right"
}, (0, _comps.StatusIcon)(row.status)), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
  align: "right"
}, /*#__PURE__*/_react.default.createElement(SelectNmrStatus, {
  idx: idx,
  atom: row.atom,
  status: row.statusOwner,
  identity: "Owner"
})));
exports.NmrTableBodyRow = NmrTableBodyRow;
const SectionReference = classes => /*#__PURE__*/_react.default.createElement("div", {
  className: (0, _classnames.default)(classes.reference)
}, /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement("span", null, "NMR prediction source: "), /*#__PURE__*/_react.default.createElement("a", {
  href: "https://www.ncbi.nlm.nih.gov/pubmed/15464159",
  target: "_blank",
  rel: "noopener noreferrer"
}, "nmrshiftdb")));
exports.SectionReference = SectionReference;