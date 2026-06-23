import {
  clearPendingIntegrationDraft,
  confirmCancelPendingIntegration,
  forgetPendingIntegrationDraft,
  hasPendingIntegrationDraft,
  setPendingIntegrationDraft,
} from "../../../helpers/integration_draft";

describe('Test helper for pending integration draft', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    forgetPendingIntegrationDraft();
  });

  it('tracks pending draft state', () => {
    expect(hasPendingIntegrationDraft()).toBe(false);

    setPendingIntegrationDraft({});

    expect(hasPendingIntegrationDraft()).toBe(true);
  });

  it('clears a draft and invokes its cancel callback', () => {
    const cancel = jest.fn();
    setPendingIntegrationDraft({ cancel });

    clearPendingIntegrationDraft();

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(hasPendingIntegrationDraft()).toBe(false);
  });

  it('keeps a draft when cancellation is refused', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    setPendingIntegrationDraft({});

    expect(confirmCancelPendingIntegration()).toBe(false);
    expect(hasPendingIntegrationDraft()).toBe(true);
  });

  it('clears a draft when cancellation is accepted', () => {
    const cancel = jest.fn();
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    setPendingIntegrationDraft({ cancel });

    expect(confirmCancelPendingIntegration()).toBe(true);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(hasPendingIntegrationDraft()).toBe(false);
  });
});
