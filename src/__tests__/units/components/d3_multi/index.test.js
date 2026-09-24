import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';

import { store } from '../../../../app';
import { ExtractJcamp } from '../../../../helpers/chem';
import { extractParams } from '../../../../helpers/extractParams';
import nmr13cJcamp from '../../../fixtures/nmr13c_jcamp';
import ViewerMulti from '../../../../components/d3_multi/index';

// Only the sizing is under test: the drawing itself is stubbed out, and drawMain's
// viewBox is what the chart is laid out at.
// A plain class, not jest.fn(): CRA's `resetMocks` would strip a mock implementation.
jest.mock('../../../../components/d3_multi/multi_focus', () => (
  class MultiFocusStub {
    create() {} // eslint-disable-line class-methods-use-this

    update() {} // eslint-disable-line class-methods-use-this
  }
));

// jsdom has no layout, so give the chart container a box. `bounded` models a host that
// fixes the container's height (the ELN pane, the CV column): it keeps that height while
// empty. Otherwise the height is the chart's own - the svg's plus a 4px inline baseline
// gap, as measured in Chrome - and the container collapses to 0 while empty.
const stubLayout = ({ width, bounded }) => {
  const isChartRoot = (el) => el.classList && el.classList.contains('d3Line');
  const svgHeight = (el) => {
    const vb = el.querySelector('svg') && el.querySelector('svg').getAttribute('viewBox');
    if (!vb) return 0;
    const [, , w, h] = vb.split(' ').map(Number);
    return Math.round((width * h) / w) + 4;
  };
  jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function cw() {
    return isChartRoot(this) ? width : 0;
  });
  jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function ch() {
    if (!isChartRoot(this)) return 0;
    return bounded || svgHeight(this);
  });
};

describe('<ViewerMulti /> chart size', () => {
  const entity = ExtractJcamp(nmr13cJcamp);
  const { threshold, scan } = store.getState();
  const { topic, feature } = extractParams(entity, threshold, scan);
  const viewBox = (container) => container.querySelector('.d3Line svg').getAttribute('viewBox');

  const renderViewer = () => render(
    <Provider store={store}>
      <ViewerMulti
        entities={[entity]}
        topic={topic}
        feature={feature}
        xLabel="ppm"
        yLabel="I"
      />
    </Provider>,
  );

  afterEach(() => jest.restoreAllMocks());

  it('draws at the height a bounded host gives it', () => {
    stubLayout({ width: 1000, bounded: 500 });
    const { container } = renderViewer();
    expect(viewBox(container)).toEqual('0 0 1000 500');
  });

  // Measuring an unbounded container's height reads the chart's own height back, and
  // every redraw grew it by the baseline gap - without end, in the browser.
  it('does not feed an unbounded container height back into the chart', () => {
    stubLayout({ width: 1000, bounded: 0 });
    const { container, rerender } = renderViewer();
    const first = viewBox(container);
    const [, , w, h] = first.split(' ').map(Number);
    expect(w).toEqual(1000);
    expect(h).toBeGreaterThan(0);

    // A re-render runs the resize check against the now-drawn container.
    rerender(
      <Provider store={store}>
        <ViewerMulti
          entities={[entity]}
          topic={topic}
          feature={feature}
          xLabel="ppm"
          yLabel="I"
          cLabel="again"
        />
      </Provider>,
    );
    expect(viewBox(container)).toEqual(first);
  });
});
