"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _InputBase = _interopRequireDefault(require("@material-ui/core/InputBase"));
var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _reactQuill = _interopRequireDefault(require("react-quill"));
var _app = require("./app");
var _nmr1h_jcamp = _interopRequireDefault(require("./__tests__/fixtures/nmr1h_jcamp"));
var _nmr1h_2_jcamp = _interopRequireDefault(require("./__tests__/fixtures/nmr1h_2_jcamp"));
var _nmr13c_dept_jcamp = _interopRequireDefault(require("./__tests__/fixtures/nmr13c_dept_jcamp"));
var _nmr13c_jcamp = _interopRequireDefault(require("./__tests__/fixtures/nmr13c_jcamp"));
var _nmr19f_jcamp = _interopRequireDefault(require("./__tests__/fixtures/nmr19f_jcamp"));
var _nmr31p_jcamp = _interopRequireDefault(require("./__tests__/fixtures/nmr31p_jcamp"));
var _nmr15n_jcamp = _interopRequireDefault(require("./__tests__/fixtures/nmr15n_jcamp"));
var _nmr29si_jcamp = _interopRequireDefault(require("./__tests__/fixtures/nmr29si_jcamp"));
var _ir_jcamp = _interopRequireDefault(require("./__tests__/fixtures/ir_jcamp"));
var _compare_ir_1_jcamp = _interopRequireDefault(require("./__tests__/fixtures/compare_ir_1_jcamp"));
var _compare_ir_2_jcamp = _interopRequireDefault(require("./__tests__/fixtures/compare_ir_2_jcamp"));
var _raman_jcamp = _interopRequireDefault(require("./__tests__/fixtures/raman_jcamp"));
var _ms_jcamp = _interopRequireDefault(require("./__tests__/fixtures/ms_jcamp"));
var _nmr_result = _interopRequireDefault(require("./__tests__/fixtures/nmr_result"));
var _ir_result = _interopRequireDefault(require("./__tests__/fixtures/ir_result"));
var _phenylalanin = _interopRequireDefault(require("./__tests__/fixtures/phenylalanin"));
var _compare_uv_vis_jcamp = _interopRequireDefault(require("./__tests__/fixtures/compare_uv_vis_jcamp"));
var _uv_vis_jcamp = _interopRequireDefault(require("./__tests__/fixtures/uv_vis_jcamp"));
var _hplc_uvvis_jcamp = _interopRequireDefault(require("./__tests__/fixtures/hplc_uvvis_jcamp"));
var _hplc_uvvis_jcamp_ = _interopRequireDefault(require("./__tests__/fixtures/hplc_uvvis_jcamp_2"));
var _tga_jcamp = _interopRequireDefault(require("./__tests__/fixtures/tga_jcamp"));
var _xrd_jcamp_ = _interopRequireDefault(require("./__tests__/fixtures/xrd_jcamp_1"));
var _xrd_jcamp_2 = _interopRequireDefault(require("./__tests__/fixtures/xrd_jcamp_2"));
var _cyclic_voltammetry_ = _interopRequireDefault(require("./__tests__/fixtures/cyclic_voltammetry_1"));
var _cyclic_voltammetry_2 = _interopRequireDefault(require("./__tests__/fixtures/cyclic_voltammetry_2"));
var _cyclic_voltammetry_3 = _interopRequireDefault(require("./__tests__/fixtures/cyclic_voltammetry_3"));
var _cds_jcamp = _interopRequireDefault(require("./__tests__/fixtures/cds_jcamp"));
var _sec_1_jcamp = _interopRequireDefault(require("./__tests__/fixtures/sec_1_jcamp"));
var _sec_2_jcamp = _interopRequireDefault(require("./__tests__/fixtures/sec_2_jcamp"));
var _sec_3_jcamp = _interopRequireDefault(require("./__tests__/fixtures/sec_3_jcamp"));
var _sec_4_jcamp = _interopRequireDefault(require("./__tests__/fixtures/sec_4_jcamp"));
var _qDescValue = require("./__tests__/fixtures/qDescValue");
require("./__tests__/style/svg.css");
/* eslint-disable prefer-object-spread, default-param-last, no-nested-ternary */

