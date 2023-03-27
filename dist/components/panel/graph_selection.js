'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
      entityFileNames = _ref.entityFileNames,
      subLayoutsInfo = _ref.subLayoutsInfo;


  if (!curveSt) {
    return _react2.default.createElement('span', null);
  }
  var curveIdx = curveSt.curveIdx,
      listCurves = curveSt.listCurves;

  if (!listCurves) {
    return _react2.default.createElement('span', null);
  }

  var onChange = function onChange(idx) {
    selectCurveAct(idx);
  };

  var subLayoutValues = [];
  if (subLayoutsInfo !== undefined && subLayoutsInfo !== null) {
    subLayoutValues = Object.keys(subLayoutsInfo);
  }

  var onChangeTabSubLayout = function onChangeTabSubLayout(event, newValue) {
    setSelectedSublayout(newValue);
  };

  var _useState = (0, _react.useState)(subLayoutValues[0]),
      _useState2 = _slicedToArray(_useState, 2),
      selectedSubLayout = _useState2[0],
      setSelectedSublayout = _useState2[1];

  var itemsSubLayout = [];
  if (selectedSubLayout && subLayoutValues.length > 1) {
    var subLayout = subLayoutsInfo[selectedSubLayout];
    itemsSubLayout = subLayout.map(function (spectra, idx) {
      var color = spectra.color,
          curveIdx = spectra.curveIdx;

      var filename = '';
      if (entityFileNames && curveIdx < entityFileNames.length) {
        filename = entityFileNames[curveIdx];
      }
      return { name: idx + 1 + '.', idx: curveIdx, color: color, filename: filename };
    });
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
    _core.Accordion,
    { 'data-testid': 'GraphSelectionPanel' },
    _react2.default.createElement(
      _core.AccordionSummary,
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
          'Graph selection'
        )
      )
    ),
    _react2.default.createElement(_Divider2.default, null),
    subLayoutValues && subLayoutValues.length > 1 ? _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        _core.Tabs,
        { value: selectedSubLayout, onChange: onChangeTabSubLayout },
        subLayoutValues.map(function (subLayout, i) {
          var subLayoutName = '';
          switch (subLayout) {
            case 'G/MOL':
              subLayoutName = 'MWD';
              break;
            case 'MILLILITERS':
              subLayoutName = 'ELU';
              break;
            default:
              break;
          }
          return _react2.default.createElement(_core.Tab, { key: i, value: subLayout, label: subLayoutName });
        })
      ),
      _react2.default.createElement(
        _core.List,
        null,
        itemsSubLayout.map(function (item) {
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
    ) : _react2.default.createElement(
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
  entityFileNames: _propTypes2.default.array.isRequired,
  subLayoutsInfo: _propTypes2.default.array
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(GraphSelectionPanel));