'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _styles = require('@material-ui/core/styles');

var _info = require('./info');

var _info2 = _interopRequireDefault(_info);

var _peaks = require('./peaks');

var _peaks2 = _interopRequireDefault(_peaks);

var _compare = require('./compare');

var _compare2 = _interopRequireDefault(_compare);

var _multiplicity = require('./multiplicity');

var _multiplicity2 = _interopRequireDefault(_multiplicity);

var _cyclic_voltamery_data = require('./cyclic_voltamery_data');

var _cyclic_voltamery_data2 = _interopRequireDefault(_cyclic_voltamery_data);

var _graph_selection = require('./graph_selection');

var _graph_selection2 = _interopRequireDefault(_graph_selection);

var _cfg = require('../../helpers/cfg');

var _cfg2 = _interopRequireDefault(_cfg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var theme = (0, _styles.createMuiTheme)({
  typography: {
    useNextVariants: true
  }
});

var styles = function styles() {
  return {
    panels: {
      maxHeight: 'calc(90vh - 220px)', // ROI
      display: 'table',
      overflowX: 'hidden',
      overflowY: 'auto',
      margin: '5px 0 0 0',
      padding: '0 0 0 0',
      width: '100%'
    }
  };
};

var PanelViewer = function (_React$Component) {
  _inherits(PanelViewer, _React$Component);

  function PanelViewer(props) {
    _classCallCheck(this, PanelViewer);

    var _this = _possibleConstructorReturn(this, (PanelViewer.__proto__ || Object.getPrototypeOf(PanelViewer)).call(this, props));

    _this.state = {
      expand: 'info'
    };

    _this.onExapnd = _this.onExapnd.bind(_this);
    _this.handleDescriptionChanged = _this.handleDescriptionChanged.bind(_this);
    return _this;
  }

  _createClass(PanelViewer, [{
    key: 'onExapnd',
    value: function onExapnd(input) {
      var expand = this.state.expand;

      var nextExpand = input === expand ? '' : input;
      this.setState({ expand: nextExpand });
    }
  }, {
    key: 'handleDescriptionChanged',
    value: function handleDescriptionChanged(content, delta, source, editor) {
      if (source === 'user') {
        var contentChanged = editor.getContents();
        this.props.onDescriptionChanged(contentChanged);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var expand = this.state.expand;
      var _props = this.props,
          classes = _props.classes,
          feature = _props.feature,
          integration = _props.integration,
          editorOnly = _props.editorOnly,
          molSvg = _props.molSvg,
          descriptions = _props.descriptions,
          layoutSt = _props.layoutSt,
          canChangeDescription = _props.canChangeDescription,
          jcampIdx = _props.jcampIdx,
          entityFileNames = _props.entityFileNames,
          curveSt = _props.curveSt,
          userManualLink = _props.userManualLink;

      var onExapndInfo = function onExapndInfo() {
        return _this2.onExapnd('info');
      };
      var onExapndPeak = function onExapndPeak() {
        return _this2.onExapnd('peak');
      };
      var onExapndMpy = function onExapndMpy() {
        return _this2.onExapnd('mpy');
      };
      var onExapndCompare = function onExapndCompare() {
        return _this2.onExapnd('compare');
      };
      var onExapndCyclicVolta = function onExapndCyclicVolta() {
        return _this2.onExapnd('cyclicvolta');
      };
      var onExapndGraphSelection = function onExapndGraphSelection() {
        return _this2.onExapnd('graph');
      };

      var listCurves = curveSt.listCurves;

      var hideGraphSelection = listCurves === false || listCurves === undefined;

      return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(classes.panels) },
        _react2.default.createElement(
          _styles.MuiThemeProvider,
          {
            theme: theme
          },
          hideGraphSelection ? null : _react2.default.createElement(_graph_selection2.default, { jcampIdx: jcampIdx, entityFileNames: entityFileNames, expand: expand === 'graph', onExapnd: onExapndGraphSelection }),
          _react2.default.createElement(_info2.default, {
            feature: feature,
            integration: integration,
            editorOnly: editorOnly,
            expand: expand === 'info',
            molSvg: molSvg,
            onExapnd: onExapndInfo,
            descriptions: descriptions,
            canChangeDescription: canChangeDescription,
            onDescriptionChanged: this.handleDescriptionChanged
          }),
          _cfg2.default.hidePanelPeak(layoutSt) ? null : _react2.default.createElement(_peaks2.default, { expand: expand === 'peak', onExapnd: onExapndPeak }),
          _cfg2.default.hidePanelMpy(layoutSt) ? null : _react2.default.createElement(_multiplicity2.default, { expand: expand === 'mpy', onExapnd: onExapndMpy }),
          _cfg2.default.hidePanelCompare(layoutSt) || listCurves.length > 1 ? null : _react2.default.createElement(_compare2.default, { expand: expand === 'compare', onExapnd: onExapndCompare }),
          _cfg2.default.hidePanelCyclicVolta(layoutSt) ? null : _react2.default.createElement(_cyclic_voltamery_data2.default, { jcampIdx: jcampIdx, feature: feature, expand: expand === 'cyclicvolta', onExapnd: onExapndCyclicVolta, userManualLink: userManualLink ? userManualLink.cv : undefined })
        )
      );
    }
  }]);

  return PanelViewer;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state, _) {
  return (// eslint-disable-line
    {
      layoutSt: state.layout,
      curveSt: state.curve
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({}, dispatch);
};

PanelViewer.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  feature: _propTypes2.default.object.isRequired,
  integration: _propTypes2.default.object.isRequired,
  editorOnly: _propTypes2.default.bool.isRequired,
  molSvg: _propTypes2.default.string.isRequired,
  descriptions: _propTypes2.default.array.isRequired,
  layoutSt: _propTypes2.default.string.isRequired,
  canChangeDescription: _propTypes2.default.bool.isRequired,
  onDescriptionChanged: _propTypes2.default.func,
  entityFileNames: _propTypes2.default.array,
  userManualLink: _propTypes2.default.object,
  curveSt: _propTypes2.default.object.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(PanelViewer));