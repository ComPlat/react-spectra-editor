import * as d3 from 'd3';
import RectFocus from '../../../components/d3_rect/rect_focus';

// d3_rect/rect_focus.js is the single-entity MS/LC-MS bar-chart implementation
// used by layer_content.js (ViewerRect). It is a separate copy of
// d3_line_rect/rect_focus.js (used by the LC/MS multi-pane viewer), which was
// guarded against an empty threshold-endpoint list for review finding B7
// (#232, commit 5854338). This copy never received that fix: drawBar() read
// tTrEndPts[0].y unconditionally, so mounting a single MS/LC-MS entity whose
// threshold comes out falsy (empty tTrEndPts, e.g. via convertThresEndPts in
// helpers/chem.js) while data is still present crashed componentDidMount with
// "Cannot read properties of undefined (reading 'y')".
//
// Review finding S4 (PR #336): the original B7 guard (`if (!this.tTrEndPts.length)
// return;`) fixed the crash by skipping the rest of drawBar() entirely, but
// tTrEndPts only decides bar *color* (barColor's above/below-threshold fill) -- none
// of the enter/exit/transform positioning depends on it. Returning early meant an
// empty threshold blanked the chart on mount, or left stale (un-removed,
// un-repositioned) bars on a later update, even though this.data was populated. The
// fix falls back to a neutral yRef (-Infinity, so every bar gets the default color)
// and lets the rest of drawBar() run as normal.
describe('RectFocus.drawBar with an empty threshold-endpoint list (B7 / S4, d3_rect copy)', () => {
  const buildFocus = () => {
    const root = document.createElement('div');
    const rf = Object.create(RectFocus.prototype);
    rf.bars = d3.select(root);
    rf.scales = { x: (v) => v, y: (v) => v }; // TfRescale reads focus.scales.{x,y}
    rf.updatePathCall = () => {}; // stub out the d3 path update
    rf.data = [{ x: 1, y: 2 }, { x: 2, y: 3 }]; // bars present
    rf.tTrEndPts = []; // cleared/absent threshold → empty endpoints
    return { root, rf };
  };

  it('does not crash when tTrEndPts is empty but bars exist', () => {
    const { rf } = buildFocus();
    expect(() => rf.drawBar()).not.toThrow();
  });

  it('still draws (not blanks) the bars when tTrEndPts is empty', () => {
    const { root, rf } = buildFocus();
    rf.drawBar();
    const rects = root.querySelectorAll('rect');
    expect(rects.length).toBe(rf.data.length);
    // -Infinity as the neutral reference: every bar counts as "above threshold".
    rects.forEach((rect) => expect(rect.getAttribute('fill')).toBe('steelblue'));
  });

  it('still updates (not leaves stale) the bars on a later call with new data', () => {
    const { root, rf } = buildFocus();
    rf.drawBar();

    rf.data = [{ x: 5, y: 9 }]; // fewer points, different position
    rf.drawBar();

    const rects = root.querySelectorAll('rect');
    expect(rects.length).toBe(1);
    expect(rects[0].getAttribute('transform')).toBe('translate(5, 9)');
  });
});
