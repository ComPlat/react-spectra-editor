'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SectionReference = exports.NmrTableBodyRow = exports.NmrTableHeader = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactRedux = require('react-redux');

var _redux = require('redux');

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

var baseSelectNmrStatus = function baseSelectNmrStatus(_ref) {
  var idx = _ref.idx,
      atom = _ref.atom,
      status = _ref.status,
      identity = _ref.identity,
      setNmrStatusAct = _ref.setNmrStatusAct;

  var theStatus = ['accept', 'reject'].includes(status) ? status : '';

  return _react2.default.createElement(
    _FormControl2.default,
    null,
    _react2.default.createElement(
      _Select2.default,
      {
        value: theStatus,
        onChange: function onChange(e) {
          setNmrStatusAct({
            predictions: {
              idx: idx, atom: atom, identity: identity, value: e.target.value
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
    setNmrStatusAct: _forecast.setNmrStatus
  }, dispatch);
};

baseSelectNmrStatus.propTypes = {
  idx: _propTypes2.default.number.isRequired,
  atom: _propTypes2.default.number.isRequired,
  status: _propTypes2.default.string,
  identity: _propTypes2.default.string.isRequired,
  setNmrStatusAct: _propTypes2.default.func.isRequired
};

baseSelectNmrStatus.defaultProps = {
  status: ''
};

var SelectNmrStatus = (0, _reactRedux.connect)(bssMapStateToProps, bssMapDispatchToProps)(baseSelectNmrStatus);

var numFormat = function numFormat(input) {
  return parseFloat(input).toFixed(2);
};

var realFormat = function realFormat(val, status) {
  if (status === 'missing') {
    return '- - -';
  }
  return numFormat(val);
};

var NmrTableHeader = function NmrTableHeader(classes) {
  return _react2.default.createElement(
    _TableHead2.default,
    null,
    _react2.default.createElement(
      _TableRow2.default,
      null,
      _react2.default.createElement(
        _TableCell2.default,
        null,
        (0, _comps.TxtLabel)(classes, 'Atom', 'txt-prd-table-title')
      ),
      _react2.default.createElement(
        _TableCell2.default,
        { align: 'right' },
        (0, _comps.TxtLabel)(classes, 'Prediction (ppm)', 'txt-prd-table-title')
      ),
      _react2.default.createElement(
        _TableCell2.default,
        { align: 'right' },
        (0, _comps.TxtLabel)(classes, 'Real (ppm)', 'txt-prd-table-title')
      ),
      _react2.default.createElement(
        _TableCell2.default,
        { align: 'right' },
        (0, _comps.TxtLabel)(classes, 'Diff (ppm)', 'txt-prd-table-title')
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

var NmrTableBodyRow = function NmrTableBodyRow(classes, row, idx) {
  return _react2.default.createElement(
    _TableRow2.default,
    { key: idx + '-' + row.atom },
    _react2.default.createElement(
      _TableCell2.default,
      { component: 'th', scope: 'row' },
      (0, _comps.TxtLabel)(classes, row.atom, 'txt-prd-table-content')
    ),
    _react2.default.createElement(
      _TableCell2.default,
      { align: 'right' },
      (0, _comps.TxtLabel)(classes, numFormat(row.prediction), 'txt-prd-table-content')
    ),
    _react2.default.createElement(
      _TableCell2.default,
      { align: 'right' },
      (0, _comps.TxtLabel)(classes, realFormat(row.real, row.status), 'txt-prd-table-content')
    ),
    _react2.default.createElement(
      _TableCell2.default,
      { align: 'right' },
      (0, _comps.TxtLabel)(classes, realFormat(row.diff, row.status), 'txt-prd-table-content')
    ),
    _react2.default.createElement(
      _TableCell2.default,
      { align: 'right' },
      (0, _comps.StatusIcon)(row.status)
    ),
    _react2.default.createElement(
      _TableCell2.default,
      { align: 'right' },
      _react2.default.createElement(SelectNmrStatus, {
        idx: idx,
        atom: row.atom,
        status: row.statusOwner,
        identity: 'Owner'
      })
    )
  );
};

var SectionReference = function SectionReference(classes) {
  return _react2.default.createElement(
    'div',
    { className: (0, _classnames2.default)(classes.reference) },
    _react2.default.createElement(
      'p',
      null,
      _react2.default.createElement(
        'span',
        null,
        'NMR prediction source: '
      ),
      _react2.default.createElement(
        'a',
        {
          href: 'https://www.ncbi.nlm.nih.gov/pubmed/15464159',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        'nmrshiftdb'
      )
    )
  );
};

exports.NmrTableHeader = NmrTableHeader;
exports.NmrTableBodyRow = NmrTableBodyRow;
exports.SectionReference = SectionReference;