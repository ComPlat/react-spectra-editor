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

  writePeaks(peaks, layout, shift, isAscend) {
    const body = FN.peaksBody(peaks, layout, shift, isAscend);
    const wrapper = FN.peaksWrapper(layout, shift);
    const desc = wrapper.head + body + wrapper.tail;
    this.setState({ desc });
  }

  savePeaks(peaks, layout, shift, isAscend) {
    const body = FN.peaksBody(peaks, layout, shift, isAscend);
    /*eslint-disable */
    if (shift.ref.name !== '- - -') {
      alert(
        `Peaks are: ${body}` + '\n' +
        '- - - - - - - - - - -' + '\n' +
        `Shift solvent = ${shift.ref.name}, ${shift.ref.value}ppm` + '\n'
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
    return (
      <div style={{ width: '1200px' }}>
        <SpectraViewer
          input={input}
          xLabel={xLabel}
          yLabel={yLabel}
          peakObjs={peakObjs}
          writePeaks={this.writePeaks}
          savePeaks={this.savePeaks}
        />
        <Grid container>
          <Grid item xs={6}>
            <TextField
              label="Description"
              multiline
              fullWidth
              rows="4"
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
