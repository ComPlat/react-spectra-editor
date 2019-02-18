import React from 'react';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { SpectraViewer, FN } from '../src/index';
import C13_CPD from './source/C13_CPD';

const file = FN.ExtractJcamp(C13_CPD);

const noDataAvailable = () => (
  <div>
    No data available!
  </div>
);

class DemoWritePeaks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      desc: '',
    };

    this.writePeaks = this.writePeaks.bind(this);
    this.savePeaks = this.savePeaks.bind(this);
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

  render() {
    const { desc } = this.state;

    const { spectrum, peakObjs } = file;
    if (!spectrum) return noDataAvailable();

    const input = spectrum.data[0];
    const xLabel = `X (${spectrum.xUnit})`;
    const yLabel = `Y (${spectrum.yUnit})`;

    const operations = [
      { name: 'save peaks', value: this.savePeaks },
      { name: 'write peaks', value: this.writePeaks },
    ].filter(r => r.value);

    return (
      <div style={{ width: '1200px' }}>
        <SpectraViewer
          input={input}
          xLabel={xLabel}
          yLabel={yLabel}
          peakObjs={peakObjs}
          operations={operations}
        />
        <Grid container>
          <Grid item xs={6}>
            <TextField
              label="Description"
              multiline
              fullWidth
              rows="2"
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

export default DemoWritePeaks;
