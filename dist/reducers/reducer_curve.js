'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _action_type = require('../constants/action_type');

var _extractParams2 = require('../helpers/extractParams');

var _chem = require('../helpers/chem');

var _format = require('../helpers/format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
  listCurves: [],
  curveIdx: 0
};

var setAllCurves = function setAllCurves(state, action) {
  var payload = action.payload;

  if (payload) {
    var entities = payload.map(function (entity, idx) {
      var _extractParams = (0, _extractParams2.extractParams)(entity, 1),
          topic = _extractParams.topic,
          feature = _extractParams.feature,
          hasEdit = _extractParams.hasEdit,
          integration = _extractParams.integration;

      var layout = entity.layout;
      var maxminPeak = (0, _chem.Convert2MaxMinPeak)(layout, feature, 0);
      var color = _format2.default.mutiEntitiesColors(idx);
      return { layout: layout, topic: topic, feature: feature, hasEdit: hasEdit, integration: integration, maxminPeak: maxminPeak, color: color, curveIdx: idx };
    });

    return Object.assign({}, state, { curveIdx: 0, listCurves: entities });
  }
  return Object.assign({}, state, { curveIdx: 0, listCurves: payload });
};

var curveReducer = function curveReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _action_type.CURVE.SELECT_WORKING_CURVE:
      return Object.assign({}, state, { curveIdx: action.payload });
    case _action_type.CURVE.SET_ALL_CURVES:
      return setAllCurves(state, action);
    default:
      return state;
  }
};

exports.default = curveReducer;