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

var _styles = require('@material-ui/core/styles');

var _Table = require('@material-ui/core/Table');

var _Table2 = _interopRequireDefault(_Table);

var _TableBody = require('@material-ui/core/TableBody');

var _TableBody2 = _interopRequireDefault(_TableBody);

var _Paper = require('@material-ui/core/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

var _Grid = require('@material-ui/core/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _comps = require('./comps');

var _ir_comps = require('./ir_comps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Styles = function Styles() {
  return {
    root: {
      overflowX: 'hidden',
      overflowY: 'auto'
    },
    container: {
      minHeight: '400px'
    },
    svgRoot: {
      margin: '10px 40px 0px 40px',
      height: 'calc(70vh)',
      overflowY: 'hidden'
    },
    tableRoot: {
      margin: '10px 40px 0px 40px',
      maxHeight: 'calc(70vh)',
      overflowY: 'scroll'
    },
    title: {
      textAlign: 'left'
    },
    btn: {
      marginLeft: 40
    },
    reference: {
      borderTop: '1px solid #cfd8dc',
      margin: '10px 40px 0px 40px',
      padding: 5
    },
    inputRoot: {
      margin: '10px 40px 0px 40px'
    },
    txtLabel: {
      fontSize: '12px'
    },
    submit: {
      margin: '0 0 0 30px',
      width: 300
    }
  };
};

var sectionTable = function sectionTable(classes, pds) {
  var renderMsg = (0, _comps.notToRenderAnalysis)(pds);
  if (renderMsg) return renderMsg;

  if (!pds.output.result || !pds.output.result[0]) return null;

  var fgs = pds.output.result[0].fgs;

  if (!fgs) return null;
  return _react2.default.createElement(
    _Paper2.default,
    { className: classes.tableRoot },
    _react2.default.createElement(
      _Table2.default,
      { className: classes.table, size: 'small' },
      (0, _ir_comps.IrTableHeader)(classes),
      _react2.default.createElement(
        _TableBody2.default,
        null,
        fgs.sort(function (a, b) {
          return b.confidence - a.confidence;
        }).map(function (fg, idx) {
          return (0, _ir_comps.IrTableBodyRow)(classes, idx, fg);
        })
      )
    )
  );
};

var IrViewer = function IrViewer(_ref) {
  var classes = _ref.classes,
      molecule = _ref.molecule,
      inputCb = _ref.inputCb,
      forecastSt = _ref.forecastSt;
  return _react2.default.createElement(
    'div',
    { className: (0, _classnames2.default)(classes.root, 'card-forecast-viewer') },
    _react2.default.createElement(
      _Grid2.default,
      { className: (0, _classnames2.default)(classes.container), container: true },
      _react2.default.createElement(
        _Grid2.default,
        { item: true, xs: 4 },
        _react2.default.createElement(
          _Paper2.default,
          { className: classes.svgRoot },
          (0, _comps.sectionSvg)(classes, forecastSt.predictions)
        )
      ),
      _react2.default.createElement(
        _Grid2.default,
        { item: true, xs: 8 },
        sectionTable(classes, forecastSt.predictions)
      )
    ),
    (0, _comps.sectionInput)(classes, molecule, inputCb)
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      forecastSt: state.forecast
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({}, dispatch);
};

IrViewer.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  molecule: _propTypes2.default.string.isRequired,
  inputCb: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.bool]),
  forecastSt: _propTypes2.default.object.isRequired
};

IrViewer.defaultProps = {
  inputCb: false
};

exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(Styles))(IrViewer);