import React from 'react';

import { SpectraViewer, ExtractJcamp } from '../src/index';
import IREdit from './source/IR_edit';

const file = ExtractJcamp(IREdit);

const noDataAvailable = () => (
  <div>
    No data available!
  </div>
);

const DemoEdit = () => {
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
      />
    </div>
  );
};

export default DemoEdit;
