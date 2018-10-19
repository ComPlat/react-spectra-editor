import React from 'react';
import { storiesOf } from '@storybook/react';

import DemoSelect from './demo_select';
import DemoSingle from './demo_single';

storiesOf('SpectraViewer', module)
  .add('single spectrum', () => (
    <DemoSingle />
  ))
  .add('spectra with selection', () => (
    <DemoSelect />
  ));
