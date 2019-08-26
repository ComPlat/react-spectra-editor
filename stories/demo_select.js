import React from 'react';
import Select from 'react-select';

import { SpectraEditor, FN } from '../src/app';
import H1 from './source/H1';
import IR from './source/IR';
import C13_CPD from './source/C13_CPD';
import C13_DEPT135 from './source/C13_DEPT135';
import C13_SVS from './source/C13_SVS';
import F19 from './source/F19';
import TEST from './source/TEST';

const { ExtractJcamp } = FN;

const entities = [
  ExtractJcamp(H1),
  ExtractJcamp(IR),
  ExtractJcamp(C13_CPD),
  ExtractJcamp(C13_DEPT135),
  ExtractJcamp(C13_SVS),
  ExtractJcamp(F19),
  ExtractJcamp(TEST),
];

const options = entities.map(f => (
  f.spectrum
    ? {
      value: f,
      label: f.spectrum.typ,
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
    const { value } = selectedOption;

    return (
      <div style={{ width: '1200px' }}>
        <Select
          value={selectedOption}
          onChange={this.onChange}
          options={options}
        />
        <SpectraEditor
          entity={value}
        />
      </div>
    );
  }
}

export default DemoSelect;
