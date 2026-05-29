"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CircularProgress = _interopRequireDefault(require("@mui/material/CircularProgress"));
var _ErrorOutline = _interopRequireDefault(require("@mui/icons-material/ErrorOutline"));
var _jsxRuntime = require("react/jsx-runtime");
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
    const {
      classes
    } = this.props;
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.loadingWrap,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_CircularProgress.default, {
        size: 36,
        style: {
          color: '#2196f3'
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
        className: classes.messageSubText,
        children: "Loading structure..."
      })]
    });
  }
  renderNotFound() {
    const {
      classes
    } = this.props;
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.loadingWrap,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ErrorOutline.default, {
        style: {
          color: '#ffc107',
          fontSize: 36
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
        className: classes.messageText,
        children: "Structure not found"
      })]
    });
  }
  render() {
    const {
      loading
    } = this.state;
    return loading ? this.renderLoading() : this.renderNotFound();
  }
}
SectionLoading.propTypes = {
  classes: _propTypes.default.object.isRequired
};
var _default = exports.default = SectionLoading;