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

var _ExpandMore = require('@material-ui/icons/ExpandMore');

var _ExpandMore2 = _interopRequireDefault(_ExpandMore);

var _Divider = require('@material-ui/core/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _styles = require('@material-ui/core/styles');

var _core = require('@material-ui/core');

var _curve = require('../../actions/curve');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return {
    panelSummary: {
      backgroundColor: '#eee',
      height: 22
    },
    curve: {
      width: '100%'
    },
    line: {
      height: '2px',
      borderWidth: '0',
      margin: '0'
    },
    curveDefault: {
      backgroundColor: '#fff',
      fontSize: '0.8em',
      margin: '0',
      padding: '10px 2px 2px 10px'
    },
    curveSelected: {
      backgroundColor: '#2196f3',
      fontSize: '0.8em',
      color: '#fff',
      padding: '10px 2px 2px 10px'
    }
  };
};

var GraphSelectionPanel = function GraphSelectionPanel(_ref) {
  var classes = _ref.classes,
      curveSt = _ref.curveSt,
      selectCurveAct = _ref.selectCurveAct,
      entityFileNames = _ref.entityFileNames;


  if (!curveSt) {
    return _react2.default.createElement('span', null);
  }
  var curveIdx = curveSt.curveIdx,
      listCurves = curveSt.listCurves;


  var onChange = function onChange(idx) {
    selectCurveAct(idx);
  };

  var items = listCurves.map(function (spectra, idx) {
    var color = spectra.color;

    var filename = '';
    if (entityFileNames && idx < entityFileNames.length) {
      filename = entityFileNames[idx];
    }
    return { name: idx + 1 + '.', idx: idx, color: color, filename: filename };
  });

  return _react2.default.createElement(
    _core.ExpansionPanel,
    null,
    _react2.default.createElement(
      _core.ExpansionPanelSummary,
      {
        xpandIcon: _react2.default.createElement(_ExpandMore2.default, null),
        className: (0, _classnames2.default)(classes.panelSummary)
      },
      _react2.default.createElement(
        _Typography2.default,
        { className: 'txt-panel-header' },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtBadge, 'txt-sv-panel-title') },
          'Graph selection'
        )
      )
    ),
    _react2.default.createElement(_Divider2.default, null),
    _react2.default.createElement(
      _core.List,
      null,
      items.map(function (item) {
        return _react2.default.createElement(
          _core.ListItem,
          {
            key: item.idx,
            onClick: function onClick() {
              return onChange(item.idx);
            },
            className: (0, _classnames2.default)(item.idx === curveIdx ? classes.curveSelected : classes.curveDefault)
          },
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)(classes.curve) },
            _react2.default.createElement(
              'i',
              null,
              item.name
            ),
            _react2.default.createElement(
              'span',
              { style: { float: "right", width: "95%" } },
              _react2.default.createElement('hr', { className: (0, _classnames2.default)(classes.line), style: { backgroundColor: item.color } }),
              item.filename !== '' ? _react2.default.createElement(
                'span',
                null,
                'File: ',
                item.filename
              ) : null
            )
          )
        );
      })
    )
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      layoutSt: state.layout,
      curveSt: state.curve
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    selectCurveAct: _curve.selectCurve
  }, dispatch);
};

GraphSelectionPanel.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  expand: _propTypes2.default.bool.isRequired,
  layoutSt: _propTypes2.default.string.isRequired,
  onExapnd: _propTypes2.default.func.isRequired,
  curveSt: _propTypes2.default.object.isRequired,
  selectCurveAct: _propTypes2.default.func.isRequired,
  entityFileNames: _propTypes2.default.array.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(GraphSelectionPanel));