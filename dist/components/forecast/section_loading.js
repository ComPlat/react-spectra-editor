"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _CircularProgress = _interopRequireDefault(require("@mui/material/CircularProgress"));
var _ErrorOutline = _interopRequireDefault(require("@mui/icons-material/ErrorOutline"));
const styleLoading = {
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center'
};
class SectionLoading extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  componentDidMount() {
    setTimeout(() => this.setState({
      loading: false
    }), 5000);
  }
  renderLoading() {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: styleLoading
    }, /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
      style: {
        color: 'blue',
        fontSize: 50
      }
    }));
  }
  renderNotFound() {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: styleLoading
    }, /*#__PURE__*/_react.default.createElement(_ErrorOutline.default, {
      style: {
        color: '#ffc107',
        fontSize: 50,
        margin: 20
      }
    }), /*#__PURE__*/_react.default.createElement("h3", null, "Structure Not Found"));
  }
  render() {
    const {
      loading
    } = this.state;
    return loading ? this.renderLoading() : this.renderNotFound();
  }
}
var _default = exports.default = SectionLoading;