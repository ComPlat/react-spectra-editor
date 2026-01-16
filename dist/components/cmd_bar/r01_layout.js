"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _material = require("@mui/material");
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _r02_scan = _interopRequireDefault(require("./r02_scan"));
var _layout = require("../../actions/layout");
var _shift = require("../../actions/shift");
var _list_layout = require("../../constants/list_layout");
var _list_shift = require("../../constants/list_shift");
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _common = require("./common");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition */

const styles = () => Object.assign({
  fieldShift: {
    width: 160
  },
  fieldLayout: {
    width: 100
  }
}, _common.commonStyle);
const shiftSelect = (classes, layoutSt, setShiftRefAct, shiftSt, curveSt) => {
  if (_cfg.default.hideSolvent(layoutSt)) {
    return null;
  }
  const {
    curveIdx
  } = curveSt;
  const {
    shifts
  } = shiftSt;
  const selectedShift = shifts[curveIdx] || {};
  const listShift = (0, _list_shift.getListShift)(layoutSt) || [];
  const shiftRefName = selectedShift?.ref?.name || '';
  const isInList = listShift.some(r => r.name === shiftRefName);
  const selectValue = isInList ? shiftRefName : '';
  const onChange = e => {
    const name = e.target.value;
    const refObj = listShift.find(r => r.name === name);
    if (refObj) {
      setShiftRefAct({
        dataToSet: refObj,
        curveIdx
      });
    }
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldShift),
    variant: "outlined",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "select-solvent-label",
      className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
      children: "Reference"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Select, {
      value: selectValue,
      labelId: "select-solvent-label",
      label: "Solvent",
      onChange: onChange,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-shift'),
      children: listShift.map(ref => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: ref.name,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-shift'),
          children: `${ref.name}: ${_format.default.strNumberFixedDecimal(ref.value, 2)} ppm`
        })
      }, ref.name))
    })]
  });
};
const layoutSelect = (classes, layoutSt, updateLayoutAct) => {
  const onChange = e => updateLayoutAct(e.target.value);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldLayout),
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "select-layout-label",
      className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
      children: "Layout"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Select, {
      labelId: "select-layout-label",
      label: "Layout",
      value: layoutSt,
      onChange: onChange,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-layout'),
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.PLAIN,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "plain"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.IR,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "IR"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.RAMAN,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "RAMAN"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.UVVIS,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "UV/VIS"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.HPLC_UVVIS,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "HPLC UV/VIS"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.TGA,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "TGA (THERMOGRAVIMETRIC ANALYSIS)"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.DSC,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "DSC (DIFFERENTIAL SCANNING CALORIMETRY)"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.XRD,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "XRD (X-RAY DIFFRACTION)"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.H1,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("sup", {
            children: "1"
          }), "H"]
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.C13,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("sup", {
            children: "13"
          }), "C"]
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.F19,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("sup", {
            children: "19"
          }), "F"]
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.P31,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("sup", {
            children: "31"
          }), "P"]
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.N15,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("sup", {
            children: "15"
          }), "N"]
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.Si29,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("sup", {
            children: "29"
          }), "Si"]
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.MS,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "MS"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "CV (CYCLIC VOLTAMMETRY)"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.CDS,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "CDS (CIRCULAR DICHROISM SPECTROSCOPY)"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.SEC,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "SEC"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.GC,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "GC (GAS CHROMATOGRAPHY)"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.AIF,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "SORPTION-DESORPTION"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.EMISSIONS,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "EMISSIONS"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.DLS_ACF,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "DLS ACF"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: _list_layout.LIST_LAYOUT.DLS_INTENSITY,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-layout'),
          children: "DLS INTENSITY"
        })
      })]
    })]
  });
};
const PLACEHOLDER = '- - -';
const norm = s => (s || '').toString().toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '');
function solventKeyOf(feature) {
  const r = feature?.metadata?.solventName ?? feature?.metadata?.solvent ?? feature?.meta?.solventName ?? feature?.meta?.solvent ?? feature?.solventName ?? feature?.solvent ?? null;
  const a = feature?.metadata?.solvent_label ?? feature?.metadata?.solventLabel ?? null;
  const raw = r && r !== PLACEHOLDER ? r : null;
  const alt = a && a !== PLACEHOLDER ? a : null;
  return norm(raw || alt || '');
}
function pickBestRef(list, key) {
  if (!key || !list?.length) return null;
  const scored = [];
  list.forEach(r => {
    const nLabel = norm(r.label);
    const nName = norm(r.name);
    const nNsdb = norm(r.nsdb);
    let s = 0;
    if (nLabel && nLabel === key) s += 3;
    if (nNsdb && nNsdb.includes(key)) s += 2;
    if (nName && nName.includes(key)) s += 1;
    if (s > 0) scored.push({
      r,
      s
    });
  });
  if (!scored.length) return null;
  let max = 0;
  scored.forEach(x => {
    if (x.s > max) max = x.s;
  });
  let cand = scored.filter(x => x.s === max).map(x => x.r);
  if (cand.length > 1) {
    const vals = cand.map(c => typeof c.value === 'number' ? c.value : null).filter(v => v != null).sort((a, b) => a - b);
    if (vals.length) {
      const m = vals[Math.floor(vals.length / 2)];
      cand = cand.slice().sort((a, b) => Math.abs((a.value ?? m) - m) - Math.abs((b.value ?? m) - m));
    }
    if (cand.length > 1) {
      cand.sort((a, b) => (a.name?.length || 0) - (b.name?.length || 0));
    }
  }
  return cand[0] || null;
}
function isRefUnset(shiftSt, curveIdx, list) {
  const name = shiftSt?.shifts?.[curveIdx]?.ref?.name || '';
  if (!name || name === PLACEHOLDER) return true;
  return !(list || []).some(r => r.name === name);
}
const Layout = ({
  classes,
  feature,
  hasEdit,
  layoutSt,
  setShiftRefAct,
  updateLayoutAct,
  curveSt,
  shiftSt
}) => {
  const {
    curveIdx
  } = curveSt;
  const list = (0, _list_shift.getListShift)(layoutSt) || [];
  const unset = isRefUnset(shiftSt, curveIdx, list);
  const key = solventKeyOf(feature);
  const best = pickBestRef(list, key);
  (0, _react.useEffect)(() => {
    if (unset && best) setShiftRefAct({
      dataToSet: best,
      curveIdx
    });
  }, [unset, best, curveIdx, setShiftRefAct]);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
    className: classes.groupRight,
    children: [layoutSelect(classes, layoutSt, updateLayoutAct), shiftSelect(classes, layoutSt, setShiftRefAct, shiftSt, curveSt), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r02_scan.default, {
      feature: feature,
      hasEdit: hasEdit
    })]
  });
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  layoutSt: state.layout,
  curveSt: state.curve,
  shiftSt: state.shift
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setShiftRefAct: _shift.setShiftRef,
  updateLayoutAct: _layout.updateLayout
}, dispatch);
Layout.propTypes = {
  classes: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  hasEdit: _propTypes.default.bool.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  setShiftRefAct: _propTypes.default.func.isRequired,
  updateLayoutAct: _propTypes.default.func.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  shiftSt: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(Layout));