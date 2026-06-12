import { LIST_LAYOUT } from '../../../constants/list_layout';

const mockGetIntegrationSplitTargetFromEvent = jest.fn(() => ({
  splitX: 5,
  target: { xL: 0, xU: 10, area: 5, absoluteArea: 5 },
}));

jest.mock('../../../helpers/integration_split', () => ({
  ...jest.requireActual('../../../helpers/integration_split'),
  getIntegrationSplitTargetFromEvent: (...args: unknown[]) => (
    mockGetIntegrationSplitTargetFromEvent(...args)
  ),
  clearIntegrationSplitPreview: jest.fn(),
  getVisualSplitLineAtX: jest.fn(() => null),
  isAlreadyVisuallySplit: jest.fn(() => false),
}));

// eslint-disable-next-line import/first
import { ClickCompass } from '../../../helpers/compass';

const makeEvent = () => ({
  stopPropagation: jest.fn(),
  preventDefault: jest.fn(),
});

const makeD3Chain = () => {
  const chain: any = {};
  ['attr', 'style', 'on', 'text', 'merge', 'append', 'selectAll', 'data', 'remove', 'call', 'enter'].forEach((method) => {
    chain[method] = jest.fn(() => chain);
  });
  chain.nodes = () => [];
  return chain;
};

const makeFocus = (overrides = {}) => {
  const previewChain = makeD3Chain();
  const lineChain = makeD3Chain();
  previewChain.selectAll = jest.fn(() => ({
    data: jest.fn(() => lineChain),
  }));

  const rootChain = makeD3Chain();
  rootChain.select = jest.fn((selector: string) => (
    selector === '.integration-preview' ? previewChain : rootChain
  ));
  rootChain.node = () => document.createElement('g');

  return {
    layout: LIST_LAYOUT.HPLC_UVVIS,
    isUiAddIntgSt: false,
    isUiSplitIntgSt: false,
    isUiVisualSplitIntgSt: false,
    jcampIdx: 0,
    data: [
      { x: 0, y: 0, k: 0 },
      { x: 5, y: 1, k: 1 },
      { x: 10, y: 0, k: 0 },
    ],
    h: 300,
    w: 400,
    root: rootChain,
    scales: {
      x: Object.assign((v: number) => v * 10, { invert: (v: number) => v / 10 }),
      y: Object.assign((v: number) => v * 10, { invert: (v: number) => v / 10 }),
    },
    integrationSplitTargets: {
      stack: [{ xL: 0, xU: 10, area: 5, absoluteArea: 5 }],
      shift: 0,
      ignoreRef: true,
    },
    selectUiSweepAct: jest.fn(),
    splitIntegrationAct: jest.fn(),
    addVisualSplitLineAct: jest.fn(),
    removeVisualSplitLineAct: jest.fn(),
    clickUiTargetAct: jest.fn(),
    firstIntegrationPoint: null,
    ...overrides,
  };
};

describe('ClickCompass', () => {
  beforeEach(() => {
    mockGetIntegrationSplitTargetFromEvent.mockClear();
    mockGetIntegrationSplitTargetFromEvent.mockReturnValue({
      splitX: 5,
      target: { xL: 0, xU: 10, area: 5, absoluteArea: 5 },
    });
  });

  it('uses two-click add for HPLC integration add', () => {
    const focus = makeFocus({ isUiAddIntgSt: true });
    const event = makeEvent();

    ClickCompass(event, focus);
    expect(focus.firstIntegrationPoint).toMatchObject({ jcampIdx: 0, dataLength: 3 });
    expect(focus.selectUiSweepAct).not.toHaveBeenCalled();
  });

  it('confirms two-click integration on second distinct click', () => {
    const focus = makeFocus({
      isUiAddIntgSt: true,
      firstIntegrationPoint: { x: 0, y: 0, jcampIdx: 0, dataLength: 3 },
    });

    ClickCompass(makeEvent(), focus);
    expect(focus.selectUiSweepAct).toHaveBeenCalled();
  });

  it('does not start two-click add on NMR integration add', () => {
    const focus = makeFocus({
      layout: LIST_LAYOUT.H1,
      isUiAddIntgSt: true,
    });
    const event = makeEvent();

    ClickCompass(event, focus);
    expect(focus.firstIntegrationPoint).toBeNull();
  });

  it('dispatches split integration on HPLC split mode', () => {
    const focus = makeFocus({ isUiSplitIntgSt: true });
    const event = makeEvent();

    ClickCompass(event, focus);
    expect(focus.splitIntegrationAct).toHaveBeenCalledWith(expect.objectContaining({
      curveIdx: 0,
      splitX: 5,
      target: expect.objectContaining({ xL: 0, xU: 10 }),
    }));
  });

  it('dispatches visual split add on HPLC visual split mode', () => {
    const focus = makeFocus({ isUiVisualSplitIntgSt: true });
    const event = makeEvent();

    ClickCompass(event, focus);
    expect(focus.addVisualSplitLineAct).toHaveBeenCalled();
  });
});
