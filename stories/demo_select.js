import React from 'react';
import Select from 'react-select';

import { SpectraViewer, FN } from '../src/index';
import H1 from './source/H1';
import IR from './source/IR';
import C13_CPD from './source/C13_CPD';
import C13_DEPT135 from './source/C13_DEPT135';
import C13_SVS from './source/C13_SVS';
import F19 from './source/F19';
import TEST from './source/TEST';

const { ExtractJcamp } = FN;

const files = [
  ExtractJcamp(H1),
  ExtractJcamp(IR),
  ExtractJcamp(C13_CPD),
  ExtractJcamp(C13_DEPT135),
  ExtractJcamp(C13_SVS),
  ExtractJcamp(F19),
  ExtractJcamp(TEST),
];

const options = files.map(f => (
  f.spectrum
    ? {
      value: f.spectrum,
      label: f.spectrum.typ,
      peakObjs: f.peakObjs,
    }
    : null
)).filter(r => r != null);

class DemoSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: options[0],
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(selectedOption) {
    this.setState({ selectedOption });
  }

  render() {
    const { selectedOption } = this.state;
    const { value, peakObjs } = selectedOption;
    const input = value.data[0];
    const xLabel = `X (${value.xUnit})`;
    const yLabel = `Y (${value.yUnit})`;

    return (
      <div style={{ width: '1200px' }}>
        <Select
          value={selectedOption}
          onChange={this.onChange}
          options={options}
        />
        <SpectraViewer
          input={input}
          xLabel={xLabel}
          yLabel={yLabel}
          peakObjs={peakObjs}
        />
      </div>
    );
  }
}

export default DemoSelect;
