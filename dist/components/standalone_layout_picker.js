"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.LAYOUT_GROUPS = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/function-component-definition, react/require-default-props */

const LAYOUT_GROUPS = exports.LAYOUT_GROUPS = [{
  title: 'NMR',
  items: [{
    typ: 'nmr 1h',
    label: 'NMR ¹H'
  }, {
    typ: 'nmr 13c',
    label: 'NMR ¹³C'
  }, {
    typ: 'nmr 13c dept',
    label: 'NMR ¹³C DEPT'
  }, {
    typ: 'nmr 19f',
    label: 'NMR ¹⁹F'
  }, {
    typ: 'nmr 31p',
    label: 'NMR ³¹P'
  }, {
    typ: 'nmr 15n',
    label: 'NMR ¹⁵N'
  }, {
    typ: 'nmr 29si',
    label: 'NMR ²⁹Si'
  }]
}, {
  title: 'Spectroscopy',
  items: [{
    typ: 'ir',
    label: 'IR'
  }, {
    typ: 'raman',
    label: 'Raman'
  }, {
    typ: 'uv/vis',
    label: 'UV/VIS',
    id: 'btn-uv-vis'
  }, {
    typ: 'emissions',
    label: 'Emissions'
  }]
}, {
  title: 'Chromatography',
  items: [{
    typ: 'hplc uv/vis',
    label: 'HPLC UV/VIS',
    id: 'btn-hplc'
  }, {
    typ: 'gc',
    label: 'GC',
    id: 'btn-gc'
  }, {
    typ: 'sec',
    label: 'SEC',
    id: 'btn-sec'
  }]
}, {
  title: 'Thermal & diffraction',
  items: [{
    typ: 'tga',
    label: 'TGA',
    id: 'btn-tga'
  }, {
    typ: 'dsc',
    label: 'DSC',
    id: 'btn-dsc'
  }, {
    typ: 'xrd',
    label: 'XRD',
    id: 'btn-xrd'
  }]
}, {
  title: 'Electrochemistry & surface',
  items: [{
    typ: 'cyclic volta',
    label: 'CV',
    id: 'btn-cv'
  }, {
    typ: 'cds',
    label: 'CDS'
  }, {
    typ: 'aif',
    label: 'Sorption–desorption',
    id: 'btn-sod'
  }]
}, {
  title: 'Other',
  items: [{
    typ: 'dls acf',
    label: 'DLS ACF'
  }, {
    typ: 'dls intensity',
    label: 'DLS intensity'
  }, {
    typ: 'ms',
    label: 'MS'
  }]
}, {
  title: 'Multi-spectrum',
  items: [{
    typ: 'multi',
    label: 'Multi NMR'
  }, {
    typ: 'multi ir',
    label: 'Multi IR'
  }, {
    typ: 'multi hplc',
    label: 'Multi HPLC'
  }, {
    typ: 'multi xrd',
    label: 'Multi XRD'
  }]
}];
const styles = () => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    fontFamily: 'Helvetica, Arial, sans-serif',
    gap: 10,
    margin: '4px 12px 6px',
    maxWidth: 1180,
    minHeight: 36
  },
  kicker: {
    color: '#66727c',
    flex: '0 0 auto',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  },
  field: {
    flex: '1 1 280px',
    maxWidth: 420,
    minWidth: 220,
    '& .MuiInputLabel-root': {
      color: '#66727c',
      fontSize: '0.72rem'
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#fff',
      fontSize: '0.82rem',
      height: 34
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e6e8eb'
    },
    '& .MuiSelect-select': {
      padding: '6px 32px 6px 10px'
    }
  },
  groupHeader: {
    backgroundColor: '#f8fafc',
    color: '#66727c',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    lineHeight: '28px',
    textTransform: 'uppercase'
  },
  menuItem: {
    fontSize: '0.82rem',
    minHeight: 32
  }
});
const handleSelect = (onSelect, typ) => {
  const action = onSelect(typ);
  if (typeof action === 'function') action();
};
const StandaloneLayoutPicker = ({
  classes,
  selectedTyp,
  onSelect
}) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
  className: classes.root,
  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: classes.kicker,
    children: "Demo layout"
  }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.FormControl, {
    size: "small",
    variant: "outlined",
    className: classes.field,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputLabel, {
      id: "standalone-layout-label",
      children: "Spectrum"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Select, {
      labelId: "standalone-layout-label",
      label: "Spectrum",
      value: selectedTyp,
      MenuProps: {
        PaperProps: {
          style: {
            maxHeight: 360
          }
        }
      },
      onChange: e => handleSelect(onSelect, e.target.value),
      children: LAYOUT_GROUPS.flatMap(group => [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.ListSubheader, {
        className: classes.groupHeader,
        children: group.title
      }, `header-${group.title}`), ...group.items.map(({
        typ,
        label,
        id
      }) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        id: id,
        value: typ,
        className: classes.menuItem,
        children: label
      }, typ))])
    })]
  })]
});
StandaloneLayoutPicker.propTypes = {
  classes: _propTypes.default.object.isRequired,
  selectedTyp: _propTypes.default.string.isRequired,
  onSelect: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _styles.withStyles)(styles)(StandaloneLayoutPicker);