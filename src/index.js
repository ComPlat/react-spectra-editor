/* eslint-disable prefer-object-spread, default-param-last, no-nested-ternary */
import React from 'react';
import ReactDOM from 'react-dom';

import {
  InputBase, Grid, Button,
} from '@mui/material';

import ReactQuill from 'react-quill';

import { SpectraEditor, FN } from './app';
import nmr1HJcamp from './__tests__/fixtures/nmr1h_jcamp';
import nmr1H2Jcamp from './__tests__/fixtures/nmr1h_2_jcamp';
import nmr13CDeptJcamp from './__tests__/fixtures/nmr13c_dept_jcamp';
import nmr13CJcamp from './__tests__/fixtures/nmr13c_jcamp';
import nmr19FJcamp from './__tests__/fixtures/nmr19f_jcamp';
import nmr31PJcamp from './__tests__/fixtures/nmr31p_jcamp';
import nmr15NJcamp from './__tests__/fixtures/nmr15n_jcamp';
import nmr29SiJcamp from './__tests__/fixtures/nmr29si_jcamp';
import irJcamp from './__tests__/fixtures/ir_jcamp';
import compareIr1Jcamp from './__tests__/fixtures/compare_ir_1_jcamp';
import compareIr2Jcamp from './__tests__/fixtures/compare_ir_2_jcamp';
import ramanJcamp from './__tests__/fixtures/raman_jcamp';
import msJcamp from './__tests__/fixtures/ms_jcamp';
import nmrResult from './__tests__/fixtures/nmr_result';
import irResult from './__tests__/fixtures/ir_result';
import Phenylalanin from './__tests__/fixtures/phenylalanin';
import compareUvVisJcamp from './__tests__/fixtures/compare_uv_vis_jcamp';
import uvVisJcamp from './__tests__/fixtures/uv_vis_jcamp';
import hplcUVVisJcamp from './__tests__/fixtures/hplc_uvvis_jcamp';
import hplcUVVisJcamp2 from './__tests__/fixtures/hplc_uvvis_jcamp_2';
import tgaJcamp from './__tests__/fixtures/tga_jcamp';
import dscJcamp from './__tests__/fixtures/dsc_jcamp';
import xrdJcamp1 from './__tests__/fixtures/xrd_jcamp_1';
import xrdJcamp2 from './__tests__/fixtures/xrd_jcamp_2';
import cyclicVoltaJcamp1 from './__tests__/fixtures/cyclic_voltammetry_1';
import cyclicVoltaJcamp2 from './__tests__/fixtures/cyclic_voltammetry_2';
import cyclicVoltaJcamp3 from './__tests__/fixtures/cyclic_voltammetry_3';
import cdsJcamp from './__tests__/fixtures/cds_jcamp';
import secJcamp1 from './__tests__/fixtures/sec_1_jcamp';
import secJcamp2 from './__tests__/fixtures/sec_2_jcamp';
import secJcamp3 from './__tests__/fixtures/sec_3_jcamp';
import secJcamp4 from './__tests__/fixtures/sec_4_jcamp';
import aifJcamp1 from './__tests__/fixtures/aif_jcamp_1';
import aifJcamp2 from './__tests__/fixtures/aif_jcamp_2';
import emissionsJcamp from './__tests__/fixtures/emissions_jcamp';
import dlsAcfJcamp from './__tests__/fixtures/dls_acf_jcamp';
import dlsIntensityJcamp from './__tests__/fixtures/dls_intensity_jcamp';
import { q1H, qIR, q13C } from './__tests__/fixtures/qDescValue';
import './__tests__/style/svg.css';

