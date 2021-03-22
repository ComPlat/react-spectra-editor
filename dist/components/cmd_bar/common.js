'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.focusStyle = exports.commonStyle = exports.MuButton = undefined;

var _styles = require('@material-ui/core/styles');

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MuButton = (0, _styles.withStyles)({
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
})(_Button2.default);

var commonStyle = {
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

var focusStyle = function focusStyle(criteria, cls) {
  return criteria ? [cls.btnHt] : [];
};

exports.MuButton = MuButton;
exports.commonStyle = commonStyle;
exports.focusStyle = focusStyle; // eslint-disable-line