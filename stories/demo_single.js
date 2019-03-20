import React from 'react';

import { SpectraViewer, FN } from '../src/index';
import C13_CPD from './source/C13_CPD';

const entity = FN.ExtractJcamp(C13_CPD);

const DemoSingle = () => {
  const xLabel = `X (${entity.spectrum.xUnit})`;
  const yLabel = `Y (${entity.spectrum.yUnit})`;

  return (
    <div style={{ width: '1200px' }}>
      <SpectraViewer
        entity={entity}
        xLabel={xLabel}
        yLabel={yLabel}
      />
    </div>
  );
};

export default DemoSingle;
