"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _react2 = require("@testing-library/react");
var _peaks = _interopRequireDefault(require("../../../../components/panel/peaks"));
var _reduxMockStore = _interopRequireDefault(require("redux-mock-store"));
var _reactRedux = require("react-redux");
require("@testing-library/jest-dom");
const mockStore = (0, _reduxMockStore.default)([]);
const store = mockStore({
  editPeak: {
    present: {
      selectedIdx: 0,
      peaks: [{
        prevOffset: 0,
        pos: [],
        neg: []
      }]
    }
  },
  curve: {
    listCurves: [{
      feature: {}
    }],
    curveIdx: 0
  },
  layout: 'SIZE EXCLUSION CHROMATOGRAPHY'
});
const failedStore = mockStore({
  editPeak: {
    present: {
      selectedIdx: 0,
      peaks: [{
        prevOffset: 0,
        pos: [],
        neg: []
      }]
    }
  },
  curve: {
    listCurves: [{}],
    curveIdx: 1
  },
  layout: 'SIZE EXCLUSION CHROMATOGRAPHY'
});
const dispatchMock = () => Promise.resolve({});
store.dispatch = jest.fn(dispatchMock);
describe("<Peaks />", () => {
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
  test('Render peaks panel info', () => {
    const renderer = /*#__PURE__*/_react.default.createElement(AppWrapper, {
      store: store
    }, /*#__PURE__*/_react.default.createElement(_peaks.default, {
      expand: false,
      onExapnd: () => {}
    }));
    const {
      queryByTestId
    } = (0, _react2.render)(renderer);
    expect(queryByTestId('PeaksPanelInfo')).toBeInTheDocument();
  });
  test('Render peaks panel with invalid store list', () => {
    const renderer = /*#__PURE__*/_react.default.createElement(AppWrapper, {
      store: failedStore
    }, /*#__PURE__*/_react.default.createElement(_peaks.default, {
      expand: false,
      onExapnd: () => {}
    }));
    const {
      queryByTestId
    } = (0, _react2.render)(renderer);
    expect(queryByTestId('PeaksPanelInfo')).not.toBeInTheDocument();
  });
});