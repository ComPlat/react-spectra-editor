'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _reactDropzone = require('react-dropzone');

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var _ExpansionPanel = require('@material-ui/core/ExpansionPanel');

var _ExpansionPanel2 = _interopRequireDefault(_ExpansionPanel);

var _ExpansionPanelSummary = require('@material-ui/core/ExpansionPanelSummary');

var _ExpansionPanelSummary2 = _interopRequireDefault(_ExpansionPanelSummary);

var _ExpandMore = require('@material-ui/icons/ExpandMore');

var _ExpandMore2 = _interopRequireDefault(_ExpandMore);

var _HighlightOff = require('@material-ui/icons/HighlightOff');

var _HighlightOff2 = _interopRequireDefault(_HighlightOff);

var _Table = require('@material-ui/core/Table');

var _Table2 = _interopRequireDefault(_Table);

var _TableBody = require('@material-ui/core/TableBody');

var _TableBody2 = _interopRequireDefault(_TableBody);

var _TableCell = require('@material-ui/core/TableCell');

var _TableCell2 = _interopRequireDefault(_TableCell);

var _TableRow = require('@material-ui/core/TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

var _Divider = require('@material-ui/core/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _Tooltip = require('@material-ui/core/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _VisibilityOutlined = require('@material-ui/icons/VisibilityOutlined');

var _VisibilityOutlined2 = _interopRequireDefault(_VisibilityOutlined);

var _VisibilityOffOutlined = require('@material-ui/icons/VisibilityOffOutlined');

var _VisibilityOffOutlined2 = _interopRequireDefault(_VisibilityOffOutlined);

var _styles = require('@material-ui/core/styles');

var _format = require('../../helpers/format');

var _format2 = _interopRequireDefault(_format);

var _jcamp = require('../../actions/jcamp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles(theme) {
  return {
    panel: {
      backgroundColor: '#eee',
      display: 'table-row'
    },
    panelSummary: {
      backgroundColor: '#eee',
      height: 32
    },
    txtBadge: {},
    panelDetail: {
      backgroundColor: '#fff',
      maxHeight: 'calc(90vh - 220px)', // ROI
      overflow: 'auto'
    },
    table: {
      width: '100%'
    },
    tTxt: {
      padding: 0
    },
    tTxtHide: {
      color: '#D5D8DC'
    },
    tRow: {
      height: 28,
      '&:nth-of-type(even)': {
        backgroundColor: theme.palette.background.default
      }
    },
    rmBtn: {
      color: 'red',
      padding: '0 5px 0 5px',
      '&:hover': {
        borderRadius: 12,
        backgroundColor: 'red',
        color: 'white'
      }
    },
    showBtn: {
      color: 'steelblue',
      padding: '0 5px 0 5px',
      '&:hover': {
        borderRadius: 12,
        backgroundColor: 'steelblue',
        color: 'white'
      }
    },
    hideBtn: {
      color: 'gray',
      padding: '0 5px 0 5px',
      '&:hover': {
        borderRadius: 12,
        backgroundColor: 'gray',
        color: 'white'
      }
    },
    square: {
      textAlign: 'center !important'
    },
    baseDD: {
      backgroundColor: 'white',
      border: '1px dashed black',
      borderRadius: 5,
      height: 26,
      lineHeight: '26px',
      margin: '7px 0 7px 0',
      textAlign: 'center',
      verticalAlign: 'middle',
      width: '90%'
    },
    enableDD: {
      border: '2px dashed #000',
      color: '#000'
    },
    disableDD: {
      border: '2px dashed #aaa',
      color: '#aaa'
    },
    tpCard: {},
    tpMoreTxt: {
      padding: '0 0 0 60px'
    },
    tpLabel: {
      fontSize: 16
    }
  };
};

var msgDefault = 'Add spectra to compare.';

var tpHint = function tpHint(classes) {
  return _react2.default.createElement(
    'span',
    { className: (0, _classnames2.default)(classes.tpCard) },
    _react2.default.createElement(
      'p',
      { className: (0, _classnames2.default)(classes.tpLabel, 'txt-sv-tp') },
      '- Accept *.dx, *.jdx, *.JCAMP,'
    ),
    _react2.default.createElement(
      'p',
      { className: (0, _classnames2.default)(classes.tpLabel, 'txt-sv-tp') },
      '- Max 5 spectra.'
    )
  );
};

var content = function content(classes, desc) {
  return _react2.default.createElement(
    _Tooltip2.default,
    {
      title: tpHint(classes),
      placement: 'bottom'
    },
    _react2.default.createElement(
      'span',
      { className: (0, _classnames2.default)(classes.tpLabel, 'txt-sv-tp') },
      desc
    )
  );
};

var inputOthers = function inputOthers(classes, jcampSt) {
  var selectedIdx = jcampSt.selectedIdx,
      jcamps = jcampSt.jcamps;

  var selectedJcamp = jcamps[selectedIdx];
  var addOthersCb = selectedJcamp.addOthersCb;


  var fileName = '';
  var desc = fileName || msgDefault;
  var onDrop = function onDrop(jcampFiles) {
    if (!addOthersCb) return;
    addOthersCb({ jcamps: jcampFiles });
  };

  return _react2.default.createElement(
    _reactDropzone2.default,
    {
      className: 'dropbox',
      onDrop: onDrop
    },
    function (_ref) {
      var getRootProps = _ref.getRootProps,
          getInputProps = _ref.getInputProps;
      return _react2.default.createElement(
        'div',
        _extends({}, getRootProps(), {
          className: (0, _classnames2.default)(classes.baseDD)
        }),
        _react2.default.createElement('input', getInputProps()),
        content(classes, desc)
      );
    }
  );
};

var compareList = function compareList(classes, jcampSt, rmOthersOneAct, toggleShowAct) {
  var selectedIdx = jcampSt.selectedIdx,
      jcamps = jcampSt.jcamps;

  var selectedJcamp = jcamps[selectedIdx];
  var others = selectedJcamp.others;


  var rows = others.map(function (o, idx) {
    return {
      idx: idx,
      title: o.spectra[0].title,
      color: _format2.default.compareColors(idx),
      rmCb: function rmCb() {
        return rmOthersOneAct(idx);
      },
      isShow: o.show,
      toggleShowCb: function toggleShowCb() {
        return toggleShowAct(idx);
      }
    };
  });

  return _react2.default.createElement(
    _Table2.default,
    { className: classes.table },
    _react2.default.createElement(
      _TableBody2.default,
      null,
      rows.map(function (row) {
        return _react2.default.createElement(
          _TableRow2.default,
          { key: row.idx, className: classes.tRow, hover: true },
          _react2.default.createElement(
            _TableCell2.default,
            {
              align: 'right',
              className: (0, _classnames2.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt'),
              style: { backgroundColor: row.color }
            },
            row.idx + 1
          ),
          _react2.default.createElement(
            _TableCell2.default,
            { align: 'right', className: (0, _classnames2.default)(classes.tTxt, 'txt-sv-panel-txt', row.isShow ? null : classes.tTxtHide) },
            row.title
          ),
          _react2.default.createElement(
            _TableCell2.default,
            { align: 'right', className: (0, _classnames2.default)(classes.tTxt, 'txt-sv-panel-txt') },
            row.isShow ? _react2.default.createElement(_VisibilityOutlined2.default, {
              onClick: row.toggleShowCb,
              className: classes.showBtn
            }) : _react2.default.createElement(_VisibilityOffOutlined2.default, {
              onClick: row.toggleShowCb,
              className: classes.hideBtn
            }),
            _react2.default.createElement(_HighlightOff2.default, { onClick: row.rmCb, className: classes.rmBtn })
          )
        );
      })
    )
  );
};

var ComparePanel = function ComparePanel(_ref2) {
  var classes = _ref2.classes,
      expand = _ref2.expand,
      onExapnd = _ref2.onExapnd,
      jcampSt = _ref2.jcampSt,
      rmOthersOneAct = _ref2.rmOthersOneAct,
      toggleShowAct = _ref2.toggleShowAct;
  return _react2.default.createElement(
    _ExpansionPanel2.default,
    {
      expanded: expand,
      onChange: onExapnd,
      className: (0, _classnames2.default)(classes.panel),
      TransitionProps: { unmountOnExit: true } // increase ExpansionPanel performance
    },
    _react2.default.createElement(
      _ExpansionPanelSummary2.default,
      {
        expandIcon: _react2.default.createElement(_ExpandMore2.default, null),
        className: (0, _classnames2.default)(classes.panelSummary)
      },
      _react2.default.createElement(
        _Typography2.default,
        { className: 'txt-panel-header' },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtBadge, 'txt-sv-panel-title') },
          'Spectra Comparisons'
        )
      )
    ),
    _react2.default.createElement(_Divider2.default, null),
    inputOthers(classes, jcampSt),
    _react2.default.createElement(
      'div',
      { className: (0, _classnames2.default)(classes.panelDetail) },
      compareList(classes, jcampSt, rmOthersOneAct, toggleShowAct)
    )
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      jcampSt: state.jcamp
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    rmOthersOneAct: _jcamp.rmOthersOne,
    toggleShowAct: _jcamp.toggleShow
  }, dispatch);
};

ComparePanel.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  expand: _propTypes2.default.bool.isRequired,
  onExapnd: _propTypes2.default.func.isRequired,
  jcampSt: _propTypes2.default.object.isRequired,
  rmOthersOneAct: _propTypes2.default.func.isRequired,
  toggleShowAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(ComparePanel));