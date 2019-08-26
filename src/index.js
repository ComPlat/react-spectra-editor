import React from 'react';
import ReactDOM from 'react-dom';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { SpectraEditor, FN } from './app';
import nmrJcamp from './__tests__/fixtures/nmr_jcamp';
import irJcamp from './__tests__/fixtures/ir_jcamp';
import msJcamp from './__tests__/fixtures/ms_jcamp';
import nmrResult from './__tests__/fixtures/nmr_result';
import irResult from './__tests__/fixtures/ir_result';
import './__tests__/style/svg.css';

const nmrEntity = FN.ExtractJcamp(nmrJcamp);
const irEntity = FN.ExtractJcamp(irJcamp);
const msEntity = FN.ExtractJcamp(msJcamp);

class DemoWriteIr extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      typ: 'ir',
      desc: '',
      predictions: false,
      molecule: '',
    };

    this.onClick = this.onClick.bind(this);
    this.writePeaks = this.writePeaks.bind(this);
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

  writePeaks({
    peaks, layout, shift, isAscend, decimal, isIntensity,
  }) {
    const entity = this.loadEntity();
    const { maxY, minY } = entity.features[0];
    const boundary = { maxY, minY };
    const body = FN.peaksBody({
      peaks, layout, decimal, shift, isAscend, isIntensity, boundary,
    });
    const wrapper = FN.peaksWrapper(layout, shift);
    const desc = this.rmDollarSign(wrapper.head) + body + wrapper.tail;
    this.setState({ desc });
  }

  savePeaks({
    peaks, layout, shift, isAscend, decimal, analysis, isIntensity,
  }) {
    const entity = this.loadEntity();
    const { maxY, minY } = entity.features[0];
    const boundary = { maxY, minY };
    const body = FN.peaksBody({
      peaks, layout, decimal, shift, isAscend, isIntensity, boundary,
    });
    /*eslint-disable */
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
    console.log(analysis);
    /*eslint-disable */
  }

  predictOp(peaks, layout, _) {
    const { molecule, typ } = this.state;
    const predictions = { running: true };

    this.setState({ predictions });
    // simulate fetching...
    const result = typ === 'nmr' ? nmrResult : irResult;
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
      case 'nmr':
        return nmrEntity;
      case 'ir':
        return irEntity;
      case 'ms':
      default:
        return msEntity;
    }
  }

  render() {
    const { desc, predictions, molecule } = this.state;

    const operations = [
      { name: 'save', value: this.savePeaks },
      { name: 'write', value: this.writePeaks },
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
      <div style={{ width: '1200px' }}>
        <div>
          <Button
            variant="contained"
            style={{ margin: '0 10px 0 10px' }}
            onClick={this.onClick('nmr')}
          >
            NMR
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
            onClick={this.onClick('ms')}
          >
            MS
          </Button>
        </div>
        <SpectraEditor
          entity={entity}
          forecast={forecast}
          operations={operations}
        />
        <Grid container>
          <Grid item xs={6}>
            <TextField
              label="Description"
              multiline
              fullWidth
              rows="1"
              margin="normal"
              variant="outlined"
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
