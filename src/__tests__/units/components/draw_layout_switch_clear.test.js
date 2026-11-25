import * as d3 from 'd3';
import LineFocus from '../../../components/d3_line/line_focus';
import MultiFocus from '../../../components/d3_multi/multi_focus';
import { LIST_LAYOUT } from '../../../constants/list_layout';

// The editor keeps one chart while the host opens one spectrum after another. What an
// HPLC UV/Vis spectrum draws (peak labels, areas under the curve) must not stay on the
// chart when the next spectrum is NMR, and the reverse.
const TAGS = ['pPath', 'bpTxt', 'igbPath', 'igcPath', 'igtPath', 'aucPath', 'peckerPath'];

const buildFocus = (Focus, extra = {}) => {
  const svg = d3.select(document.body).append('svg');
  const tags = {};
  TAGS.forEach((k) => { tags[k] = svg.append('g').attr('class', k); });
  const focus = Object.create(Focus.prototype);
  return Object.assign(focus, {
    svg,
    tags,
    root: svg,
    h: 300,
    w: 1000,
    layout: LIST_LAYOUT.HPLC_UVVIS,
    data: [{ x: 1, y: 1 }, { x: 5, y: 2 }, { x: 9, y: 1 }],
    dataPks: [{ x: 5, y: 2 }],
    tSfPeaks: [],
    scales: { x: d3.scaleLinear().domain([0, 10]).range([0, 1000]), y: d3.scaleLinear() },
    shouldUpdate: {},
    cyclicvoltaSt: { spectraList: [] },
    jcampIdx: 0,
    tip: { show: () => {}, hide: () => {} },
    onClickTarget: () => {},
    clearSplitPreview: () => {},
    ...extra,
  });
};

const integrationSt = {
  selectedIdx: 0,
  integrations: [{
    stack: [{ xL: 2, xU: 8, area: 1 }], refArea: 1, refFactor: 1, shift: 0,
  }],
};

const count = (focus, sel) => focus.svg.selectAll(sel).size();

describe.each([['LineFocus', LineFocus], ['MultiFocus', MultiFocus]])('%s', (_, Focus) => {
  afterEach(() => { document.body.innerHTML = ''; });

  it('removes the HPLC peak labels when the next spectrum is NMR', () => {
    const focus = buildFocus(Focus);
    focus.drawPeaks(null);
    expect(count(focus, '.bpTxt text')).toEqual(1);

    focus.layout = LIST_LAYOUT.H1;
    focus.drawPeaks(null);
    expect(count(focus, '.bpTxt text')).toEqual(0);
  });

  it('removes the HPLC areas under the curve when the next spectrum is NMR', () => {
    const focus = buildFocus(Focus);
    focus.drawInteg(integrationSt);
    expect(count(focus, '.aucPath path')).toBeGreaterThan(0);

    focus.layout = LIST_LAYOUT.H1;
    focus.drawInteg(integrationSt);
    expect(count(focus, '.aucPath path')).toEqual(0);
  });

  it('removes the NMR integral bars and labels when the next spectrum is HPLC', () => {
    const focus = buildFocus(Focus, { layout: LIST_LAYOUT.H1 });
    focus.drawInteg(integrationSt);
    expect(count(focus, '.igbPath path')).toBeGreaterThan(0);

    focus.layout = LIST_LAYOUT.HPLC_UVVIS;
    focus.drawInteg(integrationSt);
    expect(count(focus, '.igbPath path') + count(focus, '.igcPath path')
      + count(focus, '.igtPath text')).toEqual(0);
  });
});

// Switching the working curve of a multi-spectrum chart redraws its peaks, also when the
// new curve has as many peaks as the previous one and the scales are unchanged.
describe('MultiFocus: switching curves', () => {
  afterEach(() => { document.body.innerHTML = ''; });

  it('moves the peak markers to the new curve\'s peaks', () => {
    const focus = buildFocus(MultiFocus, {
      layout: LIST_LAYOUT.H1, tTrEndPts: [], yTransformFactor: 1,
    });
    const editPeakSt = null;
    focus.drawPeaks(editPeakSt);
    focus.resetShouldUpdate(editPeakSt);
    const before = focus.svg.select('.pPath path').attr('transform');

    // The update flow: setDataParams for curve 1, then the redraw flags, then drawing.
    focus.jcampIdx = 1;
    focus.dataPks = [{ x: 3, y: 2 }];
    focus.getShouldUpdate(editPeakSt);
    focus.drawPeaks(editPeakSt);
    expect(focus.svg.select('.pPath path').attr('transform')).not.toEqual(before);
  });
});
