'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _MenuItem = require('@material-ui/core/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _FormControl = require('@material-ui/core/FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _OutlinedInput = require('@material-ui/core/OutlinedInput');

var _OutlinedInput2 = _interopRequireDefault(_OutlinedInput);

var _InputLabel = require('@material-ui/core/InputLabel');

var _InputLabel2 = _interopRequireDefault(_InputLabel);

var _styles = require('@material-ui/core/styles');

var _r02_scan = require('./r02_scan');

var _r02_scan2 = _interopRequireDefault(_r02_scan);

var _layout = require('../../actions/layout');

var _shift = require('../../actions/shift');

var _list_layout = require('../../constants/list_layout');

var _list_shift = require('../../constants/list_shift');

var _cfg = require('../../helpers/cfg');

var _cfg2 = _interopRequireDefault(_cfg);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return Object.assign({
    fieldShift: {
      width: 160
    },
    fieldLayout: {
      width: 100
    }
  }, _common.commonStyle);
};

var shiftSelect = function shiftSelect(classes, layoutSt, shiftRefSt, setShiftRefAct) {
  if (_cfg2.default.hideSolvent(layoutSt)) return null;
  var onChange = function onChange(e) {
    return setShiftRefAct(e.target.value);
  };

  var listShift = (0, _list_shift.getListShift)(layoutSt);

  var content = listShift.map(function (ref) {
    return _react2.default.createElement(
      _MenuItem2.default,
      { value: ref, key: ref.name },
      _react2.default.createElement(
        'span',
        { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-shift') },
        ref.name + ': ' + ref.value + ' ppm'
      )
    );
  });

  return _react2.default.createElement(
    _FormControl2.default,
    {
      className: (0, _classnames2.default)(classes.fieldShift),
      variant: 'outlined'
    },
    _react2.default.createElement(
      _InputLabel2.default,
      { className: (0, _classnames2.default)(classes.selectLabel, 'select-sv-bar-label') },
      'Solvent'
    ),
    _react2.default.createElement(
      _Select2.default,
      {
        value: shiftRefSt,
        onChange: onChange,
        input: _react2.default.createElement(_OutlinedInput2.default, {
          className: (0, _classnames2.default)(classes.selectInput, 'input-sv-bar-shift'),
          labelWidth: 60
        })
      },
      content
    )
  );
};

var layoutSelect = function layoutSelect(classes, layoutSt, updateLayoutAct) {
  var onChange = function onChange(e) {
    return updateLayoutAct(e.target.value);
  };

  return _react2.default.createElement(
    _FormControl2.default,
    {
      className: (0, _classnames2.default)(classes.fieldLayout),
      variant: 'outlined'
    },
    _react2.default.createElement(
      _InputLabel2.default,
      { className: (0, _classnames2.default)(classes.selectLabel, 'select-sv-bar-label') },
      'Layout'
    ),
    _react2.default.createElement(
      _Select2.default,
      {
        value: layoutSt,
        onChange: onChange,
        input: _react2.default.createElement(_OutlinedInput2.default, {
          className: (0, _classnames2.default)(classes.selectInput, 'input-sv-bar-layout'),
          labelWidth: 60
        })
      },
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.PLAIN },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          'plain'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.IR },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          'IR'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.RAMAN },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          'RAMAN'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.UVVIS },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          'UV/VIS'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.HPLC_UVVIS },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          'HPLC UV/VIS'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.TGA },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          'TGA (THERMOGRAVIMETRIC ANALYSIS)'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.XRD },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          'XRD (X-RAY DIFFRACTION)'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.H1 },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          _react2.default.createElement(
            'sup',
            null,
            '1'
          ),
          'H'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.C13 },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          _react2.default.createElement(
            'sup',
            null,
            '13'
          ),
          'C'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.F19 },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          _react2.default.createElement(
            'sup',
            null,
            '19'
          ),
          'F'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.P31 },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          _react2.default.createElement(
            'sup',
            null,
            '31'
          ),
          'P'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.N15 },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          _react2.default.createElement(
            'sup',
            null,
            '15'
          ),
          'N'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.Si29 },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          _react2.default.createElement(
            'sup',
            null,
            '29'
          ),
          'Si'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.MS },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          'MS'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          'CV (CYCLIC VOLTAMMETRY)'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.CDS },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          'CDS (CIRCULAR DICHROISM SPECTROSCOPY)'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: _list_layout.LIST_LAYOUT.SEC },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
          'SEC'
        )
      )
    )
  );
};

var Layout = function Layout(_ref) {
  var classes = _ref.classes,
      feature = _ref.feature,
      hasEdit = _ref.hasEdit,
      layoutSt = _ref.layoutSt,
      shiftRefSt = _ref.shiftRefSt,
      setShiftRefAct = _ref.setShiftRefAct,
      updateLayoutAct = _ref.updateLayoutAct;
  return _react2.default.createElement(
    'span',
    { className: classes.groupRight },
    layoutSelect(classes, layoutSt, updateLayoutAct),
    shiftSelect(classes, layoutSt, shiftRefSt, setShiftRefAct),
    _react2.default.createElement(_r02_scan2.default, { feature: feature, hasEdit: hasEdit })
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      layoutSt: state.layout,
      shiftRefSt: state.shift.ref
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    setShiftRefAct: _shift.setShiftRef,
    updateLayoutAct: _layout.updateLayout
  }, dispatch);
};

Layout.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  feature: _propTypes2.default.object.isRequired,
  hasEdit: _propTypes2.default.bool.isRequired,
  layoutSt: _propTypes2.default.string.isRequired,
  shiftRefSt: _propTypes2.default.object.isRequired,
  setShiftRefAct: _propTypes2.default.func.isRequired,
  updateLayoutAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(Layout));