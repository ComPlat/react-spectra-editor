import React from 'react';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { SpectraViewer, FN } from '../src/index';
import IREdit from './source/IR_edit';
import resultIr from './source/result_ir';

const entity = FN.ExtractJcamp(IREdit);

class DemoWriteIr extends React.Component {
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

  writePeaks({
    peaks, layout, shift, isAscend,
  }) {
    const body = FN.peaksBody(peaks, layout, shift, isAscend);
    const wrapper = FN.peaksWrapper(layout, shift);
    const desc = this.rmDollarSign(wrapper.head) + body + wrapper.tail;
    this.setState({ desc });
  }

  savePeaks({
    peaks, layout, shift, isAscend, analysis,
  }) {
    const body = FN.peaksBody(peaks, layout, shift, isAscend);
    /*eslint-disable */
    if (shift.ref.label) {
      const label = this.rmDollarSign(shift.ref.label);
      alert(
        `Peaks: ${body}` + '\n' +
        '- - - - - - - - - - -' + '\n' +
        `Analysis: ${Object.keys(analysis)}` + '\n' +
        '- - - - - - - - - - -' + '\n' +
        `Shift solvent = ${label}, ${shift.ref.value}ppm` + '\n'
      );
    } else {
      alert(
        `Peaks: ${body}` + '\n' +
        '- - - - - - - - - - -' + '\n' +
        `Analysis: ${Object.keys(analysis)}` + '\n'
      );
    }
    /*eslint-disable */
  }

  predict(peaks, layout, _) {
    const { molecule } = this.state;

    this.setState({ predictions: false });
    // simulate fetching...
    setTimeout(() => {
      this.setState({ predictions: resultIr });
    }, 1000);
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

export default DemoWriteIr;
