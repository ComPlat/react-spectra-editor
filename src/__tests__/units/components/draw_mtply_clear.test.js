import * as d3 from 'd3';
import LineFocus from '../../../components/d3_line/line_focus';
import MultiFocus from '../../../components/d3_multi/multi_focus';
import { LIST_LAYOUT } from '../../../constants/list_layout';

// Opening a spectrum without multiplets after one with multiplets must not leave the
// previous multiplet bars, peak markers and labels on the chart (#341).
const buildFocus = (Focus, extra = {}) => {
  const svg = d3.select(document.body).append('svg');
  const tags = {};
  ['mpybPath', 'mpyt1Path', 'mpyt2Path', 'mpypPath'].forEach((k) => {
    tags[k] = svg.append('g').attr('class', k);
  });
  const focus = Object.create(Focus.prototype);
  return Object.assign(focus, {
    svg,
    tags,
    h: 300,
    layout: LIST_LAYOUT.H1,
    scales: { x: d3.scaleLinear().domain([10, 0]).range([0, 1000]), y: d3.scaleLinear() },
    shouldUpdate: {},
    onClickTarget: () => {},
    ...extra,
  });
};

const multiplet = (xL, xU) => ({
  xExtent: { xL, xU },
  mpyType: 'd',
  peaks: [{ x: xL + 0.01, y: 1 }, { x: xU - 0.01, y: 1 }],
});
const stack = [multiplet(7.9, 8.0), multiplet(7.1, 7.2)];
const count = (focus) => ['.mpyb', '.mpyp', '.mpyt1', '.mpyt2']
  .reduce((n, sel) => n + focus.svg.selectAll(sel).size(), 0);

describe('drawMtply clears the multiplicity layers when there is nothing to draw', () => {
  afterEach(() => { document.body.innerHTML = ''; });

  it('LineFocus: a stack, then an empty stack', () => {
    const focus = buildFocus(LineFocus);
    focus.drawMtply({ selectedIdx: 0, multiplicities: [{ stack, smExtext: false, shift: 0 }] });
    expect(focus.svg.selectAll('.mpyt1').size()).toEqual(2);

    focus.drawMtply({ selectedIdx: 0, multiplicities: [{ stack: [], smExtext: false, shift: 0 }] });
    expect(count(focus)).toEqual(0);
  });

  it('LineFocus: a stack, then a non-NMR layout (multiplicity disabled)', () => {
    const focus = buildFocus(LineFocus);
    const mtplySt = { selectedIdx: 0, multiplicities: [{ stack, smExtext: false, shift: 0 }] };
    focus.drawMtply(mtplySt);
    focus.layout = LIST_LAYOUT.IR;
    focus.drawMtply(mtplySt);
    expect(count(focus)).toEqual(0);
  });

  it('MultiFocus: a stack, then an empty stack', () => {
    const focus = buildFocus(MultiFocus, { jcampIdx: 0 });
    focus.drawMtply({ multiplicities: [{ stack, smExtext: false, shift: 0 }] });
    expect(focus.svg.selectAll('.mpyt1').size()).toEqual(2);

    focus.drawMtply({ multiplicities: [{ stack: [], smExtext: false, shift: 0 }] });
    expect(count(focus)).toEqual(0);
  });
});
