"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _react2 = require("@testing-library/react");
var _graph_selection = _interopRequireDefault(require("../../../../components/panel/graph_selection"));
var _reduxMockStore = _interopRequireDefault(require("redux-mock-store"));
var _reactRedux = require("react-redux");
require("@testing-library/jest-dom");
const mockStore = (0, _reduxMockStore.default)([]);
const emptyStore = mockStore({
  curve: {},
  layout: ''
});
const store = mockStore({
  curve: {
    curveIdx: 0,
    listCurves: []
  },
  layout: 'CYCLIC VOLTAMMETRY'
});
const dispatchMock = () => Promise.resolve({});
emptyStore.dispatch = jest.fn(dispatchMock);
store.dispatch = jest.fn(dispatchMock);

/*
  Charaterization Tests
*/

describe('GraphSelectionPanel', () => {
  let AppWrapper;
  beforeEach(() => {
    AppWrapper = _ref => {
      let {
        store,
        children
      } = _ref;
      return /*#__PURE__*/_react.default.createElement(_reactRedux.Provider, {
        store: store
      }, " ", children, " ");
    };
  });
  afterEach(() => {
    (0, _react2.cleanup)();
  });
  test('Render with empty store', () => {
    const renderer = /*#__PURE__*/_react.default.createElement(AppWrapper, {
      store: emptyStore
    }, /*#__PURE__*/_react.default.createElement(_graph_selection.default, {
      expand: false,
      onExapnd: () => {},
      entityFileNames: []
    }));
    const {
      queryByTestId
    } = (0, _react2.render)(renderer);
    expect(queryByTestId('GraphSelectionPanel')).toBeNull();
  });
  test('Render with store', () => {
    const renderer = /*#__PURE__*/_react.default.createElement(AppWrapper, {
      store: store
    }, /*#__PURE__*/_react.default.createElement(_graph_selection.default, {
      expand: false,
      onExapnd: () => {},
      entityFileNames: []
    }));
    const {
      queryByTestId
    } = (0, _react2.render)(renderer);
    expect(queryByTestId('GraphSelectionPanel')).toBeInTheDocument();
  });
});