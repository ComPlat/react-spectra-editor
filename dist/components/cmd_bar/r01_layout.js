"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
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
  if (_cfg.default.hideSolvent(layoutSt)) return null;
  // const onChange = (e) => setShiftRefAct(e.target.value);
  const {
    curveIdx
  } = curveSt;
  const {
    shifts
  } = shiftSt;
  const selectedShift = shifts[curveIdx];
  const shiftRef = selectedShift.ref;
  const onChange = e => {
    const payload = {
      dataToSet: e.target.value,
      curveIdx
    };
    setShiftRefAct(payload);
  };
  const listShift = (0, _list_shift.getListShift)(layoutSt);
  const content = listShift.map(ref => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
    value: ref,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: (0, _classnames.default)(classes.txtOpt, 'option-sv-bar-shift'),
      children: `${ref.name}: ${_format.default.strNumberFixedDecimal(ref.value, 2)} ppm`
    })
  }, ref.name));
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    className: (0, _classnames.default)(classes.fieldShift),
    variant: "outlined",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "select-solvent-label",
      className: (0, _classnames.default)(classes.selectLabel, 'select-sv-bar-label'),
      children: "Reference"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Select, {
      value: shiftRef,
      labelId: "select-solvent-label",
      label: "Solvent",
      onChange: onChange,
      className: (0, _classnames.default)(classes.selectInput, 'input-sv-bar-shift'),
      children: content
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
const Layout = ({
  classes,
  feature,
  hasEdit,
  layoutSt,
  setShiftRefAct,
  updateLayoutAct,
  curveSt,
  shiftSt
}) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
  className: classes.groupRight,
  children: [layoutSelect(classes, layoutSt, updateLayoutAct), shiftSelect(classes, layoutSt, setShiftRefAct, shiftSt, curveSt), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r02_scan.default, {
    feature: feature,
    hasEdit: hasEdit
  })]
});
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