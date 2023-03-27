import MountBrush from "../../../helpers/brush";
import * as d3 from 'd3';

describe('Test MountBrush', () => {
  //TODO: add more test
  type Focus = { root: any, svg: any, brush: any, brushX: any, w: number, h: number}

  let focus: Focus

  beforeEach(() => {
    const svg = d3.select('.d3Svg');
    svg.append('g').attr('class', 'brush')
    focus = { root: null, svg: svg, brush: null, brushX: null, w: 0, h: 0 }
  });

  describe('Mount with is not add integratin', () => {
    it('Mount with brush is ui', () => {
      MountBrush(focus, false, false)
      expect(focus.svg).not.toBeNull()
    })
  })
})
