import React from 'react';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import {
  SpectraViewer, ExtractJcamp, ToXY, LIST_LAYOUT,
} from '../src/index';
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

  fixDigit(input, precision) {
    const output = input || 0.0;
    return output.toFixed(precision);
  }

  peaksXYToStr(peaksXY) {
    const digit = 1;
    const result = peaksXY.map((p) => {
      const valX = this.fixDigit(parseFloat(p[0]), digit);
      return valX;
    });
    return result.join(', ');
  }

  extractLayout(layout) {
    switch (layout) {
      case LIST_LAYOUT.IR:
        return 'IR = ';
      case LIST_LAYOUT.H1:
        return '1 H = ';
      case LIST_LAYOUT.C13:
        return '13 C = ';
      case LIST_LAYOUT.PLAIN:
      default:
        return '';
    }
  }

  writePeaks(peaks, layout) {
    const peaksXY = ToXY(peaks);
    const descPeaks = this.peaksXYToStr(peaksXY);
    const descLayout = this.extractLayout(layout);
    const desc = descLayout + descPeaks;
    this.setState({ desc });
  }

  savePeaks(peaks, shift) {
    const peaksXY = ToXY(peaks);
    const desc = this.peaksXYToStr(peaksXY);
    /*eslint-disable */
    if (shift.ref.name !== '- - -' && shift.peak.x) {
      alert(
        `Peaks are: ${desc}` + '\n' +
        '- - - - - - - - - - -' + '\n' +
        `Shift solvent = ${shift.ref.name} (${shift.ref.value}ppm)` + '\n' +
        `Selected peak = ${shift.peak.x}`
      );
    } else {
      alert(`Peaks are: ${desc}`);
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
