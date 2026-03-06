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
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/function-component-definition, react/destructuring-assignment */

const baseSelectNmrStatus = ({
  // eslint-disable-line
  idx,
  atom,
  status,
  identity,
  setNmrStatusAct
}) => {
  const theStatus = ['accept', 'reject'].includes(status) ? status : '';
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.FormControl, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Select, {
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
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: "accept",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_CheckCircleOutline.default, {
          style: {
            color: '#4caf50'
          }
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: "reject",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HighlightOff.default, {
          style: {
            color: '#e91e63'
          }
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: "",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {})
      })]
    })
  });
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
const NmrTableHeader = classes => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableHead, {
  children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableRow, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      children: (0, _comps.TxtLabel)(classes, 'Atom', 'txt-prd-table-title')
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "right",
      children: (0, _comps.TxtLabel)(classes, 'Prediction (ppm)', 'txt-prd-table-title')
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "right",
      children: (0, _comps.TxtLabel)(classes, 'Real (ppm)', 'txt-prd-table-title')
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "right",
      children: (0, _comps.TxtLabel)(classes, 'Diff (ppm)', 'txt-prd-table-title')
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "right",
      children: (0, _comps.TxtLabel)(classes, 'Machine', 'txt-prd-table-title')
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "right",
      children: (0, _comps.TxtLabel)(classes, 'Owner', 'txt-prd-table-title')
    })]
  })
});
exports.NmrTableHeader = NmrTableHeader;
const NmrTableBodyRow = (classes, row, idx) => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableRow, {
  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
    component: "th",
    scope: "row",
    children: (0, _comps.TxtLabel)(classes, row.atom, 'txt-prd-table-content')
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
    align: "right",
    children: (0, _comps.TxtLabel)(classes, numFormat(row.prediction), 'txt-prd-table-content')
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
    align: "right",
    children: (0, _comps.TxtLabel)(classes, realFormat(row.real, row.status), 'txt-prd-table-content')
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
    align: "right",
    children: (0, _comps.TxtLabel)(classes, realFormat(row.diff, row.status), 'txt-prd-table-content')
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
    align: "right",
    children: (0, _comps.StatusIcon)(row.status)
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
    align: "right",
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(SelectNmrStatus, {
      idx: idx,
      atom: row.atom,
      status: row.statusOwner,
      identity: "Owner"
    })
  })]
}, `${idx}-${row.atom}`);
exports.NmrTableBodyRow = NmrTableBodyRow;
const SectionReference = classes => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
  className: (0, _classnames.default)(classes.reference),
  children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      children: "NMR prediction source: "
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("a", {
      href: "https://www.ncbi.nlm.nih.gov/pubmed/15464159",
      target: "_blank",
      rel: "noopener noreferrer",
      children: "nmrshiftdb"
    })]
  })
});
exports.SectionReference = SectionReference;