'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IrTableBodyRow = exports.IrTableHeader = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Select = require('@material-ui/core/Select');

var _Select2 = _interopRequireDefault(_Select);

var _FormControl = require('@material-ui/core/FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _MenuItem = require('@material-ui/core/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _CheckCircleOutline = require('@material-ui/icons/CheckCircleOutline');

var _CheckCircleOutline2 = _interopRequireDefault(_CheckCircleOutline);

var _HighlightOff = require('@material-ui/icons/HighlightOff');

var _HighlightOff2 = _interopRequireDefault(_HighlightOff);

var _TableCell = require('@material-ui/core/TableCell');

var _TableCell2 = _interopRequireDefault(_TableCell);

var _TableHead = require('@material-ui/core/TableHead');

var _TableHead2 = _interopRequireDefault(_TableHead);

var _TableRow = require('@material-ui/core/TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

var _comps = require('./comps');

var _forecast = require('../../actions/forecast');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import SmaToSvg from '../common/chem';


var baseSelectIrStatus = function baseSelectIrStatus(_ref) {
  var sma = _ref.sma,
      status = _ref.status,
      identity = _ref.identity,
      setIrStatusAct = _ref.setIrStatusAct;

  var theStatus = ['accept', 'reject'].includes(status) ? status : '';

  return _react2.default.createElement(
    _FormControl2.default,
    null,
    _react2.default.createElement(
      _Select2.default,
      {
        value: theStatus,
        onChange: function onChange(e) {
          setIrStatusAct({
            predictions: {
              sma: sma, identity: identity, value: e.target.value
            },
            svgs: []
          });
        }
      },
      _react2.default.createElement(
        _MenuItem2.default,
        { value: 'accept' },
        _react2.default.createElement(_CheckCircleOutline2.default, { style: { color: '#4caf50' } })
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: 'reject' },
        _react2.default.createElement(_HighlightOff2.default, { style: { color: '#e91e63' } })
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: '' },
        _react2.default.createElement('span', null)
      )
    )
  );
};

var bssMapStateToProps = function bssMapStateToProps(state, props) {
  return (// eslint-disable-line
    {}
  );
};

var bssMapDispatchToProps = function bssMapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    setIrStatusAct: _forecast.setIrStatus
  }, dispatch);
};

baseSelectIrStatus.propTypes = {
  sma: _propTypes2.default.string.isRequired,
  status: _propTypes2.default.string,
  identity: _propTypes2.default.string.isRequired,
  setIrStatusAct: _propTypes2.default.func.isRequired
};

baseSelectIrStatus.defaultProps = {
  status: ''
};

var SelectIrStatus = (0, _reactRedux.connect)(bssMapStateToProps, bssMapDispatchToProps)(baseSelectIrStatus);

var IrTableHeader = function IrTableHeader(classes) {
  return _react2.default.createElement(
    _TableHead2.default,
    null,
    _react2.default.createElement(
      _TableRow2.default,
      null,
      _react2.default.createElement(_TableCell2.default, null),
      _react2.default.createElement(
        _TableCell2.default,
        { align: 'left' },
        (0, _comps.TxtLabel)(classes, 'FG SMARTS', 'txt-prd-table-title')
      ),
      _react2.default.createElement(
        _TableCell2.default,
        { align: 'right' },
        (0, _comps.TxtLabel)(classes, 'Machine Confidence', 'txt-prd-table-title')
      ),
      _react2.default.createElement(
        _TableCell2.default,
        { align: 'right' },
        (0, _comps.TxtLabel)(classes, 'Machine', 'txt-prd-table-title')
      ),
      _react2.default.createElement(
        _TableCell2.default,
        { align: 'right' },
        (0, _comps.TxtLabel)(classes, 'Owner', 'txt-prd-table-title')
      )
    )
  );
};

var colorStyles = [{ backgroundColor: '#FFFF00' }, { backgroundColor: '#87CEFA' }, { backgroundColor: '#FFB6C1' }, { backgroundColor: '#00FF00' }, { backgroundColor: '#E6E6FA' }, { backgroundColor: '#FFD700' }, { backgroundColor: '#F0FFFF' }, { backgroundColor: '#F5F5DC' }];

var colorLabel = function colorLabel(classes, idx) {
  var extClsName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'txt-label';

  var style = Object.assign({}, colorStyles[idx % 8], { width: 20, borderRadius: 20, textAlign: 'center' });

  return _react2.default.createElement(
    'div',
    {
      style: style
    },
    _react2.default.createElement(
      'span',
      {
        className: (0, _classnames2.default)(classes.txtLabel, extClsName)
      },
      idx + 1
    )
  );
};

var IrTableBodyRow = function IrTableBodyRow(classes, idx, fg) {
  return _react2.default.createElement(
    _TableRow2.default,
    { key: idx + '-' + fg.name },
    _react2.default.createElement(
      _TableCell2.default,
      { component: 'th', scope: 'row' },
      colorLabel(classes, idx)
    ),
    _react2.default.createElement(
      _TableCell2.default,
      { align: 'left' },
      (0, _comps.TxtLabel)(classes, fg.sma, 'txt-prd-table-content')
    ),
    _react2.default.createElement(
      _TableCell2.default,
      { align: 'right' },
      (0, _comps.ConfidenceLabel)(classes, fg.confidence, 'txt-prd-table-content')
    ),
    _react2.default.createElement(
      _TableCell2.default,
      { align: 'right' },
      (0, _comps.StatusIcon)(fg.status)
    ),
    _react2.default.createElement(
      _TableCell2.default,
      { align: 'right' },
      _react2.default.createElement(SelectIrStatus, {
        sma: fg.sma,
        status: fg.statusOwner,
        identity: 'Owner'
      })
    )
  );
};

exports.IrTableHeader = IrTableHeader;
exports.IrTableBodyRow = IrTableBodyRow;