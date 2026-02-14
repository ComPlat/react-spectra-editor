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
var _reactDropzone = _interopRequireDefault(require("react-dropzone"));
var _material = require("@mui/material");
var _ExpandMore = _interopRequireDefault(require("@mui/icons-material/ExpandMore"));
var _HighlightOff = _interopRequireDefault(require("@mui/icons-material/HighlightOff"));
var _VisibilityOutlined = _interopRequireDefault(require("@mui/icons-material/VisibilityOutlined"));
var _VisibilityOffOutlined = _interopRequireDefault(require("@mui/icons-material/VisibilityOffOutlined"));
var _styles = require("@mui/styles");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _jcamp = require("../../actions/jcamp");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable function-paren-newline, react/jsx-props-no-spreading,
react/function-component-definition */

const styles = theme => ({
  panel: {
    backgroundColor: '#eee',
    display: 'table-row'
  },
  panelSummary: {
    backgroundColor: '#eee',
    height: 32
  },
  txtBadge: {},
  panelDetail: {
    backgroundColor: '#fff',
    maxHeight: 'calc(90vh - 220px)',
    // ROI
    overflow: 'auto'
  },
  table: {
    width: '100%'
  },
  tTxt: {
    padding: 0
  },
  tTxtHide: {
    color: '#D5D8DC'
  },
  tRow: {
    height: 28,
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette ? theme.palette.background.default : '#d3d3d3'
    }
  },
  rmBtn: {
    color: 'red',
    padding: '0 5px 0 5px',
    '&:hover': {
      borderRadius: 12,
      backgroundColor: 'red',
      color: 'white'
    }
  },
  showBtn: {
    color: 'steelblue',
    padding: '0 5px 0 5px',
    '&:hover': {
      borderRadius: 12,
      backgroundColor: 'steelblue',
      color: 'white'
    }
  },
  hideBtn: {
    color: 'gray',
    padding: '0 5px 0 5px',
    '&:hover': {
      borderRadius: 12,
      backgroundColor: 'gray',
      color: 'white'
    }
  },
  square: {
    textAlign: 'center !important'
  },
  baseDD: {
    backgroundColor: 'white',
    border: '1px dashed black',
    borderRadius: 5,
    height: 26,
    lineHeight: '26px',
    margin: '7px 0 7px 0',
    textAlign: 'center',
    verticalAlign: 'middle',
    width: '90%'
  },
  enableDD: {
    border: '2px dashed #000',
    color: '#000'
  },
  disableDD: {
    border: '2px dashed #aaa',
    color: '#aaa'
  },
  tpCard: {},
  tpMoreTxt: {
    padding: '0 0 0 60px'
  },
  tpLabel: {
    fontSize: 16
  }
});
const msgDefault = 'Add spectra to compare.';
const tpHint = classes => /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
  className: (0, _classnames.default)(classes.tpCard),
  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
    className: (0, _classnames.default)(classes.tpLabel, 'txt-sv-tp'),
    children: "- Accept *.dx, *.jdx, *.JCAMP,"
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
    className: (0, _classnames.default)(classes.tpLabel, 'txt-sv-tp'),
    children: "- Max 5 spectra."
  })]
});
const content = (classes, desc) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
  title: tpHint(classes),
  placement: "bottom",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: (0, _classnames.default)(classes.tpLabel, 'txt-sv-tp'),
    children: desc
  })
});
const inputOthers = (classes, jcampSt) => {
  const {
    selectedIdx,
    jcamps
  } = jcampSt;
  const selectedJcamp = jcamps[selectedIdx];
  const {
    addOthersCb
  } = selectedJcamp;
  const fileName = '';
  const desc = fileName || msgDefault;
  const onDrop = jcampFiles => {
    if (!addOthersCb) return;
    addOthersCb({
      jcamps: jcampFiles
    });
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactDropzone.default, {
    className: "dropbox",
    onDrop: onDrop,
    children: _ref => {
      let {
        getRootProps,
        getInputProps
      } = _ref;
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        ...getRootProps(),
        className: (0, _classnames.default)(classes.baseDD),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          ...getInputProps()
        }), content(classes, desc)]
      });
    }
  });
};
const compareList = (classes, jcampSt, rmOthersOneAct, toggleShowAct) => {
  const {
    selectedIdx,
    jcamps
  } = jcampSt;
  const selectedJcamp = jcamps[selectedIdx];
  const {
    others
  } = selectedJcamp;
  const rows = others.map((o, idx) => ({
    idx,
    title: o.spectra[0].title,
    color: _format.default.compareColors(idx),
    rmCb: () => rmOthersOneAct(idx),
    isShow: o.show,
    toggleShowCb: () => toggleShowAct(idx)
  }));
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Table, {
    className: classes.table,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableBody, {
      children: rows.map(row => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableRow, {
        className: classes.tRow,
        hover: true,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
          align: "right",
          className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt'),
          style: {
            backgroundColor: row.color
          },
          children: row.idx + 1
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
          align: "right",
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt', row.isShow ? null : classes.tTxtHide),
          children: row.title
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableCell, {
          align: "right",
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          children: [row.isShow ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_VisibilityOutlined.default, {
            onClick: row.toggleShowCb,
            className: classes.showBtn
          }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_VisibilityOffOutlined.default, {
            onClick: row.toggleShowCb,
            className: classes.hideBtn
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_HighlightOff.default, {
            onClick: row.rmCb,
            className: classes.rmBtn
          })]
        })]
      }, row.idx))
    })
  });
};
const ComparePanel = _ref2 => {
  let {
    classes,
    expand,
    onExapnd,
    jcampSt,
    rmOthersOneAct,
    toggleShowAct
  } = _ref2;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Accordion, {
    expanded: expand,
    onChange: onExapnd,
    disableGutters: true,
    sx: {
      '&.MuiAccordion-root.Mui-expanded': {
        margin: 0
      },
      '&:before': {
        display: 'none'
      }
    },
    TransitionProps: {
      unmountOnExit: true
    } // increase Accordion performance
    ,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.AccordionSummary, {
      expandIcon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ExpandMore.default, {}),
      className: (0, _classnames.default)(classes.panelSummary),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Typography, {
        className: "txt-panel-header",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtBadge, 'txt-sv-panel-title'),
          children: "Spectra Comparisons"
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Divider, {}), inputOthers(classes, jcampSt), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: (0, _classnames.default)(classes.panelDetail),
      children: compareList(classes, jcampSt, rmOthersOneAct, toggleShowAct)
    })]
  });
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  jcampSt: state.jcamp
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  rmOthersOneAct: _jcamp.rmOthersOne,
  toggleShowAct: _jcamp.toggleShow
}, dispatch);
ComparePanel.propTypes = {
  classes: _propTypes.default.object.isRequired,
  expand: _propTypes.default.bool.isRequired,
  onExapnd: _propTypes.default.func.isRequired,
  jcampSt: _propTypes.default.object.isRequired,
  rmOthersOneAct: _propTypes.default.func.isRequired,
  toggleShowAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(ComparePanel));