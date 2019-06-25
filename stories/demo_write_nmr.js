import React from 'react';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { SpectraViewer, FN } from '../src/index';
import C13_CPD from './source/C13_CPD';
import resultNmr from './source/result_nmr';
import './style/svg.css';

const entity = FN.ExtractJcamp(C13_CPD);

class DemoWriteNmr extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      desc: '',
      predictions: false,
      molecule: '',
    };

    this.writePeaks = this.writePeaks.bind(this);
    this.savePeaks = this.savePeaks.bind(this);
    this.predictOp = this.predictOp.bind(this);
    this.updatInput = this.updatInput.bind(this);
  }

  rmDollarSign(target) {
    return target.replace(/\$/g, '');
  }

  writePeaks({
    peaks, layout, shift, isAscend, decimal,
  }) {
    const body = FN.peaksBody(peaks, layout, decimal, shift, isAscend);
    const wrapper = FN.peaksWrapper(layout, shift);
    const desc = this.rmDollarSign(wrapper.head) + body + wrapper.tail;
    this.setState({ desc });
  }

  savePeaks({
    peaks, layout, shift, isAscend, decimal, analysis,
  }) {
    const body = FN.peaksBody(peaks, layout, decimal, shift, isAscend);
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
        `Peaks: ${body}`
      );
    }
    console.log(analysis);
    /*eslint-disable */
  }

  predictOp(peaks, layout, _) {
    const { molecule } = this.state;
    const predictions = { running: true };

    this.setState({ predictions });
    // simulate fetching...
    setTimeout(() => {
      this.setState({ predictions: resultNmr });
    }, 2000);
  }

  updatInput(e) {
    const molecule = e.target.value;
    this.setState({ molecule });
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

    return (
      <div style={{ width: '1200px' }}>
        <SpectraViewer
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

export default DemoWriteNmr;
