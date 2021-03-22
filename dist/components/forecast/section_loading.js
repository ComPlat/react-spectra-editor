'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CircularProgress = require('@material-ui/core/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _ErrorOutline = require('@material-ui/icons/ErrorOutline');

var _ErrorOutline2 = _interopRequireDefault(_ErrorOutline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styleLoading = {
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center'
};

var SectionLoading = function (_React$Component) {
  _inherits(SectionLoading, _React$Component);

  function SectionLoading(props) {
    _classCallCheck(this, SectionLoading);

    var _this = _possibleConstructorReturn(this, (SectionLoading.__proto__ || Object.getPrototypeOf(SectionLoading)).call(this, props));

    _this.state = {
      loading: true
    };
    return _this;
  }

  _createClass(SectionLoading, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      setTimeout(function () {
        return _this2.setState({ loading: false });
      }, 5000);
    }
  }, {
    key: 'renderLoading',
    value: function renderLoading() {
      return _react2.default.createElement(
        'div',
        { style: styleLoading },
        _react2.default.createElement(_CircularProgress2.default, { style: { color: 'blue', fontSize: 50 } })
      );
    }
  }, {
    key: 'renderNotFound',
    value: function renderNotFound() {
      return _react2.default.createElement(
        'div',
        { style: styleLoading },
        _react2.default.createElement(_ErrorOutline2.default, { style: { color: '#ffc107', fontSize: 50, margin: 20 } }),
        _react2.default.createElement(
          'h3',
          null,
          'Structure Not Found'
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var loading = this.state.loading;


      return loading ? this.renderLoading() : this.renderNotFound();
    }
  }]);

  return SectionLoading;
}(_react2.default.Component);

exports.default = SectionLoading;