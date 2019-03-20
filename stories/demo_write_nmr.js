import React from 'react';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { SpectraViewer, FN } from '../src/index';
import C13_CPD from './source/C13_CPD';
import resultNmr from './source/result_nmr';

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
    this.predict = this.predict.bind(this);
    this.updatInput = this.updatInput.bind(this);
  }

  rmDollarSign(target) {
    return target.replace(/\$/g, '');
  }

  writePeaks(peaks, layout, shift, isAscend) {
    const body = FN.peaksBody(peaks, layout, shift, isAscend);
    const wrapper = FN.peaksWrapper(layout, shift);
    const desc = this.rmDollarSign(wrapper.head) + body + wrapper.tail;
    this.setState({ desc });
  }

  savePeaks(peaks, layout, shift, isAscend) {
    const body = FN.peaksBody(peaks, layout, shift, isAscend);
    /*eslint-disable */
    if (shift.ref.label) {
      const label = this.rmDollarSign(shift.ref.label);
      alert(
        `Peaks are: ${body}` + '\n' +
        '- - - - - - - - - - -' + '\n' +
        `Shift solvent = ${label}, ${shift.ref.value}ppm` + '\n'
      );
    } else {
      alert(`Peaks are: ${body}`);
    }
    /*eslint-disable */
  }

  predict(peaks, layout, _) {
    const { molecule } = this.state;

    this.setState({ predictions: false });
    // simulate fetching...
    setTimeout(() => {
      this.setState({ predictions: resultNmr });
    }, 1000);
  }

  updatInput(e) {
    const molecule = e.target.value;
    this.setState({ molecule });
  }

  render() {
    const { desc, predictions, molecule } = this.state;

    const xLabel = `X (${entity.spectrum.xUnit})`;
    const yLabel = `Y (${entity.spectrum.yUnit})`;

    const operations = [
      { name: 'save peaks', value: this.savePeaks },
      { name: 'write peaks', value: this.writePeaks },
    ].filter(r => r.value);

    const predictObj = {
      btnCb: this.predict,
      inputCb: this.updatInput,
      molecule: molecule,
      predictions,
    }

    return (
      <div style={{ width: '1200px' }}>
        <SpectraViewer
          entity={entity}
          xLabel={xLabel}
          yLabel={yLabel}
          predictObj={predictObj}
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
