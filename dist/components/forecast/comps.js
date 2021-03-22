'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sectionSvg = exports.notToRenderAnalysis = exports.sectionInput = exports.ConfidenceLabel = exports.StatusIcon = exports.TxtLabel = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactSvgFileZoomPan = require('react-svg-file-zoom-pan');

var _reactSvgFileZoomPan2 = _interopRequireDefault(_reactSvgFileZoomPan);

var _CheckCircleOutline = require('@material-ui/icons/CheckCircleOutline');

var _CheckCircleOutline2 = _interopRequireDefault(_CheckCircleOutline);

var _ErrorOutline = require('@material-ui/icons/ErrorOutline');

var _ErrorOutline2 = _interopRequireDefault(_ErrorOutline);

var _HighlightOff = require('@material-ui/icons/HighlightOff');

var _HighlightOff2 = _interopRequireDefault(_HighlightOff);

var _HelpOutline = require('@material-ui/icons/HelpOutline');

var _HelpOutline2 = _interopRequireDefault(_HelpOutline);

var _Help = require('@material-ui/icons/Help');

var _Help2 = _interopRequireDefault(_Help);

var _Tooltip = require('@material-ui/core/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _Grid = require('@material-ui/core/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _TextField = require('@material-ui/core/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _CloudOff = require('@material-ui/icons/CloudOff');

var _CloudOff2 = _interopRequireDefault(_CloudOff);

var _CircularProgress = require('@material-ui/core/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _section_loading = require('./section_loading');

var _section_loading2 = _interopRequireDefault(_section_loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var titleStyle = {
  backgroundColor: '#f5f5f5',
  border: '2px solid #e3e3e3',
  borderRadius: '10px',
  lineHeight: '200px',
  marginBottom: 10,
  marginTop: 10,
  marginLeft: 40,
  textAlign: 'center',
  width: '70%'
};

var txtStyle = {
  lineHeight: '20px'
};

var TxtLabel = function TxtLabel(classes, label) {
  var extClsName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'txt-label';
  return _react2.default.createElement(
    'span',
    {
      className: (0, _classnames2.default)(classes.txtLabel, extClsName)
    },
    label
  );
};

var StatusIcon = function StatusIcon(status) {
  switch (status) {
    case 'accept':
      return _react2.default.createElement(
        _Tooltip2.default,
        {
          title: _react2.default.createElement(
            'span',
            { className: 'txt-sv-tp' },
            'Accept'
          ),
          placement: 'left'
        },
        _react2.default.createElement(_CheckCircleOutline2.default, { style: { color: '#4caf50' } })
      );
    case 'warning':
      return _react2.default.createElement(
        _Tooltip2.default,
        {
          title: _react2.default.createElement(
            'span',
            { className: 'txt-sv-tp' },
            'Warning'
          ),
          placement: 'left'
        },
        _react2.default.createElement(_ErrorOutline2.default, { style: { color: '#ffc107' } })
      );
    case 'reject':
      return _react2.default.createElement(
        _Tooltip2.default,
        {
          title: _react2.default.createElement(
            'span',
            { className: 'txt-sv-tp' },
            'Reject'
          ),
          placement: 'left'
        },
        _react2.default.createElement(_HighlightOff2.default, { style: { color: '#e91e63' } })
      );
    case 'missing':
      return _react2.default.createElement(
        _Tooltip2.default,
        {
          title: _react2.default.createElement(
            'span',
            { className: 'txt-sv-tp' },
            'Missing'
          ),
          placement: 'left'
        },
        _react2.default.createElement(_HelpOutline2.default, { style: { color: '#5d4037' } })
      );
    case 'unknown':
      return _react2.default.createElement(
        _Tooltip2.default,
        {
          title: _react2.default.createElement(
            'span',
            { className: 'txt-sv-tp' },
            'Not Support'
          ),
          placement: 'left'
        },
        _react2.default.createElement(_Help2.default, { style: { color: '#5d4037' } })
      );
    default:
      return null;
  }
};

var ConfidenceLabel = function ConfidenceLabel(classes, confidence) {
  var extClsName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'txt-label';

  if (!confidence) return _react2.default.createElement(
    'span',
    null,
    ' - - '
  );
  var confidenceDp = parseFloat(Math.round(confidence * 100) / 100).toFixed(2);

  return _react2.default.createElement(
    'span',
    {
      className: (0, _classnames2.default)(classes.txtLabel, extClsName)
    },
    confidenceDp + ' %'
  );
};

var sectionInput = function sectionInput(classes, molecule, inputFuncCb) {
  if (!inputFuncCb) return null;

  return _react2.default.createElement(
    'div',
    {
      className: (0, _classnames2.default)(classes.inputRoot)
    },
    _react2.default.createElement(
      _Grid2.default,
      { container: true },
      _react2.default.createElement(
        _Grid2.default,
        { item: true, xs: 6 },
        _react2.default.createElement(_TextField2.default, {
          fullWidth: true,
          label: TxtLabel(classes, 'Molfile', 'txt-mol-label'),
          margin: 'normal',
          multiline: true,
          onChange: inputFuncCb,
          rows: '2',
          variant: 'outlined',
          value: molecule
        })
      )
    )
  );
};

var SectionRunning = function SectionRunning() {
  return _react2.default.createElement(
    'div',
    { style: titleStyle },
    _react2.default.createElement(
      'h2',
      { style: txtStyle },
      _react2.default.createElement(_CircularProgress2.default, { style: { color: 'blue', fontSize: 50 } }),
      _react2.default.createElement('br', null),
      _react2.default.createElement('br', null),
      _react2.default.createElement(
        'p',
        null,
        'The server is making predictions...'
      )
    )
  );
};

var SectionMissMatch = function SectionMissMatch() {
  return _react2.default.createElement(
    'div',
    { style: titleStyle },
    _react2.default.createElement(
      'h2',
      { style: txtStyle },
      _react2.default.createElement(_ErrorOutline2.default, { style: { color: 'red', fontSize: 50 } }),
      _react2.default.createElement(
        'p',
        { className: 'txt-predict-fail' },
        'Peak & Element count mismatch!'
      ),
      _react2.default.createElement(
        'p',
        { className: 'txt-predict-fail' },
        _react2.default.createElement(
          'sup',
          null,
          '1'
        ),
        'H multiplicity count should not be more than the proton group count. Multiplicity must be assigned manulally before predictions.'
      ),
      _react2.default.createElement(
        'p',
        { className: 'txt-predict-fail' },
        _react2.default.createElement(
          'sup',
          null,
          '13'
        ),
        'C peak count should not be more than the carbon count, and solvent peaks should be excluded.'
      )
    )
  );
};

var SectionNoService = function SectionNoService() {
  return _react2.default.createElement(
    'div',
    { style: titleStyle },
    _react2.default.createElement(
      'h2',
      { style: txtStyle },
      _react2.default.createElement(_CloudOff2.default, { style: { color: 'red', fontSize: 50 } }),
      _react2.default.createElement(
        'p',
        null,
        'Service is not available.'
      ),
      _react2.default.createElement(
        'p',
        null,
        'Please try it again later.'
      )
    )
  );
};

var SectionUnknown = function SectionUnknown() {
  return _react2.default.createElement(
    'div',
    { style: titleStyle },
    _react2.default.createElement(
      'h2',
      { style: txtStyle },
      _react2.default.createElement(_HelpOutline2.default, { style: { color: 'purple', fontSize: 50 } }),
      _react2.default.createElement(
        'p',
        null,
        'Unknown state.'
      )
    )
  );
};

var notToRenderAnalysis = function notToRenderAnalysis(pds) {
  if (pds.running) return _react2.default.createElement(SectionRunning, null);
  if (!pds.outline || !pds.outline.code) return _react2.default.createElement('div', null);

  if (pds.outline.code >= 500) return _react2.default.createElement(SectionNoService, null);
  if (pds.outline.code === 400) return _react2.default.createElement(SectionMissMatch, null);
  if (pds.outline.code >= 300) return _react2.default.createElement(SectionUnknown, null);
  return false;
};

var sectionSvg = function sectionSvg(classes, predictions) {
  var renderMsg = notToRenderAnalysis(predictions);
  if (renderMsg) return null;

  if (!predictions.output) return null;
  var targetSvg = predictions.output.result[0].svgs[0];
  if (!targetSvg) return _react2.default.createElement(_section_loading2.default, null);
  return _react2.default.createElement(_reactSvgFileZoomPan2.default, {
    svg: targetSvg,
    duration: 300,
    resize: true
  });
};

exports.TxtLabel = TxtLabel;
exports.StatusIcon = StatusIcon;
exports.ConfidenceLabel = ConfidenceLabel;
exports.sectionInput = sectionInput;
exports.notToRenderAnalysis = notToRenderAnalysis;
exports.sectionSvg = sectionSvg;