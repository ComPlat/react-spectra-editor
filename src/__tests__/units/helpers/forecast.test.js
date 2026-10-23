import { curvePredictions, hasCurvePredictions, submittedPredictions } from '../../../helpers/forecast';

describe('curvePredictions', () => {
  const shared = { outline: { code: 200 }, output: { result: [{ shared: true }] } };

  it('shares one set across curves when the host does not tag them', () => {
    const st = { predictions: shared, predictionsByCurve: {} };
    expect(curvePredictions(st, 0)).toBe(shared);
    expect(curvePredictions(st, 2)).toBe(shared);
    expect(hasCurvePredictions(st)).toBe(false);
  });

  it('gives each tagged curve its own, and nothing to a curve not predicted yet', () => {
    const own = { outline: { code: 200 }, output: { result: [{ own: true }] }, curveIdx: 1 };
    const st = { predictions: own, predictionsByCurve: { 1: own } };
    expect(curvePredictions(st, 1)).toBe(own);
    expect(curvePredictions(st, 0)).toEqual({ outline: {}, output: { result: [] } });
    expect(hasCurvePredictions(st)).toBe(true);
  });

  it('copes with a state that has no per-curve map', () => {
    expect(curvePredictions({ predictions: shared }, 0)).toBe(shared);
  });
});

describe('submittedPredictions', () => {
  const shared = { outline: { code: 200 }, output: { result: [{ shared: true }] } };
  const empty = { outline: {}, output: { result: [] } };

  it('sends untagged predictions with a single spectrum', () => {
    const st = { predictions: shared, predictionsByCurve: {} };
    expect(submittedPredictions(st, 0, 1)).toBe(shared);
  });

  it('sends untagged predictions with none of several spectra', () => {
    const st = { predictions: shared, predictionsByCurve: {} };
    expect(submittedPredictions(st, 0, 2)).toEqual(empty);
    expect(submittedPredictions(st, 1, 2)).toEqual(empty);
  });

  it('sends each of several spectra its tagged predictions', () => {
    const own = { ...shared, curveIdx: 1 };
    const st = { predictions: own, predictionsByCurve: { 1: own } };
    expect(submittedPredictions(st, 1, 2)).toBe(own);
    expect(submittedPredictions(st, 0, 2)).toEqual(empty);
  });
});
