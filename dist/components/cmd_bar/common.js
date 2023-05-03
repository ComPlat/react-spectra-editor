"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.focusStyle = exports.commonStyle = exports.MuButton = void 0;
var _styles = require("@material-ui/core/styles");
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
const MuButton = (0, _styles.withStyles)({
  root: {
    border: '1px solid #ccc',
    borderRadius: 4,
    fontFamily: 'Helvetica',
    fontSize: 20,
    height: 30,
    lineHeight: '20px',
    minWidth: 30,
    padding: 0,
    width: 30
  }
})(_Button.default);
exports.MuButton = MuButton;
const commonStyle = {
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
  }
};
exports.commonStyle = commonStyle;
const focusStyle = (criteria, cls) => criteria ? [cls.btnHt] : [];

// eslint-disable-line
exports.focusStyle = focusStyle;