'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styles = require('@material-ui/core/styles');

var _Tooltip = require('@material-ui/core/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _cfg = require('../../helpers/cfg');

var _cfg2 = _interopRequireDefault(_cfg);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = function styles() {
  return Object.assign({
    btnYes: {
      color: 'green'
    },
    btnNo: {
      color: 'red'
    },
    btnTxtConfirm: {
      fontFamily: 'Helvetica',
      fontSize: 12
    }
  }, _common.commonStyle);
};

var TriBtn = function (_React$Component) {
  _inherits(TriBtn, _React$Component);

  function TriBtn(props) {
    _classCallCheck(this, TriBtn);

    var _this = _possibleConstructorReturn(this, (TriBtn.__proto__ || Object.getPrototypeOf(TriBtn)).call(this, props));

    _this.state = {
      toggled: false
    };

    _this.onToggle = _this.onToggle.bind(_this);
    _this.renderStageOne = _this.renderStageOne.bind(_this);
    _this.renderStageTwo = _this.renderStageTwo.bind(_this);
    return _this;
  }

  _createClass(TriBtn, [{
    key: 'onToggle',
    value: function onToggle(e) {
      e.stopPropagation();
      e.preventDefault();
      var toggled = this.state.toggled;

      this.setState({ toggled: !toggled });
    }
  }, {
    key: 'renderStageOne',
    value: function renderStageOne() {
      var _props = this.props,
          content = _props.content,
          layoutSt = _props.layoutSt,
          children = _props.children;
      var tp = content.tp;

      var title = _react2.default.createElement(
        'span',
        { className: 'txt-sv-tp' },
        tp
      );

      return _react2.default.createElement(
        _Tooltip2.default,
        { title: title },
        _react2.default.createElement(
          'span',
          null,
          _react2.default.createElement(
            _common.MuButton,
            {
              className: (0, _classnames2.default)('btn-sv-bar-one'),
              disabled: _cfg2.default.btnCmdMpy(layoutSt),
              onClick: this.onToggle
            },
            children
          )
        )
      );
    }
  }, {
    key: 'renderStageTwo',
    value: function renderStageTwo() {
      var _this2 = this;

      var _props2 = this.props,
          classes = _props2.classes,
          layoutSt = _props2.layoutSt,
          cb = _props2.cb;

      var onExec = function onExec(e) {
        cb();
        _this2.onToggle(e);
      };

      return _react2.default.createElement(
        'span',
        { disabled: _cfg2.default.btnCmdMpy(layoutSt) },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtLabel, 'txt-sv-bar-desc') },
          'Delete ALL?'
        ),
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)('btn-sv-bar-yes'),
            onClick: onExec
          },
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)(classes.txt, classes.btnYes, 'txt-sv-bar-yes') },
            'Y'
          )
        ),
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)('btn-sv-bar-no'),
            onClick: this.onToggle
          },
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)(classes.txt, classes.btnNo, 'txt-sv-bar-no') },
            'N'
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var toggled = this.state.toggled;


      return !toggled ? this.renderStageOne() : this.renderStageTwo();
    }
  }]);

  return TriBtn;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      layoutSt: state.layout
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({}, dispatch);
};

TriBtn.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  layoutSt: _propTypes2.default.string.isRequired,
  content: _propTypes2.default.object.isRequired,
  cb: _propTypes2.default.func.isRequired,
  children: _propTypes2.default.node.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(TriBtn));