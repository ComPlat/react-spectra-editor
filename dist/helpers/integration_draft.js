"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPendingIntegrationDraft = exports.hasPendingIntegrationDraft = exports.forgetPendingIntegrationDraft = exports.confirmCancelPendingIntegration = exports.clearPendingIntegrationDraft = void 0;
let pendingIntegrationDraft = null;
const cancelMessage = 'You are currently creating an integration. Are you sure you want to cancel it?';
const hasPendingIntegrationDraft = () => !!pendingIntegrationDraft;
exports.hasPendingIntegrationDraft = hasPendingIntegrationDraft;
const setPendingIntegrationDraft = draft => {
  pendingIntegrationDraft = draft;
};
exports.setPendingIntegrationDraft = setPendingIntegrationDraft;
const forgetPendingIntegrationDraft = () => {
  pendingIntegrationDraft = null;
};
exports.forgetPendingIntegrationDraft = forgetPendingIntegrationDraft;
const clearPendingIntegrationDraft = () => {
  const draft = pendingIntegrationDraft;
  pendingIntegrationDraft = null;
  if (draft && typeof draft.cancel === 'function') {
    draft.cancel();
  }
};
exports.clearPendingIntegrationDraft = clearPendingIntegrationDraft;
const confirmCancelPendingIntegration = () => {
  if (!hasPendingIntegrationDraft()) return true;
  const shouldCancel = typeof window === 'undefined' || typeof window.confirm !== 'function'
  // This confirmation intentionally protects an in-progress two-click integration.
  // eslint-disable-next-line no-alert
  || window.confirm(cancelMessage);
  if (shouldCancel) {
    clearPendingIntegrationDraft();
  }
  return shouldCancel;
};
exports.confirmCancelPendingIntegration = confirmCancelPendingIntegration;