const nmr1HEntity = FN.ExtractJcamp(nmr1HJcamp);
const nmr1HEntity2 = FN.ExtractJcamp(nmr1H2Jcamp);
const nmr13CEntity = FN.ExtractJcamp(nmr13CJcamp);
const nmr13CDeptEntity = FN.ExtractJcamp(nmr13CDeptJcamp);
const nmr19FEntity = FN.ExtractJcamp(nmr19FJcamp);
const nmr31PEntity = FN.ExtractJcamp(nmr31PJcamp);
const nmr15NEntity = FN.ExtractJcamp(nmr15NJcamp);
const nmr29SiEntity = FN.ExtractJcamp(nmr29SiJcamp);
const irEntity = FN.ExtractJcamp(irJcamp);
const compIr1Entity = FN.ExtractJcamp(compareIr1Jcamp);
const compIr2Entity = FN.ExtractJcamp(compareIr2Jcamp);
const ramanEntity = FN.ExtractJcamp(ramanJcamp);
const msEntity = FN.ExtractJcamp(msJcamp);
const uvVisEntity = FN.ExtractJcamp(uvVisJcamp);
const compUvVisEntity = FN.ExtractJcamp(compareUvVisJcamp);
const hplcUVVisEntity = FN.ExtractJcamp(hplcUVVisJcamp);
const hplcUVVisEntity2 = FN.ExtractJcamp(hplcUVVisJcamp2);
const tgaEntity = FN.ExtractJcamp(tgaJcamp);
const dscEntity = FN.ExtractJcamp(dscJcamp);
const xrdEntity1 = FN.ExtractJcamp(xrdJcamp1);
const xrdEntity2 = FN.ExtractJcamp(xrdJcamp2);
const cyclicVoltaEntity1 = FN.ExtractJcamp(cyclicVoltaJcamp1);
const cyclicVoltaEntity2 = FN.ExtractJcamp(cyclicVoltaJcamp2);
const cyclicVoltaEntity3 = FN.ExtractJcamp(cyclicVoltaJcamp3);
const cdsEntity = FN.ExtractJcamp(cdsJcamp);
const secEntity1 = FN.ExtractJcamp(secJcamp1);
const secEntity2 = FN.ExtractJcamp(secJcamp2);
const secEntity3 = FN.ExtractJcamp(secJcamp3);
const secEntity4 = FN.ExtractJcamp(secJcamp4);
const aifEntity1 = FN.ExtractJcamp(aifJcamp1);
const aifEntity2 = FN.ExtractJcamp(aifJcamp2);
const emissionsEntity = FN.ExtractJcamp(emissionsJcamp);
const dlsAcfEntity = FN.ExtractJcamp(dlsAcfJcamp);
const dlsIntensityEntity = FN.ExtractJcamp(dlsIntensityJcamp);

