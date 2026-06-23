let pendingIntegrationDraft = null;

const cancelMessage = 'You are currently creating an integration. Are you sure you want to cancel it?';

const hasPendingIntegrationDraft = () => !!pendingIntegrationDraft;

const setPendingIntegrationDraft = (draft) => {
  pendingIntegrationDraft = draft;
};

const forgetPendingIntegrationDraft = () => {
  pendingIntegrationDraft = null;
};

const clearPendingIntegrationDraft = () => {
  const draft = pendingIntegrationDraft;
  pendingIntegrationDraft = null;
  if (draft && typeof draft.cancel === 'function') {
    draft.cancel();
  }
};

const confirmCancelPendingIntegration = () => {
  if (!hasPendingIntegrationDraft()) return true;

  const shouldCancel = typeof window === 'undefined'
    || typeof window.confirm !== 'function'
    // This confirmation intentionally protects an in-progress two-click integration.
    // eslint-disable-next-line no-alert
    || window.confirm(cancelMessage);

  if (shouldCancel) {
    clearPendingIntegrationDraft();
  }

  return shouldCancel;
};

const isDraftForCurve = (jcampIdx, dataLength) => {
  if (!pendingIntegrationDraft) return false;
  return pendingIntegrationDraft.jcampIdx === jcampIdx
    && pendingIntegrationDraft.dataLength === dataLength;
};

export {
  clearPendingIntegrationDraft,
  confirmCancelPendingIntegration,
  forgetPendingIntegrationDraft,
  hasPendingIntegrationDraft,
  isDraftForCurve,
  setPendingIntegrationDraft,
};
