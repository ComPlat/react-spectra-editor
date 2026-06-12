import {
  clickUiTarget,
  scrollUiWheel,
  selectUiSweep,
  setUiSweepType,
  setUiViewerType,
} from "../../../actions/ui";
import { UI } from "../../../constants/action_type";
import { LIST_UI_SWEEP_TYPE } from "../../../constants/list_ui";

jest.mock('../../../helpers/integration_draft.js', () => ({
  confirmCancelPendingIntegration: jest.fn(),
}));

import { confirmCancelPendingIntegration } from '../../../helpers/integration_draft.js';

describe('Test redux action for ui', () => {
  const payloadToBeSent = 'Just a randomly payload'
  const mockedConfirm = confirmCancelPendingIntegration as jest.Mock;

  beforeEach(() => {
    mockedConfirm.mockReset();
    mockedConfirm.mockReturnValue(true);
  });

  it('Set type of ui viewer', () => {
    const { type, payload } = setUiViewerType(payloadToBeSent)
    expect(type).toEqual(UI.VIEWER.SET_TYPE)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('Set sweep type of ui viewer', () => {
    const { type, payload } = setUiSweepType(payloadToBeSent)
    expect(type).toEqual(UI.SWEEP.SET_TYPE)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('select sweep of ui viewer', () => {
    const { type, payload } = selectUiSweep(payloadToBeSent)
    expect(type).toEqual(UI.SWEEP.SELECT)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('scroll ui view', () => {
    const { type, payload } = scrollUiWheel(payloadToBeSent)
    expect(type).toEqual(UI.WHEEL.SCROLL)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('click on ui target', () => {
    const { type, payload } = clickUiTarget(payloadToBeSent)
    expect(type).toEqual(UI.CLICK_TARGET)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('blocks sweep type change while integration draft is active', () => {
    mockedConfirm.mockReturnValue(false);
    const action = setUiSweepType(LIST_UI_SWEEP_TYPE.ZOOM, 2);
    expect(action.type).toEqual(UI.SWEEP.SET_TYPE);
    expect(action.payload).toEqual(LIST_UI_SWEEP_TYPE.INTEGRATION_ADD);
    expect(action.jcampIdx).toEqual(2);
  });
})
