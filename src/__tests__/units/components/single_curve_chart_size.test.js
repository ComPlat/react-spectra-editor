/* eslint-disable max-classes-per-file */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';

import { store } from '../../../app';
import { ExtractJcamp } from '../../../helpers/chem';
import { extractParams } from '../../../helpers/extractParams';
import nmr1hJcamp from '../../fixtures/nmr1h_jcamp';
import msJcamp from '../../fixtures/ms_jcamp';
import ViewerLine from '../../../components/d3_line/index';
import ViewerRect from '../../../components/d3_rect/index';

// Only the sizing is under test: the drawing itself is stubbed out, and drawMain's
// viewBox is what the chart is laid out at.
// Plain classes, not jest.fn(): CRA's `resetMocks` would strip a mock implementation.
jest.mock('../../../components/d3_line/line_focus', () => (
  class LineFocusStub {
    create() {} // eslint-disable-line class-methods-use-this

    update() {} // eslint-disable-line class-methods-use-this
  }
));
jest.mock('../../../components/d3_rect/rect_focus', () => (
  class RectFocusStub {
    create() {} // eslint-disable-line class-methods-use-this

    update() {} // eslint-disable-line class-methods-use-this
  }
));

// jsdom has no layout, so give the chart container a box. `bounded` models a host that
// fixes the container's height (the ELN pane): it keeps that height while empty.
// Otherwise the height is the chart's own - the svg's plus a 4px inline baseline gap, as
// measured in Chrome - and the container collapses to 0 while empty.
const stubLayout = (rootClass, { width, bounded }) => {
  const isChartRoot = (el) => el.classList && el.classList.contains(rootClass);
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

// A single curve used to draw at a viewBox fixed from the window size. Stretched to the
// pane by the host with `xMinYMin meet`, it was fitted to the pane's height and left the
// rest of its width blank, next to the panel - where the multi-curve chart filled it.
describe.each([
  ['<ViewerLine />', ViewerLine, 'd3Line', nmr1hJcamp],
  ['<ViewerRect />', ViewerRect, 'd3Rect', msJcamp],
])('%s chart size', (_name, Viewer, rootClass, jcamp) => {
  const entity = ExtractJcamp(jcamp);
  const { threshold, scan } = store.getState();
  const { topic, feature } = extractParams(entity, threshold, scan);
  const viewBox = (container) => container.querySelector(`.${rootClass} svg`).getAttribute('viewBox');

  const renderViewer = (cLabel = '') => (
    <Provider store={store}>
      <Viewer
        topic={topic}
        feature={feature}
        cLabel={cLabel}
        xLabel="x"
        yLabel="y"
        isHidden={false}
      />
    </Provider>
  );

  afterEach(() => jest.restoreAllMocks());

  it('draws at the size of a bounded host', () => {
    stubLayout(rootClass, { width: 1000, bounded: 500 });
    const { container } = render(renderViewer());
    expect(viewBox(container)).toEqual('0 0 1000 500');
  });

  it('does not feed an unbounded container height back into the chart', () => {
    stubLayout(rootClass, { width: 1000, bounded: 0 });
    const { container, rerender } = render(renderViewer());
    const first = viewBox(container);
    const [, , w, h] = first.split(' ').map(Number);
    expect(w).toEqual(1000);
    expect(h).toBeGreaterThan(0);

    // A re-render runs the resize check against the now-drawn container.
    rerender(renderViewer('again'));
    expect(viewBox(container)).toEqual(first);
  });
});
