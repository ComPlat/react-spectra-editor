import React from 'react';
import { storiesOf } from '@storybook/react';
import Select from 'react-select';

import SpectraViewer from '../src/index';
import { Extract, Convert } from './source/chem';
import oneH from './source/1H';
import IR from './source/IR';
import TTC from './source/13C';
import NTF from './source/NTF';

const files = [
  ...Extract(oneH),
  ...Extract(IR),
  ...Extract(TTC),
  ...Extract(NTF),
];

const options = files.map(f => (
  {
    value: f,
    label: f.typ,
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
    const sel = selectedOption;
    const input = Convert(sel.value.data[0]);
    const cLabel = sel.value.typ;
    const xLabel = `X(${sel.value.xUnit})`;
    const yLabel = `Y(${sel.value.yUnit})`;

    return (
      <div>
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
          width={900}
          height={500}
        />
      </div>
    );
  }
}

storiesOf('SpectraViewer', module)
  .add('show content', () => (
    <Demo />
  ));
