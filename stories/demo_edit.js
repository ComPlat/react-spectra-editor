import React from 'react';

import { SpectraViewer, FN } from '../src/index';
import IREdit from './source/IR_edit';

const entity = FN.ExtractJcamp(IREdit);

const DemoEdit = () => {
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

export default DemoEdit;
