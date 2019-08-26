import React from 'react';

import { SpectraEditor, FN } from '../src/app';
import MS from './source/MS';

const entity = FN.ExtractJcamp(MS);

const DemoSingleMs = () => (
  <div style={{ width: '1200px' }}>
    <SpectraEditor
      entity={entity}
    />
  </div>
);

export default DemoSingleMs;
