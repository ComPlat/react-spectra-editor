import React from 'react';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { SpectraViewer, ExtractJcamp, ToXY } from '../src/index';
import C13_CPD from './source/C13_CPD';

const file = ExtractJcamp(C13_CPD);

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

  peaksXYToStr(peaksXY) {
    const result = peaksXY.map((p) => {
      const valX = Math.round(parseFloat(p[0]) * 10) / 10;
      const valY = (Math.round(parseFloat(p[1]) * 10) / 10).toExponential(1);
      return `${valX}, ${valY};`;
    });
    return result;
  }

  writePeaks(peaks) {
    const peaksXY = ToXY(peaks);
    const desc = this.peaksXYToStr(peaksXY);
    this.setState({ desc });
  }

  savePeaks(peaks) {
    const peaksXY = ToXY(peaks);
    const desc = this.peaksXYToStr(peaksXY);
    alert(`Peaks are: ${desc}`); // eslint-disable-line
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
