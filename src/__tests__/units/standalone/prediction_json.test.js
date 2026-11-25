import { parsePredictionJson } from '../../../standalone/utils/util_predict';
import noticeReducer from '../../../standalone/reducers/reducer_notice';
import predictReducer from '../../../standalone/reducers/reducer_predict';
import { addPredJsonFail } from '../../../standalone/actions/action_predict';

// "(Optional) Add Prediction" takes a prediction JSON the client or chem-spectra-app saved.
// Anything else (a spectrum dropped there by mistake, a JSON of another shape) must be
// refused with a notice, not throw or break the page.
describe('standalone client: prediction JSON input', () => {
  const saved = { outline: { code: 200, text: 'NMR prediction success.' }, output: { result: [{ shifts: [] }] } };

  it('accepts a saved prediction', () => {
    expect(parsePredictionJson(JSON.stringify(saved))).toEqual(saved);
  });

  it('refuses a file that is not JSON', () => {
    expect(parsePredictionJson('##TITLE=PH\n##JCAMP-DX=4.24')).toBeNull();
  });

  it('refuses JSON that is not a prediction', () => {
    ['{}', '[]', '{"output":{}}', '{"output":{"result":"x"}}', 'null', '42'].forEach((str) => {
      expect(parsePredictionJson(str)).toBeNull();
    });
  });

  it('shows why, and keeps the current prediction', () => {
    const notice = noticeReducer(undefined, addPredJsonFail());
    expect(notice.status).toBe('error');
    expect(notice.message).toMatch(/prediction/i);
    const current = predictReducer(undefined, { type: 'x' });
    expect(predictReducer(current, addPredJsonFail())).toBe(current);
  });
});
