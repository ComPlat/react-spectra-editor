import React from 'react';

import { SpectraViewer, FN } from '../src/index';
import MS from './source/MS';

const entity = FN.ExtractJcamp(MS);

const DemoSingleMs = () => {
  const xLabel = 'X (m/z)';
  const yLabel = 'Y (Relative Abundance)';

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

export default DemoSingleMs;
