import submitReducer from '../../../reducers/reducer_submit';
import { LAYOUT, MANAGER } from '../../../constants/action_type';
import { LIST_LAYOUT } from '../../../constants/list_layout';
import Format from '../../../helpers/format';

describe('reducer_submit', () => {
  const afterPick = (layout) => submitReducer(undefined, { type: LAYOUT.UPDATE, payload: layout });

  it('RESETALL takes the precision of a recognised feature layout', () => {
    const state = submitReducer(afterPick(LIST_LAYOUT.H1), {
      type: MANAGER.RESETALL,
      payload: { operation: { layout: LIST_LAYOUT.MS } },
    });
    expect(state.decimal).toEqual(Format.spectraDigit(LIST_LAYOUT.MS));
  });

  // Same rule as reducer_layout: a PLAIN feature is "unrecognised", not a layout choice,
  // so the precision of the layout the user picked is kept.
  it('RESETALL keeps the current precision for a PLAIN or missing feature layout', () => {
    const picked = afterPick(LIST_LAYOUT.MS);
    [{ operation: { layout: LIST_LAYOUT.PLAIN } }, { operation: {} }, {}].forEach((payload) => {
      expect(submitReducer(picked, { type: MANAGER.RESETALL, payload }).decimal)
        .toEqual(Format.spectraDigit(LIST_LAYOUT.MS));
    });
  });
});
