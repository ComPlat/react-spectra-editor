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
describe('RectFocus.drawBar with an empty threshold-endpoint list (B7, d3_rect copy)', () => {
  it('does not crash when tTrEndPts is empty but bars exist', () => {
    const rf = Object.create(RectFocus.prototype);
    rf.bars = {}; // truthy → passes MountBars-mounted state
    rf.scales = { x: (v) => v, y: (v) => v }; // TfRescale reads focus.scales.{x,y}
    rf.updatePathCall = () => {}; // stub out the d3 path update
    rf.data = [{ x: 1, y: 2 }]; // bars present
    rf.tTrEndPts = []; // cleared/absent threshold → empty endpoints
    expect(() => rf.drawBar()).not.toThrow();
  });
});
