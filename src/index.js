import React from 'react';
import ReactDOM from 'react-dom';

import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { SpectraEditor, FN } from './app';
import nmr1HJcamp from './__tests__/fixtures/nmr1h_jcamp';
import nmr13CJcamp from './__tests__/fixtures/nmr13c_jcamp';
import nmr19FJcamp from './__tests__/fixtures/nmr19f_jcamp';
import irJcamp from './__tests__/fixtures/ir_jcamp';
import ramanJcamp from './__tests__/fixtures/raman_jcamp';
import msJcamp from './__tests__/fixtures/ms_jcamp';
import nmrResult from './__tests__/fixtures/nmr_result';
import irResult from './__tests__/fixtures/ir_result';
import './__tests__/style/svg.css';

const nmr1HEntity = FN.ExtractJcamp(nmr1HJcamp);
const nmr13CEntity = FN.ExtractJcamp(nmr13CJcamp);
const nmr19FEntity = FN.ExtractJcamp(nmr19FJcamp);
const irEntity = FN.ExtractJcamp(irJcamp);
const ramanEntity = FN.ExtractJcamp(ramanJcamp);
const msEntity = FN.ExtractJcamp(msJcamp);

class DemoWriteIr extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      typ: 'nmr 1h',
      desc: '',
      predictions: false,
      molecule: '',
    };

    this.onClick = this.onClick.bind(this);
    this.write = this.write.bind(this);
    this.formatPks = this.formatPks.bind(this);
    this.formatMpy = this.formatMpy.bind(this);
    this.savePeaks = this.savePeaks.bind(this);
    this.predictOp = this.predictOp.bind(this);
    this.updatInput = this.updatInput.bind(this);
    this.loadEntity = this.loadEntity.bind(this);
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

  rmDollarSign(target) {
    return target.replace(/\$/g, '');
  }

  formatPks({
    peaks, layout, shift, isAscend, decimal, isIntensity,
  }) {
    const entity = this.loadEntity();
    const { features } = entity;
    const { maxY, minY } = Array.isArray(features)
      ? features[0]
      : (features.editPeak || features.autoPeak);
    const boundary = { maxY, minY };
    const body = FN.peaksBody({
      peaks, layout, decimal, shift, isAscend, isIntensity, boundary,
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
      const it = is.filter(i => i.xL === xL && i.xU === xU)[0] || { area: 0 };
      const area = it.area * refFactor / refArea;
      const center = FN.calcMpyCenter(peaks, shiftVal, mpyType);
      return Object.assign({}, m, { area, center });
    }).sort((a, b) => (isAscend ? a.center - b.center : b.center - a.center));
    const str = macs.map((m) => {
      const c = m.center.toFixed(1);
      const type = m.mpyType;
      const it = Math.round(m.area);
      const js = m.js.map(j => `J = ${j.toFixed(decimal)} Hz`).join(', ');
      const atomCount = layout === '1H' ? `, ${it}H` : '';
      return m.js.length === 0
        ? `${c} (${type}${atomCount})`
        : `${c} (${type}, ${js}${atomCount})`;
    }).join(', ');
    const { label, value, name } = shift.ref;
    const solvent = label ? `${name}, ` : '';
    return `${layout} (${freqStr}${solvent}${value} ppm) δ = ${str}.`;
  }

  write({
    peaks, layout, shift, isAscend, decimal, isIntensity,
    multiplicity, integration,
  }) {
    let desc = '';
    if (['1H', '13C', '19F'].indexOf(layout) >= 0) {
      desc = this.formatMpy({
        multiplicity, integration, shift, isAscend, decimal, layout,
      });
    } else {
      desc = this.formatPks({
        peaks, layout, shift, isAscend, decimal, isIntensity,
      });
    }
    this.setState({ desc });
  }

  savePeaks({
    peaks, layout, shift, isAscend, decimal, analysis, isIntensity,
    integration, multiplicity,
  }) {
    const entity = this.loadEntity();
    const { features } = entity;
    const { maxY, minY } = Array.isArray(features)
      ? features[0]
      : (features.editPeak || features.autoPeak);
    const boundary = { maxY, minY };
    const body = FN.peaksBody({
      peaks, layout, decimal, shift, isAscend, isIntensity, boundary,
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

  predictOp(peaks, layout, _) {
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

  loadEntity() {
    const { typ } = this.state;
    switch (typ) {
      case 'nmr 1h':
        return nmr1HEntity;
      case 'nmr 13c':
        return nmr13CEntity;
      case 'nmr 19f':
        return nmr19FEntity;
      case 'ir':
        return irEntity;
      case 'raman':
        return ramanEntity;
      case 'ms':
      default:
        return msEntity;
    }
  }

  render() {
    const { desc, predictions, molecule } = this.state;

    const operations = [
      { name: 'save', value: this.savePeaks },
      { name: 'write', value: this.write },
      { name: 'predict', value: this.predictOp },
    ].filter(r => r.value);

    const forecast = {
      btnCb: this.predictOp,
      inputCb: this.updatInput,
      molecule: molecule,
      predictions,
    }

    const entity = this.loadEntity();

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
            onClick={this.onClick('nmr 19f')}
          >
            NMR 19F
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
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('ms')}
          >
            MS
          </Button>
        </div>
        <SpectraEditor
          entity={entity}
          forecast={forecast}
          operations={operations}
          style={{ fontFamily: 'Helvetica' }}
        />
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
