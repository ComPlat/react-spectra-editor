"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
var _list_layout = require("../constants/list_layout");
/* eslint-disable prefer-object-spread, default-param-last */

// Review finding S2 (PR #336): this used to be LIST_LAYOUT.PLAIN. layer_content.js's
// showForecast reads this Redux slice, not the entity's own layout. On the very first
// entity opened in a page session (the store is a module singleton), Content commits
// once against this bare default before LayerInit.execReset's dispatch lands. A host
// that always supplies a forecast prop (chemotion_ELN does) renders ForecastViewer as
// soon as showForecast is true -- with PLAIN here, an NMR/IR/UVVIS/XRD entity's first
// commit misses that and mounts the plain viewer instead, then swaps to ForecastViewer
// a tick later once the real layout lands. That second mount's own RESETALL dispatch
// clears ui/edit-peak/forecast/submit state execReset had just set up. With C13 here,
// that first commit already satisfies isNmr, so NMR/IR/UVVIS/XRD entities -- the common
// case -- mount ForecastViewer directly and never swap.
// This does not eliminate the swap in general: a first-opened entity that is NOT one of
// those four types (e.g. MS) mismatches either bare default just the same and swaps
// once execReset corrects it, as it always did before PLAIN was tried here. Avoiding
// that too would mean showForecast stops depending on this lagging Redux slice
// altogether, a separate and larger change. PLAIN was never load-bearing for the actual
// fix: B2 (readLayout always returning a real layout, and the RESETALL reducer case
// falling back to PLAIN rather than stale state) is what keeps an unrecognized-datatype
// entity from getting stuck on a stale layout indefinitely, and neither depends on this
// bare default -- so it is reverted to the value chemotion_ELN was already tuned around.
const initialState = _list_layout.LIST_LAYOUT.C13;
const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.LAYOUT.UPDATE:
      return action.payload;
    case _action_type.MANAGER.RESETALL:
      // A feature's operation.layout is only ever missing/falsy for a
      // malformed payload, never as an intentional "keep the current
      // layout" signal -- falling back to the possibly-stale `state` here
      // (rather than the same neutral PLAIN every other consumer falls
      // back to) is what let a child's RESETALL dispatch on an
      // unrecognized-datatype entity render one frame under whatever
      // layout the *previous* entity had, ahead of LayerInit.execReset.
      return action.payload?.operation?.layout || _list_layout.LIST_LAYOUT.PLAIN;
    default:
      return state;
  }
};
var _default = exports.default = layoutReducer;