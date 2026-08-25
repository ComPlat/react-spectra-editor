import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/styles';

import { store } from '../../../app';
import CmdBar from '../../../components/cmd_bar/index';
import ViewerLineRect from '../../../components/d3_line_rect/index';
import { LIST_HOST_HOOK_CLASS } from '../../../constants/list_graph';

// chemotion_ELN styles the editor from its own stylesheet and can only target class
// names that survive a build - withStyles emits opaque `jss8 jss4` ones. These hooks are
// therefore a published contract: a rename silently breaks the host's layout (the LC/MS
// three-chart stack collapsing to its first pane, the toolbar's floating select labels
// getting clipped), with nothing failing here. Assert on the literal strings so a rename
// has to be a deliberate, host-coordinated change.
describe('host DOM hooks', () => {
  it('pins the published class names', () => {
    expect(LIST_HOST_HOOK_CLASS).toEqual({
      CMD_BAR: 'rse-cmd-bar',
      LCMS_STACK: 'lcms-stack',
      LCMS_GRAPH_PANEL: 'lcms-graph-panel',
    });
  });

  // The editor's own store, so every slice these connected components select from is
  // present without hand-rolling a fixture of the whole state tree.
  const theme = createTheme();
  const withStore = (ui) => render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </Provider>,
  );

  it('marks the CmdBar root', () => {
    const { container } = withStore(
      <CmdBar
        feature={{}}
        hasEdit={false}
        forecast={{}}
        operations={[]}
        editorOnly={true}
      />,
    );
    expect(container.querySelector(`.${LIST_HOST_HOOK_CLASS.CMD_BAR}`)).toBeInTheDocument();
  });

  // d3-tip attaches to the chart svg on mount and calls SVG geometry APIs jsdom does
  // not implement. Only this suite renders a real chart, so the shims stay local.
  beforeAll(() => {
    const proto = window.SVGSVGElement.prototype;
    proto.createSVGPoint = proto.createSVGPoint || (() => ({
      x: 0,
      y: 0,
      matrixTransform: () => ({ x: 0, y: 0 }),
    }));
    proto.getScreenCTM = proto.getScreenCTM || (() => ({
      a: 1, b: 0, c: 0, d: 1, e: 0, f: 0, inverse: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }),
    }));
  });

  it('marks the LC/MS stack root and the m/z pane', () => {
    const { container } = withStore(
      <ViewerLineRect
        ticEntities={[]}
        uvvisEntities={[]}
        mzEntities={[]}
        feature={{}}
        jcampIdx={0}
        hplcMsSt={store.getState().hplcMs}
        isHidden={false}
      />,
    );
    const stack = container.querySelector(`.${LIST_HOST_HOOK_CLASS.LCMS_STACK}`);
    expect(stack).toBeInTheDocument();
    // The three chart mounts the host's height rules act on must all be inside the stack,
    // otherwise a host rule scoped to `.lcms-stack` misses one of them.
    expect(stack.querySelector('.d3Line')).toBeInTheDocument();
    expect(stack.querySelector('.d3Multi')).toBeInTheDocument();
    const panel = stack.querySelector(`.${LIST_HOST_HOOK_CLASS.LCMS_GRAPH_PANEL}`);
    expect(panel).toBeInTheDocument();
    expect(panel.querySelector('.d3Rect')).toBeInTheDocument();
  });
});
