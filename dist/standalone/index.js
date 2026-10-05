"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChemSpectraClient = ChemSpectraClient;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _store = _interopRequireDefault(require("./store"));
var _frame = _interopRequireDefault(require("./frame"));
var _jsxRuntime = require("react/jsx-runtime");
// One store per page, created on first render rather than on import.
let store = null;
const getStore = () => {
  if (!store) store = (0, _store.default)();
  return store;
};

// - - - React - - -
function ChemSpectraClient({
  editorOnly
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRedux.Provider, {
    store: getStore(),
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_frame.default, {
      editorOnly: editorOnly
    })
  });
}
ChemSpectraClient.propTypes = {
  editorOnly: _propTypes.default.bool
};
ChemSpectraClient.defaultProps = {
  editorOnly: false
};

// eslint-disable-line