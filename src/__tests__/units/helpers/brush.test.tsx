import MountBrush from '../../../helpers/brush';
import Cfg from '../../../helpers/cfg';
import { LIST_LAYOUT } from '../../../constants/list_layout';
import {
  clearPendingIntegrationDraft,
  setPendingIntegrationDraft,
} from '../../../helpers/integration_draft';

const d3 = require('d3');

jest.mock('../../../helpers/integration_draft', () => ({
  clearPendingIntegrationDraft: jest.fn(),
  setPendingIntegrationDraft: jest.fn(),
  forgetPendingIntegrationDraft: jest.fn(),
  confirmCancelPendingIntegration: jest.fn(() => true),
  hasPendingIntegrationDraft: jest.fn(() => false),
  isDraftForCurve: jest.fn(() => false),
}));

describe('MountBrush', () => {
  type Focus = {
    root: any;
    svg: any;
    brush: any;
    brushX: any;
    w: number;
    h: number;
    layout: string;
    data: Array<{ x: number; y: number }>;
    jcampIdx: number;
    selectUiSweepAct: jest.Mock;
    scrollUiWheelAct: jest.Mock;
    firstIntegrationPoint: any;
  };

  let focus: Focus;

  beforeEach(() => {
    document.body.innerHTML = '<svg class="d3Svg"></svg>';
    const svg = d3.select('.d3Svg');
    focus = {
      root: svg.append('g').attr('class', 'root'),
      svg,
      brush: d3.brush(),
      brushX: d3.brushX(),
      w: 400,
      h: 300,
      layout: LIST_LAYOUT.H1,
      data: [{ x: 0, y: 0 }, { x: 10, y: 1 }],
      jcampIdx: 0,
      selectUiSweepAct: jest.fn(),
      scrollUiWheelAct: jest.fn(),
      firstIntegrationPoint: null,
    };
    jest.clearAllMocks();
  });

  it('mounts brushX for NMR integration add', () => {
    focus.layout = LIST_LAYOUT.H1;
    MountBrush(focus, true, true);

    expect(focus.root.select('.brushX').empty()).toBe(false);
    expect(focus.root.select('.brush').empty()).toBe(true);
  });

  it('does not mount brushX for HPLC two-click integration add', () => {
    focus.layout = LIST_LAYOUT.HPLC_UVVIS;
    MountBrush(focus, true, true);

    expect(focus.root.select('.brushX').empty()).toBe(true);
    expect(Cfg.showIntegSplitTools(focus.layout)).toBe(true);
  });

  it('clears stale integration draft when curve changes', () => {
    focus.firstIntegrationPoint = { jcampIdx: 0, dataLength: 2 };
    focus.jcampIdx = 1;
    MountBrush(focus, true, true);

    expect(clearPendingIntegrationDraft).toHaveBeenCalled();
    expect(focus.firstIntegrationPoint).toBeNull();
  });

  it('keeps draft when jcampIdx matches', () => {
    focus.firstIntegrationPoint = { jcampIdx: 0, dataLength: 2 };
    setPendingIntegrationDraft({ jcampIdx: 0, dataLength: 2, cancel: jest.fn() });
    MountBrush(focus, true, true);

    expect(focus.firstIntegrationPoint).toEqual({ jcampIdx: 0, dataLength: 2 });
  });
});