const nmr1HEntity = _app.FN.ExtractJcamp(_nmr1h_jcamp.default);
const nmr1HEntity2 = _app.FN.ExtractJcamp(_nmr1h_2_jcamp.default);
const nmr13CEntity = _app.FN.ExtractJcamp(_nmr13c_jcamp.default);
const nmr13CDeptEntity = _app.FN.ExtractJcamp(_nmr13c_dept_jcamp.default);
const nmr19FEntity = _app.FN.ExtractJcamp(_nmr19f_jcamp.default);
const nmr31PEntity = _app.FN.ExtractJcamp(_nmr31p_jcamp.default);
const nmr15NEntity = _app.FN.ExtractJcamp(_nmr15n_jcamp.default);
const nmr29SiEntity = _app.FN.ExtractJcamp(_nmr29si_jcamp.default);
const irEntity = _app.FN.ExtractJcamp(_ir_jcamp.default);
const compIr1Entity = _app.FN.ExtractJcamp(_compare_ir_1_jcamp.default);
const compIr2Entity = _app.FN.ExtractJcamp(_compare_ir_2_jcamp.default);
const ramanEntity = _app.FN.ExtractJcamp(_raman_jcamp.default);
const msEntity = _app.FN.ExtractJcamp(_ms_jcamp.default);
const uvVisEntity = _app.FN.ExtractJcamp(_uv_vis_jcamp.default);
const compUvVisEntity = _app.FN.ExtractJcamp(_compare_uv_vis_jcamp.default);
const hplcUVVisEntity = _app.FN.ExtractJcamp(_hplc_uvvis_jcamp.default);
const hplcUVVisEntity2 = _app.FN.ExtractJcamp(_hplc_uvvis_jcamp_.default);
const tgaEntity = _app.FN.ExtractJcamp(_tga_jcamp.default);
const xrdEntity1 = _app.FN.ExtractJcamp(_xrd_jcamp_.default);
const xrdEntity2 = _app.FN.ExtractJcamp(_xrd_jcamp_2.default);
const cyclicVoltaEntity1 = _app.FN.ExtractJcamp(_cyclic_voltammetry_.default);
const cyclicVoltaEntity2 = _app.FN.ExtractJcamp(_cyclic_voltammetry_2.default);
const cyclicVoltaEntity3 = _app.FN.ExtractJcamp(_cyclic_voltammetry_3.default);
const cdsEntity = _app.FN.ExtractJcamp(_cds_jcamp.default);
const secEntity1 = _app.FN.ExtractJcamp(_sec_1_jcamp.default);
const secEntity2 = _app.FN.ExtractJcamp(_sec_2_jcamp.default);
const secEntity3 = _app.FN.ExtractJcamp(_sec_3_jcamp.default);
const secEntity4 = _app.FN.ExtractJcamp(_sec_4_jcamp.default);
class DemoWriteIr extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      typ: 'nmr 1h',
      desc: '',
      predictions: false,
      molecule: '',
      showOthers: false,
      descChanged: ''
    };
    this.onClick = this.onClick.bind(this);
    this.writeMpy = this.writeMpy.bind(this);
    this.writePeak = this.writePeak.bind(this);
    this.formatPks = this.formatPks.bind(this);
    this.formatMpy = this.formatMpy.bind(this);
    this.savePeaks = this.savePeaks.bind(this);
    this.predictOp = this.predictOp.bind(this);
    this.updatInput = this.updatInput.bind(this);
    this.loadEntity = this.loadEntity.bind(this);
    this.loadQuill = this.loadQuill.bind(this);
    this.onShowOthers = this.onShowOthers.bind(this);
    this.loadOthers = this.loadOthers.bind(this);
    this.onDescriptionChanged = this.onDescriptionChanged.bind(this);
    this.loadMultiEntities = this.loadMultiEntities.bind(this);
  }
  onClick(typ) {
    return () => {
      this.setState({
        typ,
        desc: '',
        predictions: false,
        molecule: ''
      });
    };
  }
  onShowOthers(jcamp) {
    // eslint-disable-line
    this.setState({
      showOthers: true
    });
  }
  onDescriptionChanged(content) {
    // console.log(content)
    this.setState({
      descChanged: content
    });
  }
  loadEntity() {
    const {
      typ
    } = this.state;
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
        return xrdEntity1;
      case 'cyclic volta':
        return cyclicVoltaEntity2;
      case 'cds':
        return cdsEntity;
      case 'sec':
        return secEntity1;
      case 'ms':
      default:
        return msEntity;
    }
  }
  loadMultiEntities() {
    const {
      typ
    } = this.state;
    switch (typ) {
      case 'cyclic volta':
        return [cyclicVoltaEntity1, cyclicVoltaEntity2, cyclicVoltaEntity3];
      case 'multi':
        return [nmr1HEntity, nmr1HEntity2];
      case 'multi hplc':
        return [hplcUVVisEntity, hplcUVVisEntity2];
      case 'multi ir':
        return [compIr1Entity, compIr2Entity];
      case 'multi xrd':
        return [xrdEntity1, xrdEntity2];
      case 'sec':
        return [secEntity1, secEntity2, secEntity3, secEntity4];
      default:
        return false;
    }
  }
  loadQuill() {
    const {
      typ
    } = this.state;
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
      case 'cyclic volta':
      case 'cds':
      case 'sec':
      default:
        return false;
    }
  }
  loadOthers() {
    const {
      showOthers,
      typ
    } = this.state;
    const isIr = typ === 'ir';
    const isXRD = typ === 'xrd';
    const others = showOthers ? isIr ? [compIr1Entity, compIr2Entity] : isXRD ? [xrdEntity2] : [compUvVisEntity] : [];
    return {
      others,
      addOthersCb: this.onShowOthers
    };
  }
  rmDollarSign(target) {
    return target.replace(/\$/g, '');
  }
  formatPks(_ref) {
    let {
      peaks,
      layout,
      shift,
      isAscend,
      decimal,
      isIntensity,
      integration
    } = _ref;
    const entity = this.loadEntity();
    const {
      features
    } = entity;
    const {
      maxY,
      minY
    } = Array.isArray(features) ? {} : features.editPeak || features.autoPeak;
    const boundary = {
      maxY,
      minY
    };
    const body = _app.FN.peaksBody({
      peaks,
      layout,
      decimal,
      shift,
      isAscend,
      isIntensity,
      boundary,
      integration
    });
    const wrapper = _app.FN.peaksWrapper(layout, shift);
    const desc = this.rmDollarSign(wrapper.head) + body + wrapper.tail;
    return desc;
  }
  formatMpy(_ref2) {
    let {
      multiplicity,
      integration,
      shift,
      isAscend,
      decimal,
      layout
    } = _ref2;
    // obsv freq
    const entity = this.loadEntity();
    const {
      features
    } = entity;
    const {
      observeFrequency
    } = Array.isArray(features) ? features[0] : features.editPeak || features.autoPeak;
    const freq = observeFrequency[0];
    const freqStr = freq ? `${parseInt(freq, 10)} MHz, ` : '';
    // multiplicity
    const {
      refArea,
      refFactor
    } = integration;
    const shiftVal = multiplicity.shift;
    const ms = multiplicity.stack;
    const is = integration.stack;
    const macs = ms.map(m => {
      const {
        peaks,
        mpyType,
        xExtent
      } = m;
      const {
        xL,
        xU
      } = xExtent;
      const it = is.filter(i => i.xL === xL && i.xU === xU)[0] || {
        area: 0
      };
      const area = it.area * refFactor / refArea; // eslint-disable-line
      const center = _app.FN.calcMpyCenter(peaks, shiftVal, mpyType);
      const xs = m.peaks.map(p => p.x).sort((a, b) => a - b);
      const [aIdx, bIdx] = isAscend ? [0, xs.length - 1] : [xs.length - 1, 0];
      const mxA = mpyType === 'm' ? (xs[aIdx] - shiftVal).toFixed(decimal) : 0;
      const mxB = mpyType === 'm' ? (xs[bIdx] - shiftVal).toFixed(decimal) : 0;
      return Object.assign({}, m, {
        area,
        center,
        mxA,
        mxB
      });
    }).sort((a, b) => isAscend ? a.center - b.center : b.center - a.center);
    const str = macs.map(m => {
      const c = m.center;
      const type = m.mpyType;
      const it = Math.round(m.area);
      const js = m.js.map(j => `J = ${j.toFixed(1)} Hz`).join(', ');
      const atomCount = layout === '1H' ? `, ${it}H` : '';
      const location = type === 'm' ? `${m.mxA}–${m.mxB}` : `${c.toFixed(decimal)}`;
      return m.js.length === 0 ? `${location} (${type}${atomCount})` : `${location} (${type}, ${js}${atomCount})`;
    }).join(', ');
    const {
      label,
      value,
      name
    } = shift.ref;
    const solvent = label ? `${name.split('(')[0].trim()} [${value.toFixed(decimal)} ppm], ` : '';
    return `${layout} NMR (${freqStr}${solvent}ppm) δ = ${str}.`;
  }
  writeMpy(_ref3) {
    let {
      layout,
      shift,
      isAscend,
      decimal,
      multiplicity,
      integration
    } = _ref3;
    if (['1H', '13C', '19F'].indexOf(layout) < 0) return;
    const desc = this.formatMpy({
      multiplicity,
      integration,
      shift,
      isAscend,
      decimal,
      layout
    });
    this.setState({
      desc
    });
  }
  writePeak(_ref4) {
    let {
      peaks,
      layout,
      shift,
      isAscend,
      decimal,
      isIntensity,
      integration
    } = _ref4;
    const desc = this.formatPks({
      peaks,
      layout,
      shift,
      isAscend,
      decimal,
      isIntensity,
      integration
    });
    this.setState({
      desc
    });
  }
  savePeaks(_ref5) {
    let {
      peaks,
      layout,
      shift,
      isAscend,
      decimal,
      analysis,
      isIntensity,
      integration,
      multiplicity
    } = _ref5;
    const entity = this.loadEntity();
    const {
      features
    } = entity;
    const {
      maxY,
      minY
    } = Array.isArray(features) ? features[0] : features.editPeak || features.autoPeak;
    const boundary = {
      maxY,
      minY
    };
    const body = _app.FN.peaksBody({
      peaks,
      layout,
      decimal,
      shift,
      isAscend,
      isIntensity,
      boundary
    });
    /*eslint-disable */
    console.log(analysis);
    console.log(integration);
    console.log(multiplicity);
    if (shift.ref.label) {
      const label = this.rmDollarSign(shift.ref.label);
      alert(`Peaks: ${body}` + '\n' + '- - - - - - - - - - -' + '\n' + `Shift solvent = ${label}, ${shift.ref.value}ppm` + '\n');
    } else {
      alert(`Peaks: ${body}` + '\n');
    }
    /*eslint-disable */
  }

  predictOp(_ref6) {
    let {
      multiplicity
    } = _ref6;
    const {
      stack,
      shift
    } = multiplicity;
    const targets = stack.map(stk => {
      const {
        mpyType,
        peaks
      } = stk;
      return _app.FN.CalcMpyCenter(peaks, shift, mpyType);
    });
    // console.log(targets)
    const {
      molecule,
      typ
    } = this.state;
    const predictions = {
      running: true
    };
    this.setState({
      predictions
    });
    // simulate fetching...
    const result = typ === 'ir' ? _ir_result.default : _nmr_result.default;
    setTimeout(() => {
      this.setState({
        predictions: result
      });
    }, 2000);
  }
  updatInput(e) {
    const molecule = e.target.value;
    this.setState({
      molecule
    });
  }
  render() {
    const {
      desc,
      predictions,
      molecule,
      typ
    } = this.state;
    const entity = this.loadEntity();
    const qDescVal = this.loadQuill();
    const multiEntities = this.loadMultiEntities();
    let operations = [{
      name: 'write peaks',
      value: this.writePeak
    }, {
      name: 'save',
      value: this.savePeaks
    }].filter(r => r.value);
    if (['1H', '13C', '19F', '31P', '15N', '29Si'].indexOf(entity.layout) >= 0) {
      operations = [{
        name: 'write multiplicity',
        value: this.writeMpy
      }, ...operations];
    }
    const refreshCb = () => alert('Refresch simulation!');
    const forecast = {
      btnCb: this.predictOp,
      refreshCb,
      inputCb: this.updatInput,
      molecule: molecule,
      predictions
    };
    const molSvg = ['nmr 1h', 'ir'].indexOf(typ) >= 0 ? _phenylalanin.default.path : '';
    const others = this.loadOthers();
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        width: Math.round(window.innerWidth * 0.96)
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        margin: '0 0 15px 55px'
      }
    }, /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('nmr 1h')
    }, "NMR 1H"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('nmr 13c')
    }, "NMR 13C"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('nmr 13c dept')
    }, "NMR 13C DEPT"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('nmr 19f')
    }, "NMR 19F"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('nmr 31p')
    }, "NMR 31P"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('nmr 15n')
    }, "NMR 15N"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('nmr 29si')
    }, "NMR 29Si"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('ir')
    }, "IR"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('raman')
    }, "RAMAN"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('uv/vis')
    }, "UV/VIS"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('hplc uv/vis')
    }, "HPLC UV/VIS"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('tga')
    }, "TGA"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('xrd')
    }, "XRD"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('cyclic volta')
    }, "CV"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('cds')
    }, "CDS"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('sec')
    }, "SEC"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('ms')
    }, "MS"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('multi')
    }, "Multi NMR"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('multi ir')
    }, "Multi IR"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('multi hplc')
    }, "Multi HPLC"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      variant: "contained",
      style: {
        margin: '0 10px 0 10px'
      },
      onClick: this.onClick('multi xrd')
    }, "Multi XRD")), /*#__PURE__*/_react.default.createElement(_app.SpectraEditor, {
      entity: entity,
      multiEntities: multiEntities,
      others: others,
      editorOnly: false,
      canChangeDescription: true,
      onDescriptionChanged: this.onDescriptionChanged,
      molSvg: molSvg,
      userManualLink: {
        cv: "https://www.chemotion.net/chemotionsaurus/docs/eln/chemspectra/cvanalysis"
      }
    }), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("span", null, "Description Changed"), /*#__PURE__*/_react.default.createElement(_reactQuill.default, {
      className: 'card-sv-quill',
      value: this.state.descChanged,
      modules: {
        toolbar: false
      },
      readOnly: true
    })), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 10
    }, /*#__PURE__*/_react.default.createElement(_InputBase.default, {
      style: {
        margin: '0 0 0 63px'
      },
      placeholder: "Description",
      multiline: true,
      fullWidth: true,
      rows: "2",
      margin: "dense",
      value: desc
    }))));
  }
}

// - - - DOM - - -
_reactDom.default.render( /*#__PURE__*/_react.default.createElement(DemoWriteIr, null), document.getElementById('root'));