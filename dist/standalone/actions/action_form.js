"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.submitForm = void 0;
var _action_type = require("../constants/action_type");
const submitForm = payload => ({
  type: _action_type.FORM.SUBMIT,
  payload
});
exports.submitForm = submitForm;