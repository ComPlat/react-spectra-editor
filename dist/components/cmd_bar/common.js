"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.focusStyle = exports.commonStyle = exports.MuButton = void 0;
var _react = _interopRequireDefault(require("react"));
var _styles = require("@mui/styles");
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _classnames = _interopRequireDefault(require("classnames"));
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable no-unused-vars, max-len, indent, react/function-component-definition, react/self-closing-comp, react/prop-types, react/jsx-props-no-spreading */

const useStyles = (0, _styles.makeStyles)(theme => ({
  muiBtn: {
    border: '1px solid #ccc',
    borderRadius: 4,
    fontFamily: 'Helvetica',
    fontSize: 20,
    height: 30,
    lineHeight: '20px',
    minWidth: 30,
    padding: 0,
    width: 30,
    color: 'black'
  }
}));
const MuButton = props => {
  const classes = useStyles();
  const {
    className,
    ...other
  } = props;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
    className: (0, _classnames.default)(classes.muiBtn, className),
    ...other
  });
};
exports.MuButton = MuButton;
const commonStyle = exports.commonStyle = {
  card: {
    margin: '0 0 5px 52px',
    border: '1px solid white',
    borderRadius: 4
  },
  group: {
    display: 'inline-block',
    margin: '0px 0px 0px 10px',
    verticalAlign: 'middle'
  },
  groupRightMost: {
    display: 'inline-block',
    float: 'right',
    margin: '0px 0px 0px 10px',
    verticalAlign: 'middle'
  },
  groupRight: {
    display: 'inline-block',
    float: 'right',
    margin: '0px 0px 0px 10px',
    verticalAlign: 'middle'
  },
  btnHt: {
    backgroundColor: '#2196f3',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#51c6f3'
    }
  },
  iconWp: {
    border: '1px dashed',
    borderRadius: '4px'
  },
  icon: {
    fontSize: 20
  },
  iconMdi: {
    fontSize: 20
  },
  txt: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  txtLabel: {
    fontFamily: 'Helvetica',
    fontSize: 12
  },
  txtInput: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    height: 30
  },
  txtOpt: {
    fontFamily: 'Helvetica',
    fontSize: 12
  },
  selectLabel: {
    fontFamily: 'Helvetica',
    fontSize: 12
  },
  selectInput: {
    height: 30
  },
  txtLabelBottomInput: {
    fontFamily: 'Helvetica',
    backgroundColor: 'white',
    fontSize: 12,
    margin: '22% 0 0 7px',
    padding: '0 10px 0 10px',
    transform: 'scale(0.75)'
  },
  txtLabelTopInput: {
    fontFamily: 'Helvetica',
    backgroundColor: 'white',
    fontSize: 12,
    margin: '-8% 0 0 7px',
    padding: '0 10px 0 10px',
    transform: 'scale(0.75)'
  }
};
const focusStyle = (criteria, cls) => criteria ? [cls.btnHt] : [];

// eslint-disable-line
exports.focusStyle = focusStyle;