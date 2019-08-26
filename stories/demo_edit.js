import React from 'react';

import { SpectraEditor, FN } from '../src/app';
import IREdit from './source/IR_edit';

const entity = FN.ExtractJcamp(IREdit);

const DemoEdit = () => (
  <div style={{ width: '1200px' }}>
    <SpectraEditor
      entity={entity}
    />
  </div>
);

export default DemoEdit;
