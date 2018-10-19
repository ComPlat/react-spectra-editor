import React from 'react';
import { storiesOf } from '@storybook/react';
import Select from 'react-select';

import { SpectraViewer, ExtractJcamp } from '../src/index';
import oneH from './source/1H';
import IR from './source/IR';
import TTC from './source/13C';
import NTF from './source/NTF';

const files = [
  ExtractJcamp(oneH),
  ExtractJcamp(IR),
  ExtractJcamp(TTC),
  // ExtractJcamp(NTF),
];

const options = files.map(f => (
  {
    value: f.spectrum,
    label: f.spectrum.typ,
    peakObjs: f.peakObjs,
  }
));

class Demo extends React.Component {
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
    const cLabel = value.typ;
    const xLabel = `X (${value.xUnit})`;
    const yLabel = `Y (${value.yUnit})`;
    const peakObj = peakObjs && peakObjs[0] ? peakObjs[0] : {};

    return (
      <div style={{ width: '1200px' }}>
        <Select
          value={selectedOption}
          onChange={this.onChange}
          options={options}
        />
        <SpectraViewer
          input={input}
          cLabel={cLabel}
          xLabel={xLabel}
          yLabel={yLabel}
          peakObj={peakObj}
        />
      </div>
    );
  }
}

storiesOf('SpectraViewer', module)
  .add('show content', () => (
    <Demo />
  ));
