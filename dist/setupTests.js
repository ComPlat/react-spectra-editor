"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _enzyme = _interopRequireDefault(require("enzyme"));
var _enzymeAdapterReact = _interopRequireDefault(require("enzyme-adapter-react-16"));
_enzyme.default.configure({
  adapter: new _enzymeAdapterReact.default()
});