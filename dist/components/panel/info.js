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

var _reactSvgFileZoomPan = require('react-svg-file-zoom-pan');

var _reactSvgFileZoomPan2 = _interopRequireDefault(_reactSvgFileZoomPan);

var _reactQuill = require('react-quill');

var _reactQuill2 = _interopRequireDefault(_reactQuill);

var _ExpansionPanel = require('@material-ui/core/ExpansionPanel');

var _ExpansionPanel2 = _interopRequireDefault(_ExpansionPanel);

var _ExpansionPanelSummary = require('@material-ui/core/ExpansionPanelSummary');

var _ExpansionPanelSummary2 = _interopRequireDefault(_ExpansionPanelSummary);

var _ExpandMore = require('@material-ui/icons/ExpandMore');

var _ExpandMore2 = _interopRequireDefault(_ExpandMore);

var _Divider = require('@material-ui/core/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _styles = require('@material-ui/core/styles');

var _format = require('../../helpers/format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return {
    chip: {
      margin: '1px 0 1px 0'
    },
    panel: {
      backgroundColor: '#eee',
      display: 'table-row'
    },
    panelSummary: {
      backgroundColor: '#eee',
      height: 32
    },
    panelDetail: {
      backgroundColor: '#fff',
      maxHeight: 'calc(90vh - 220px)', // ROI
      overflow: 'auto'
    },
    table: {
      width: 'auto'
    },
    rowRoot: {
      border: '1px solid #eee',
      height: 36,
      lineHeight: '36px',
      overflow: 'hidden',
      paddingLeft: 24,
      textAlign: 'left'
    },
    rowOdd: {
      backgroundColor: '#fff',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    rowEven: {
      backgroundColor: '#fafafa',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    rowOddSim: {
      backgroundColor: '#fff',
      height: 108,
      lineHeight: '24px',
      overflowY: 'scroll',
      overflowWrap: 'word-break'
    },
    tHead: {
      fontWeight: 'bold',
      float: 'left',
      fontSize: '0.8rem',
      fontFamily: 'Helvetica'
    },
    tTxt: {
      fontSize: '0.8rem',
      fontFamily: 'Helvetica',
      marginRight: 3
    },
    quill: {
      backgroundColor: '#fafafa',
      border: '1px solid #eee',
      fontSize: '0.8rem',
      fontFamily: 'Helvetica',
      padding: '0 10px 0 10px',
      textAlign: 'left'
    }
  };
};

var simTitle = function simTitle() {
  return 'Simulated signals from NMRshiftDB';
};

var simContent = function simContent(nmrSimPeaks) {
  return nmrSimPeaks && nmrSimPeaks.sort(function (a, b) {
    return a - b;
  }).join(', ');
};

var InfoPanel = function InfoPanel(_ref) {
  var classes = _ref.classes,
      expand = _ref.expand,
      feature = _ref.feature,
      editorOnly = _ref.editorOnly,
      molSvg = _ref.molSvg,
      descriptions = _ref.descriptions,
      layoutSt = _ref.layoutSt,
      simulationSt = _ref.simulationSt,
      shiftNameSt = _ref.shiftNameSt,
      onExapnd = _ref.onExapnd,
      canChangeDescription = _ref.canChangeDescription,
      onDescriptionChanged = _ref.onDescriptionChanged;

  if (!feature) return null;
  var title = feature.title,
      observeFrequency = feature.observeFrequency,
      solventName = feature.solventName;

  var showSolvName = shiftNameSt === '- - -' ? solventName : shiftNameSt;

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
          'Info'
        )
      )
    ),
    _react2.default.createElement(_Divider2.default, null),
    _react2.default.createElement(
      'div',
      { className: (0, _classnames2.default)(classes.panelDetail) },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(classes.rowRoot, classes.rowOdd) },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt') },
          'Title : '
        ),
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.tTxt, 'txt-sv-panel-txt') },
          title
        )
      ),
      _format2.default.isNmrLayout(layoutSt) ? _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(classes.rowRoot, classes.rowEven) },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt') },
          'Freq : '
        ),
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.tTxt, 'txt-sv-panel-txt') },
          parseInt(observeFrequency, 10) || ' - '
        )
      ) : null,
      _format2.default.isNmrLayout(layoutSt) ? _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(classes.rowRoot, classes.rowOdd) },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt') },
          'Solv : '
        ),
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.tTxt, 'txt-sv-panel-txt') },
          showSolvName
        )
      ) : null,
      !molSvg ? null : _react2.default.createElement(_reactSvgFileZoomPan2.default, {
        svg: molSvg,
        duration: 300,
        resize: true
      })
    ),
    _react2.default.createElement(_reactQuill2.default, {
      className: (0, _classnames2.default)(classes.quill, 'card-sv-quill'),
      value: descriptions,
      modules: { toolbar: false },
      onChange: onDescriptionChanged,
      readOnly: canChangeDescription !== undefined ? !canChangeDescription : true
    }),
    _react2.default.createElement(
      'div',
      null,
      !editorOnly && _format2.default.isNmrLayout(layoutSt) ? _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(classes.rowRoot, classes.rowOddSim) },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt') },
          simTitle(),
          ':'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.tTxt, classes.tTxtSim, 'txt-sv-panel-txt') },
          simContent(simulationSt.nmrSimPeaks)
        )
      ) : null
    )
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      layoutSt: state.layout,
      simulationSt: state.simulation,
      shiftNameSt: state.shift.ref.name
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({}, dispatch);
};

InfoPanel.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  expand: _propTypes2.default.bool.isRequired,
  feature: _propTypes2.default.object.isRequired,
  editorOnly: _propTypes2.default.bool.isRequired,
  molSvg: _propTypes2.default.string.isRequired,
  descriptions: _propTypes2.default.array.isRequired,
  layoutSt: _propTypes2.default.string.isRequired,
  simulationSt: _propTypes2.default.array.isRequired,
  shiftNameSt: _propTypes2.default.string.isRequired,
  onExapnd: _propTypes2.default.func.isRequired,
  canChangeDescription: _propTypes2.default.bool.isRequired,
  onDescriptionChanged: _propTypes2.default.func
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(InfoPanel));