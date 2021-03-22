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

var _TextField = require('@material-ui/core/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _InputAdornment = require('@material-ui/core/InputAdornment');

var _InputAdornment2 = _interopRequireDefault(_InputAdornment);

var _multiplicity = require('../../actions/multiplicity');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = function styles() {
  return {
    jDiv: {
      height: 28
    },
    jTxt: {
      margin: '0 5px 4px 60px'
    },
    moExtTxt: {
      margin: '0 5px 0 5x',
      fontSize: '0.8rem',
      fontFamily: 'Helvetica'
    },
    txtField: {
      width: 260,
      margin: '0 3px 0 3px'
    },
    txtInput: {
      color: 'white',
      fontSize: '0.9rem',
      fontFamily: 'Helvetica',
      height: 24
    }
  };
};

var txtJ = function txtJ() {
  return _react2.default.createElement(
    _InputAdornment2.default,
    { position: 'start' },
    _react2.default.createElement(
      'span',
      { className: 'txt-cmd-j' },
      'J\xA0='
    )
  );
};

var txtHz = function txtHz() {
  return _react2.default.createElement(
    _InputAdornment2.default,
    { position: 'end' },
    _react2.default.createElement(
      'span',
      { className: 'txt-cmd-hz' },
      'Hz'
    )
  );
};

var MpyCoupling = function (_React$Component) {
  _inherits(MpyCoupling, _React$Component);

  function MpyCoupling(props) {
    _classCallCheck(this, MpyCoupling);

    var _this = _possibleConstructorReturn(this, (MpyCoupling.__proto__ || Object.getPrototypeOf(MpyCoupling)).call(this, props));

    _this.state = {
      focus: false,
      tmpVal: false
    };

    _this.onFocus = _this.onFocus.bind(_this);
    _this.onBlur = _this.onBlur.bind(_this);
    _this.onChange = _this.onChange.bind(_this);
    return _this;
  }

  _createClass(MpyCoupling, [{
    key: 'onFocus',
    value: function onFocus() {
      this.setState({ focus: true });
    }
  }, {
    key: 'onBlur',
    value: function onBlur() {
      var _props = this.props,
          row = _props.row,
          updateMpyJAct = _props.updateMpyJAct;
      var tmpVal = this.state.tmpVal;
      var xExtent = row.xExtent;

      this.setState({ focus: false, tmpVal: false });
      updateMpyJAct({ xExtent: xExtent, value: tmpVal });
    }
  }, {
    key: 'onChange',
    value: function onChange(e) {
      this.setState({ tmpVal: e.target.value });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          classes = _props2.classes,
          row = _props2.row;
      var _state = this.state,
          focus = _state.focus,
          tmpVal = _state.tmpVal;

      var value = focus && (tmpVal || tmpVal === '') ? tmpVal : row.jStr;

      return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(classes.jDiv) },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.moExtTxt, classes.jTxt, 'txt-sv-panel-head') },
          _react2.default.createElement(_TextField2.default, {
            className: (0, _classnames2.default)(classes.txtField, 'txt-cmd-field'),
            placeholder: '-',
            value: value,
            margin: 'none',
            InputProps: {
              startAdornment: txtJ(),
              endAdornment: txtHz(),
              className: (0, _classnames2.default)(classes.txtInput, 'txt-sv-input-label')
            },
            onChange: this.onChange,
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            variant: 'outlined'
          })
        )
      );
    }
  }]);

  return MpyCoupling;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {}
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    updateMpyJAct: _multiplicity.updateMpyJ
  }, dispatch);
};

MpyCoupling.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  row: _propTypes2.default.object.isRequired,
  updateMpyJAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(MpyCoupling));