class DemoWriteIr extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      typ: 'nmr 1h',
      desc: '',
      predictions: false,
      molecule: '',
      showOthers: false,
      descChanged: '',
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
        molecule: '',
      });
    };
  }

  onShowOthers(jcamp) { // eslint-disable-line
    this.setState({ showOthers: true });
  }

  onDescriptionChanged(content) {
    // console.log(content)
    this.setState({ descChanged: content });
  }

  loadEntity() {
    const { typ } = this.state;
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
      case 'dsc':
        return dscEntity;
      case 'xrd':
        return xrdEntity1;
      case 'cyclic volta':
        return cyclicVoltaEntity2;
      case 'cds':
        return cdsEntity;
      case 'sec':
        return secEntity1;
      case 'aif':
        return aifEntity1;
      case 'emissions':
        return emissionsEntity;
      case 'dls acf':
        return dlsAcfEntity;
      case 'dls intensity':
        return dlsIntensityEntity;
      case 'ms':
      default:
        return msEntity;
    }
  }

  loadMultiEntities() {
    const { typ } = this.state;
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
      case 'aif':
        return [aifEntity1, aifEntity2];
      default:
        return false;
    }
  }

  loadQuill() {
    const { typ } = this.state;
    switch (typ) {
      case 'nmr 1h':
        return q1H;
      case 'nmr 13c':
        return q13C;
      case 'nmr 13c dept':
        return q13C;
      case 'ir':
        return qIR;
      case 'nmr 19f':
      case 'nmr 31p':
      case 'nmr 15n':
      case 'nmr 29si':
      case 'raman':
      case 'uv/vis':
      case 'hplc uv/vis':
      case 'tga':
      case 'dsc':
      case 'xrd':
      case 'ms':
      case 'cyclic volta':
      case 'cds':
      case 'sec':
      case 'aif':
      case 'emissions':
      case 'dls acf':
      case 'dls intensity':
      default:
        return false;
    }
  }

  loadOthers() {
    const { showOthers, typ } = this.state;
    const isIr = typ === 'ir';
    const isXRD = typ === 'xrd';
    const others = showOthers ? (
      isIr ? [compIr1Entity, compIr2Entity] : (
        isXRD ? [xrdEntity2] : [compUvVisEntity])) : [];

    return {
      others,
      addOthersCb: this.onShowOthers,
    };
  }

  rmDollarSign(target) {
    return target.replace(/\$/g, '');
  }

  formatPks({
    peaks, layout, shift, isAscend, decimal, isIntensity, integration, waveLength,
  }) {
    const entity = this.loadEntity();
    const { features } = entity;
    const { temperature } = entity;
    const { maxY, minY } = Array.isArray(features) ? {} : (features.editPeak || features.autoPeak);
    const boundary = { maxY, minY };
    const body = FN.peaksBody({
      peaks,
      layout,
      decimal,
      shift,
      isAscend,
      isIntensity,
      boundary,
      integration,
      waveLength,
      temperature,
    });
    const wrapper = FN.peaksWrapper(layout, shift);
    const desc = this.rmDollarSign(wrapper.head) + body + wrapper.tail;
    return desc;
  }

  formatMpy({
    multiplicity, integration, shift, isAscend, decimal, layout,
  }) {
    // obsv freq
    const entity = this.loadEntity();
    const { features } = entity;
    const { observeFrequency } = Array.isArray(features)
      ? features[0]
      : (features.editPeak || features.autoPeak);
    const freq = observeFrequency[0];
    const freqStr = freq ? `${parseInt(freq, 10)} MHz, ` : '';
    // multiplicity
    const { refArea, refFactor } = integration;
    const shiftVal = multiplicity.shift;
    const ms = multiplicity.stack;
    const is = integration.stack;

    const macs = ms.map((m) => {
      const { peaks, mpyType, xExtent } = m;
      const { xL, xU } = xExtent;
      const it = is.filter((i) => i.xL === xL && i.xU === xU)[0] || { area: 0 };
      const area = it.area * refFactor / refArea; // eslint-disable-line
      const center = FN.calcMpyCenter(peaks, shiftVal, mpyType);
      const xs = m.peaks.map((p) => p.x).sort((a, b) => a - b);
      const [aIdx, bIdx] = isAscend ? [0, xs.length - 1] : [xs.length - 1, 0];
      const mxA = mpyType === 'm' ? (xs[aIdx] - shiftVal).toFixed(decimal) : 0;
      const mxB = mpyType === 'm' ? (xs[bIdx] - shiftVal).toFixed(decimal) : 0;
      return Object.assign({}, m, {
        area, center, mxA, mxB,
      });
    }).sort((a, b) => (isAscend ? a.center - b.center : b.center - a.center));
    const str = macs.map((m) => {
      const c = m.center;
      const type = m.mpyType;
      const it = Math.round(m.area);
      const js = m.js.map((j) => `J = ${j.toFixed(1)} Hz`).join(', ');
      const atomCount = layout === '1H' ? `, ${it}H` : '';
      const location = type === 'm' ? `${m.mxA}–${m.mxB}` : `${c.toFixed(decimal)}`;
      return m.js.length === 0
        ? `${location} (${type}${atomCount})`
        : `${location} (${type}, ${js}${atomCount})`;
    }).join(', ');
    const { label, value, name } = shift.ref;
    const solvent = label ? `${name.split('(')[0].trim()} [${value.toFixed(decimal)} ppm], ` : '';
    return `${layout} NMR (${freqStr}${solvent}ppm) δ = ${str}.`;
  }

  writeMpy({
    layout, shift, isAscend, decimal,
    multiplicity, integration,
  }) {
    if (!FN.isNmrLayout(layout)) return;
    const desc = this.formatMpy({
      multiplicity, integration, shift, isAscend, decimal, layout,
    });
    this.setState({ desc });
  }

  writePeak({
    peaks, layout, shift, isAscend, decimal, isIntensity, integration, waveLength,
  }) {
    const desc = this.formatPks({
      peaks, layout, shift, isAscend, decimal, isIntensity, integration, waveLength,
    });
    this.setState({ desc });
  }

  savePeaks({
    peaks, layout, shift, isAscend, decimal, analysis, isIntensity,
    integration, multiplicity, waveLength,
  }) {
    const entity = this.loadEntity();
    const { features } = entity;
    const { temperature } = entity;
    const { maxY, minY } = Array.isArray(features)
      ? features[0]
      : (features.editPeak || features.autoPeak);
    const boundary = { maxY, minY };
    const body = FN.peaksBody({
      peaks, layout, decimal, shift, isAscend, isIntensity, boundary, waveLength, temperature,
    });
    /*eslint-disable */
    console.log(analysis);
    console.log(integration);
    console.log(multiplicity);
    if (shift.ref.label) {
      const label = this.rmDollarSign(shift.ref.label);
      alert(
        `Peaks: ${body}` + '\n' +
        '- - - - - - - - - - -' + '\n' +
        `Shift solvent = ${label}, ${shift.ref.value}ppm` + '\n'
      );
    } else {
      alert(
        `Peaks: ${body}` + '\n'
      );
    }
    /*eslint-disable */
  }

  predictOp({
    multiplicity, curveSt,
   }) {
    const { curveIdx } = curveSt;
    const { multiplicities } = multiplicity;
    const selectedMultiplicity = multiplicities[curveIdx];
    const { stack, shift } = selectedMultiplicity;
    const targets = stack.map((stk) => {
      const { mpyType, peaks } = stk;
      return FN.CalcMpyCenter(peaks, shift, mpyType);
    })
    // console.log(targets)
    const { molecule, typ } = this.state;
    const predictions = { running: true };

    this.setState({ predictions });
    // simulate fetching...
    const result = typ === 'ir' ? irResult : nmrResult;
    setTimeout(() => {
      this.setState({ predictions: result });
    }, 2000);
  }

  updatInput(e) {
    const molecule = e.target.value;
    this.setState({ molecule });
  }

  render() {
    const {
      desc, predictions, molecule, typ,
    } = this.state;
    const entity = this.loadEntity();
    const qDescVal = this.loadQuill();
    
    const multiEntities = this.loadMultiEntities();

    let operations = [
      { name: 'write peaks', value: this.writePeak },
      { name: 'save', value: this.savePeaks },
    ].filter(r => r.value);
    if (FN.isNmrLayout(entity.layout)) {
      operations = [
        { name: 'write multiplicity', value: this.writeMpy },
        ...operations,
      ];
    }

    const refreshCb = () => alert('Refresch simulation!');

    const forecast = {
      btnCb: this.predictOp,
      refreshCb,
      inputCb: this.updatInput,
      molecule: molecule,
      predictions,
    }
    
    const molSvg = ['nmr 1h', 'ir', 'cyclic volta'].indexOf(typ) >= 0 ? Phenylalanin.path : '';
    const others = this.loadOthers();

    return (
      <div style={{ width: Math.round(window.innerWidth * 0.96) }}>
        <div style={{ margin: '0 0 15px 55px' }}>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('nmr 1h')}
          >
            NMR 1H
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('nmr 13c')}
          >
            NMR 13C
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('nmr 13c dept')}
          >
            NMR 13C DEPT
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('nmr 19f')}
          >
            NMR 19F
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('nmr 31p')}
          >
            NMR 31P
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('nmr 15n')}
          >
            NMR 15N
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('nmr 29si')}
          >
            NMR 29Si
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('ir')}
          >
            IR
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('raman')}
          >
            RAMAN
          </Button>
          <Button
            id='btn-uv-vis'
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('uv/vis')}
          >
            UV/VIS
          </Button>
          <Button
            id='btn-hplc'
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('hplc uv/vis')}
          >
            HPLC UV/VIS
          </Button>
          <Button
            id='btn-tga'
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('tga')}
          >
            TGA
          </Button>
          <Button
            id='btn-dsc'
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('dsc')}
          >
            DSC
          </Button>
          <Button
            id='btn-xrd'
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('xrd')}
          >
            XRD
          </Button>
          <Button
            id='btn-cv'
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('cyclic volta')}
          >
            CV
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('cds')}
          >
            CDS
          </Button>
          <Button
            id='btn-sec'
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('sec')}
          >
            SEC
          </Button>
          <Button
            id='btn-sod'
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('aif')}
          >
            SORPTION-DESORPTION
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('emissions')}
          >
            EMISSIONS
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('dls acf')}
          >
            DLS ACF
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('dls intensity')}
          >
            DLS intensity
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('ms')}
          >
            MS
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('multi')}
          >
            Multi NMR
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('multi ir')}
          >
            Multi IR
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('multi hplc')}
          >
            Multi HPLC
          </Button>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('multi xrd')}
          >
            Multi XRD
          </Button>
        </div>
        <SpectraEditor
          entity={entity}
          multiEntities={multiEntities}
          others={others}
          editorOnly={false}
          canChangeDescription={true}
          onDescriptionChanged={this.onDescriptionChanged}
          molSvg={molSvg}
          theoryMass={'123.0'}
          userManualLink={{cv: "https://www.chemotion.net/chemotionsaurus/docs/eln/chemspectra/cvanalysis"}}
          forecast={forecast}
          operations={operations}
        />
        <div>
          <span>Description Changed</span>
          <ReactQuill
            className={'card-sv-quill'}
            value={this.state.descChanged}
            modules={{ toolbar: false }}
            readOnly
          />
        </div>
        <Grid container>
          <Grid item xs={10}>
            <InputBase
              style={{ margin: '0 0 0 63px' }}
              placeholder="Description"
              multiline
              fullWidth
              rows="2"
              margin="dense"
              value={desc}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

// - - - DOM - - -
ReactDOM.render(
  <DemoWriteIr />,
  document.getElementById('root'),
);
