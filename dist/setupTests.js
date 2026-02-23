"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _enzyme = _interopRequireDefault(require("enzyme"));
var _enzymeAdapterReact = _interopRequireDefault(require("@wojtekmaj/enzyme-adapter-react-17"));
_enzyme.default.configure({
  adapter: new _enzymeAdapterReact.default()
});