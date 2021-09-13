'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _InputBase = require('@material-ui/core/InputBase');

var _InputBase2 = _interopRequireDefault(_InputBase);

var _Grid = require('@material-ui/core/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

var _reactQuill = require('react-quill');

var _reactQuill2 = _interopRequireDefault(_reactQuill);

var _app = require('./app');

var _nmr1h_jcamp = require('./__tests__/fixtures/nmr1h_jcamp');

var _nmr1h_jcamp2 = _interopRequireDefault(_nmr1h_jcamp);

var _nmr13c_dept_jcamp = require('./__tests__/fixtures/nmr13c_dept_jcamp');

var _nmr13c_dept_jcamp2 = _interopRequireDefault(_nmr13c_dept_jcamp);

var _nmr13c_jcamp = require('./__tests__/fixtures/nmr13c_jcamp');

var _nmr13c_jcamp2 = _interopRequireDefault(_nmr13c_jcamp);

var _nmr19f_jcamp = require('./__tests__/fixtures/nmr19f_jcamp');

var _nmr19f_jcamp2 = _interopRequireDefault(_nmr19f_jcamp);

var _nmr31p_jcamp = require('./__tests__/fixtures/nmr31p_jcamp');

var _nmr31p_jcamp2 = _interopRequireDefault(_nmr31p_jcamp);

var _nmr15n_jcamp = require('./__tests__/fixtures/nmr15n_jcamp');

var _nmr15n_jcamp2 = _interopRequireDefault(_nmr15n_jcamp);

var _nmr29si_jcamp = require('./__tests__/fixtures/nmr29si_jcamp');

var _nmr29si_jcamp2 = _interopRequireDefault(_nmr29si_jcamp);

var _ir_jcamp = require('./__tests__/fixtures/ir_jcamp');

var _ir_jcamp2 = _interopRequireDefault(_ir_jcamp);

var _compare_ir_1_jcamp = require('./__tests__/fixtures/compare_ir_1_jcamp');

var _compare_ir_1_jcamp2 = _interopRequireDefault(_compare_ir_1_jcamp);

var _compare_ir_2_jcamp = require('./__tests__/fixtures/compare_ir_2_jcamp');

var _compare_ir_2_jcamp2 = _interopRequireDefault(_compare_ir_2_jcamp);

var _raman_jcamp = require('./__tests__/fixtures/raman_jcamp');

var _raman_jcamp2 = _interopRequireDefault(_raman_jcamp);

var _ms_jcamp = require('./__tests__/fixtures/ms_jcamp');

var _ms_jcamp2 = _interopRequireDefault(_ms_jcamp);

var _nmr_result = require('./__tests__/fixtures/nmr_result');

var _nmr_result2 = _interopRequireDefault(_nmr_result);

var _ir_result = require('./__tests__/fixtures/ir_result');

var _ir_result2 = _interopRequireDefault(_ir_result);

var _phenylalanin = require('./__tests__/fixtures/phenylalanin');

var _phenylalanin2 = _interopRequireDefault(_phenylalanin);

var _compare_uv_vis_jcamp = require('./__tests__/fixtures/compare_uv_vis_jcamp');

var _compare_uv_vis_jcamp2 = _interopRequireDefault(_compare_uv_vis_jcamp);

var _uv_vis_jcamp = require('./__tests__/fixtures/uv_vis_jcamp');

var _uv_vis_jcamp2 = _interopRequireDefault(_uv_vis_jcamp);

var _hplc_uvvis_jcamp = require('./__tests__/fixtures/hplc_uvvis_jcamp');

var _hplc_uvvis_jcamp2 = _interopRequireDefault(_hplc_uvvis_jcamp);

var _tga_jcamp = require('./__tests__/fixtures/tga_jcamp');

var _tga_jcamp2 = _interopRequireDefault(_tga_jcamp);

var _xrd_jcamp_ = require('./__tests__/fixtures/xrd_jcamp_1');

var _xrd_jcamp_2 = _interopRequireDefault(_xrd_jcamp_);

var _xrd_jcamp_3 = require('./__tests__/fixtures/xrd_jcamp_2');

var _xrd_jcamp_4 = _interopRequireDefault(_xrd_jcamp_3);

var _qDescValue = require('./__tests__/fixtures/qDescValue');

require('./__tests__/style/svg.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var nmr1HEntity = _app.FN.ExtractJcamp(_nmr1h_jcamp2.default);
var nmr13CEntity = _app.FN.ExtractJcamp(_nmr13c_jcamp2.default);
var nmr13CDeptEntity = _app.FN.ExtractJcamp(_nmr13c_dept_jcamp2.default);
var nmr19FEntity = _app.FN.ExtractJcamp(_nmr19f_jcamp2.default);
var nmr31PEntity = _app.FN.ExtractJcamp(_nmr31p_jcamp2.default);
var nmr15NEntity = _app.FN.ExtractJcamp(_nmr15n_jcamp2.default);
var nmr29SiEntity = _app.FN.ExtractJcamp(_nmr29si_jcamp2.default);
var irEntity = _app.FN.ExtractJcamp(_ir_jcamp2.default);
var compIr1Entity = _app.FN.ExtractJcamp(_compare_ir_1_jcamp2.default);
var compIr2Entity = _app.FN.ExtractJcamp(_compare_ir_2_jcamp2.default);
var ramanEntity = _app.FN.ExtractJcamp(_raman_jcamp2.default);
var msEntity = _app.FN.ExtractJcamp(_ms_jcamp2.default);
var uvVisEntity = _app.FN.ExtractJcamp(_uv_vis_jcamp2.default);
var compUvVisEntity = _app.FN.ExtractJcamp(_compare_uv_vis_jcamp2.default);
var hplcUVVisEntity = _app.FN.ExtractJcamp(_hplc_uvvis_jcamp2.default);
var tgaEntity = _app.FN.ExtractJcamp(_tga_jcamp2.default);
var xrdEntity1 = _app.FN.ExtractJcamp(_xrd_jcamp_2.default);
var xrdEntity2 = _app.FN.ExtractJcamp(_xrd_jcamp_4.default);

var DemoWriteIr = function (_React$Component) {
  _inherits(DemoWriteIr, _React$Component);

  function DemoWriteIr(props) {
    _classCallCheck(this, DemoWriteIr);

    var _this = _possibleConstructorReturn(this, (DemoWriteIr.__proto__ || Object.getPrototypeOf(DemoWriteIr)).call(this, props));

    _this.state = {
      typ: 'nmr 1h',
      desc: '',
      predictions: false,
      molecule: '',
      showOthers: false,
      descChanged: ''
    };

    _this.onClick = _this.onClick.bind(_this);
    _this.writeMpy = _this.writeMpy.bind(_this);
    _this.writePeak = _this.writePeak.bind(_this);
    _this.formatPks = _this.formatPks.bind(_this);
    _this.formatMpy = _this.formatMpy.bind(_this);
    _this.savePeaks = _this.savePeaks.bind(_this);
    _this.predictOp = _this.predictOp.bind(_this);
    _this.updatInput = _this.updatInput.bind(_this);
    _this.loadEntity = _this.loadEntity.bind(_this);
    _this.loadQuill = _this.loadQuill.bind(_this);
    _this.onShowOthers = _this.onShowOthers.bind(_this);
    _this.loadOthers = _this.loadOthers.bind(_this);
    _this.onDescriptionChanged = _this.onDescriptionChanged.bind(_this);
    return _this;
  }

  _createClass(DemoWriteIr, [{
    key: 'onClick',
    value: function onClick(typ) {
      var _this2 = this;

      return function () {
        _this2.setState({
          typ: typ,
          desc: '',
          predictions: false,
          molecule: ''
        });
      };
    }
  }, {
    key: 'rmDollarSign',
    value: function rmDollarSign(target) {
      return target.replace(/\$/g, '');
    }
  }, {
    key: 'formatPks',
    value: function formatPks(_ref) {
      var peaks = _ref.peaks,
          layout = _ref.layout,
          shift = _ref.shift,
          isAscend = _ref.isAscend,
          decimal = _ref.decimal,
          isIntensity = _ref.isIntensity,
          integration = _ref.integration;

      var entity = this.loadEntity();
      var features = entity.features;

      var _ref2 = Array.isArray(features) ? {} : features.editPeak || features.autoPeak,
          maxY = _ref2.maxY,
          minY = _ref2.minY;

      var boundary = { maxY: maxY, minY: minY };
      var body = _app.FN.peaksBody({
        peaks: peaks, layout: layout, decimal: decimal, shift: shift, isAscend: isAscend, isIntensity: isIntensity, boundary: boundary, integration: integration
      });
      var wrapper = _app.FN.peaksWrapper(layout, shift);
      var desc = this.rmDollarSign(wrapper.head) + body + wrapper.tail;
      return desc;
    }
  }, {
    key: 'formatMpy',
    value: function formatMpy(_ref3) {
      var multiplicity = _ref3.multiplicity,
          integration = _ref3.integration,
          shift = _ref3.shift,
          isAscend = _ref3.isAscend,
          decimal = _ref3.decimal,
          layout = _ref3.layout;

      // obsv freq
      var entity = this.loadEntity();
      var features = entity.features;

      var _ref4 = Array.isArray(features) ? features[0] : features.editPeak || features.autoPeak,
          observeFrequency = _ref4.observeFrequency;

      var freq = observeFrequency[0];
      var freqStr = freq ? parseInt(freq, 10) + ' MHz, ' : '';
      // multiplicity
      var refArea = integration.refArea,
          refFactor = integration.refFactor;

      var shiftVal = multiplicity.shift;
      var ms = multiplicity.stack;
      var is = integration.stack;

      var macs = ms.map(function (m) {
        var peaks = m.peaks,
            mpyType = m.mpyType,
            xExtent = m.xExtent;
        var xL = xExtent.xL,
            xU = xExtent.xU;

        var it = is.filter(function (i) {
          return i.xL === xL && i.xU === xU;
        })[0] || { area: 0 };
        var area = it.area * refFactor / refArea;
        var center = _app.FN.calcMpyCenter(peaks, shiftVal, mpyType);
        var xs = m.peaks.map(function (p) {
          return p.x;
        }).sort(function (a, b) {
          return a - b;
        });

        var _ref5 = isAscend ? [0, xs.length - 1] : [xs.length - 1, 0],
            _ref6 = _slicedToArray(_ref5, 2),
            aIdx = _ref6[0],
            bIdx = _ref6[1];

        var mxA = mpyType === 'm' ? (xs[aIdx] - shiftVal).toFixed(decimal) : 0;
        var mxB = mpyType === 'm' ? (xs[bIdx] - shiftVal).toFixed(decimal) : 0;
        return Object.assign({}, m, {
          area: area, center: center, mxA: mxA, mxB: mxB
        });
      }).sort(function (a, b) {
        return isAscend ? a.center - b.center : b.center - a.center;
      });
      var str = macs.map(function (m) {
        var c = m.center;
        var type = m.mpyType;
        var it = Math.round(m.area);
        var js = m.js.map(function (j) {
          return 'J = ' + j.toFixed(1) + ' Hz';
        }).join(', ');
        var atomCount = layout === '1H' ? ', ' + it + 'H' : '';
        var location = type === 'm' ? m.mxA + '\u2013' + m.mxB : '' + c.toFixed(decimal);
        return m.js.length === 0 ? location + ' (' + type + atomCount + ')' : location + ' (' + type + ', ' + js + atomCount + ')';
      }).join(', ');
      var _shift$ref = shift.ref,
          label = _shift$ref.label,
          value = _shift$ref.value,
          name = _shift$ref.name;

      var solvent = label ? name.split('(')[0].trim() + ' [' + value.toFixed(decimal) + ' ppm], ' : '';
      return layout + ' NMR (' + freqStr + solvent + 'ppm) \u03B4 = ' + str + '.';
    }
  }, {
    key: 'writeMpy',
    value: function writeMpy(_ref7) {
      var layout = _ref7.layout,
          shift = _ref7.shift,
          isAscend = _ref7.isAscend,
          decimal = _ref7.decimal,
          multiplicity = _ref7.multiplicity,
          integration = _ref7.integration;

      if (['1H', '13C', '19F'].indexOf(layout) < 0) return;
      var desc = this.formatMpy({
        multiplicity: multiplicity, integration: integration, shift: shift, isAscend: isAscend, decimal: decimal, layout: layout
      });
      this.setState({ desc: desc });
    }
  }, {
    key: 'writePeak',
    value: function writePeak(_ref8) {
      var peaks = _ref8.peaks,
          layout = _ref8.layout,
          shift = _ref8.shift,
          isAscend = _ref8.isAscend,
          decimal = _ref8.decimal,
          isIntensity = _ref8.isIntensity,
          integration = _ref8.integration;

      var desc = this.formatPks({
        peaks: peaks, layout: layout, shift: shift, isAscend: isAscend, decimal: decimal, isIntensity: isIntensity, integration: integration
      });
      this.setState({ desc: desc });
    }
  }, {
    key: 'savePeaks',
    value: function savePeaks(_ref9) {
      var peaks = _ref9.peaks,
          layout = _ref9.layout,
          shift = _ref9.shift,
          isAscend = _ref9.isAscend,
          decimal = _ref9.decimal,
          analysis = _ref9.analysis,
          isIntensity = _ref9.isIntensity,
          integration = _ref9.integration,
          multiplicity = _ref9.multiplicity;

      var entity = this.loadEntity();
      var features = entity.features;

      var _ref10 = Array.isArray(features) ? features[0] : features.editPeak || features.autoPeak,
          maxY = _ref10.maxY,
          minY = _ref10.minY;

      var boundary = { maxY: maxY, minY: minY };
      var body = _app.FN.peaksBody({
        peaks: peaks, layout: layout, decimal: decimal, shift: shift, isAscend: isAscend, isIntensity: isIntensity, boundary: boundary
      });
      /*eslint-disable */
      console.log(analysis);
      console.log(integration);
      console.log(multiplicity);
      if (shift.ref.label) {
        var label = this.rmDollarSign(shift.ref.label);
        alert('Peaks: ' + body + '\n' + '- - - - - - - - - - -' + '\n' + ('Shift solvent = ' + label + ', ' + shift.ref.value + 'ppm') + '\n');
      } else {
        alert('Peaks: ' + body + '\n');
      }
      /*eslint-disable */
    }
  }, {
    key: 'predictOp',
    value: function predictOp(_ref11) {
      var _this3 = this;

      var multiplicity = _ref11.multiplicity;
      var stack = multiplicity.stack,
          shift = multiplicity.shift;

      var targets = stack.map(function (stk) {
        var mpyType = stk.mpyType,
            peaks = stk.peaks;

        return _app.FN.CalcMpyCenter(peaks, shift, mpyType);
      });
      // console.log(targets)
      var _state = this.state,
          molecule = _state.molecule,
          typ = _state.typ;

      var predictions = { running: true };

      this.setState({ predictions: predictions });
      // simulate fetching...
      var result = typ === 'ir' ? _ir_result2.default : _nmr_result2.default;
      setTimeout(function () {
        _this3.setState({ predictions: result });
      }, 2000);
    }
  }, {
    key: 'updatInput',
    value: function updatInput(e) {
      var molecule = e.target.value;
      this.setState({ molecule: molecule });
    }
  }, {
    key: 'loadEntity',
    value: function loadEntity() {
      var typ = this.state.typ;

      switch (typ) {
        case 'nmr 1h':
          return nmr1HEntity;
        case 'nmr 13c':
          return nmr13CEntity;
        case 'nmr 13c dept':
          return nmr13CDeptEntity;
        case 'nmr 19f':
          return nmr19FEntity;
        case 'nmr 31p':
          return nmr31PEntity;
        case 'nmr 15n':
          return nmr15NEntity;
        case 'nmr 29si':
          return nmr29SiEntity;
        case 'ir':
          return irEntity;
        case 'raman':
          return ramanEntity;
        case 'uv/vis':
          return uvVisEntity;
        case 'hplc uv/vis':
          return hplcUVVisEntity;
        case 'tga':
          return tgaEntity;
        case 'xrd':
          return xrdEntity2;
        case 'ms':
        default:
          return msEntity;
      }
    }
  }, {
    key: 'loadQuill',
    value: function loadQuill() {
      var typ = this.state.typ;

      switch (typ) {
        case 'nmr 1h':
          return _qDescValue.q1H;
        case 'nmr 13c':
          return _qDescValue.q13C;
        case 'nmr 13c dept':
          return _qDescValue.q13C;
        case 'ir':
          return _qDescValue.qIR;
        case 'nmr 19f':
        case 'nmr 31p':
        case 'nmr 15n':
        case 'nmr 29si':
        case 'raman':
        case 'uv/vis':
        case 'hplc uv/vis':
        case 'tga':
        case 'xrd':
        case 'ms':
        default:
          return false;
      }
    }
  }, {
    key: 'onShowOthers',
    value: function onShowOthers(jcamp) {
      this.setState({ showOthers: true });
    }
  }, {
    key: 'loadOthers',
    value: function loadOthers() {
      var _state2 = this.state,
          showOthers = _state2.showOthers,
          typ = _state2.typ;

      var isIr = typ === 'ir';
      var others = showOthers ? isIr ? [compIr1Entity, compIr2Entity] : [compUvVisEntity] : [];

      return {
        others: others,
        addOthersCb: this.onShowOthers
      };
    }
  }, {
    key: 'onDescriptionChanged',
    value: function onDescriptionChanged(content) {
      // console.log(content)
      this.setState({ descChanged: content });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state3 = this.state,
          desc = _state3.desc,
          predictions = _state3.predictions,
          molecule = _state3.molecule,
          typ = _state3.typ;

      var entity = this.loadEntity();
      var qDescVal = this.loadQuill();

      var operations = [{ name: 'write peaks', value: this.writePeak }, { name: 'save', value: this.savePeaks }].filter(function (r) {
        return r.value;
      });
      if (['1H', '13C', '19F', '31P', '15N', '29Si'].indexOf(entity.layout) >= 0) {
        operations = [{ name: 'write multiplicity', value: this.writeMpy }].concat(_toConsumableArray(operations));
      }

      var refreshCb = function refreshCb() {
        return alert('Refresch simulation!');
      };

      var forecast = {
        btnCb: this.predictOp,
        refreshCb: refreshCb,
        inputCb: this.updatInput,
        molecule: molecule,
        predictions: predictions
      };

      var molSvg = ['nmr 1h', 'ir'].indexOf(typ) >= 0 ? _phenylalanin2.default.path : '';
      var others = this.loadOthers();

      return _react2.default.createElement(
        'div',
        { style: { width: Math.round(window.innerWidth * 0.96) } },
        _react2.default.createElement(
          'div',
          { style: { margin: '0 0 15px 55px' } },
          _react2.default.createElement(
            _Button2.default,
            {
              variant: 'contained',
              style: { margin: '0 10px 0 10px' },
              onClick: this.onClick('nmr 1h')
            },
            'NMR 1H'
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              variant: 'contained',
              style: { margin: '0 10px 0 10px' },
              onClick: this.onClick('nmr 13c')
            },
            'NMR 13C'
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              variant: 'contained',
              style: { margin: '0 10px 0 10px' },
              onClick: this.onClick('nmr 13c dept')
            },
            'NMR 13C DEPT'
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              variant: 'contained',
              style: { margin: '0 10px 0 10px' },
              onClick: this.onClick('nmr 19f')
            },
            'NMR 19F'
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              variant: 'contained',
              style: { margin: '0 10px 0 10px' },
              onClick: this.onClick('nmr 31p')
            },
            'NMR 31P'
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              variant: 'contained',
              style: { margin: '0 10px 0 10px' },
              onClick: this.onClick('nmr 15n')
            },
            'NMR 15N'
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              variant: 'contained',
              style: { margin: '0 10px 0 10px' },
              onClick: this.onClick('nmr 29si')
            },
            'NMR 29Si'
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              variant: 'contained',
              style: { margin: '0 10px 0 10px' },
              onClick: this.onClick('ir')
            },
            'IR'
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              variant: 'contained',
              style: { margin: '0 10px 0 10px' },
              onClick: this.onClick('raman')
            },
            'RAMAN'
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              variant: 'contained',
              style: { margin: '0 10px 0 10px' },
              onClick: this.onClick('uv/vis')
            },
            'UV/VIS'
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              variant: 'contained',
              style: { margin: '0 10px 0 10px' },
              onClick: this.onClick('hplc uv/vis')
            },
            'HPLC UV/VIS'
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              variant: 'contained',
              style: { margin: '0 10px 0 10px' },
              onClick: this.onClick('tga')
            },
            'TGA'
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              variant: 'contained',
              style: { margin: '0 10px 0 10px' },
              onClick: this.onClick('xrd')
            },
            'XRD'
          ),
          _react2.default.createElement(
            _Button2.default,
            {
              variant: 'contained',
              style: { margin: '0 10px 0 10px' },
              onClick: this.onClick('ms')
            },
            'MS'
          )
        ),
        _react2.default.createElement(_app.SpectraEditor, {
          entity: entity,
          others: others,
          forecast: forecast,
          operations: operations,
          descriptions: qDescVal,
          style: { fontFamily: 'Helvetica' },
          molSvg: molSvg,
          editorOnly: false,
          canChangeDescription: true,
          onDescriptionChanged: this.onDescriptionChanged
        }),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'span',
            null,
            'Description Changed'
          ),
          _react2.default.createElement(_reactQuill2.default, {
            className: 'card-sv-quill',
            value: this.state.descChanged,
            modules: { toolbar: false },
            readOnly: true
          })
        ),
        _react2.default.createElement(
          _Grid2.default,
          { container: true },
          _react2.default.createElement(
            _Grid2.default,
            { item: true, xs: 10 },
            _react2.default.createElement(_InputBase2.default, {
              style: { margin: '0 0 0 63px' },
              placeholder: 'Description',
              multiline: true,
              fullWidth: true,
              rows: '2',
              margin: 'dense',
              value: desc
            })
          )
        )
      );
    }
  }]);

  return DemoWriteIr;
}(_react2.default.Component);

// - - - DOM - - -


_reactDom2.default.render(_react2.default.createElement(DemoWriteIr, null), document.getElementById('root'));