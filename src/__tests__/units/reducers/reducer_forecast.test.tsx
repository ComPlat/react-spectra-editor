import { FORECAST, MANAGER } from "../../../constants/action_type";
import forecastReducer from "../../../reducers/reducer_forecast";

describe('Test redux reducer for forecast', () => {
  interface ForecastPrediction {
    outline: any
    output: any
  }

  interface ForecastState {
    predictions: ForecastPrediction
    predictionsByCurve?: any
  }

  interface ForcastAction {
    type: string
    payload: any
  }

  let forecastState: ForecastState
  let action: ForcastAction
  let initState: ForecastState

  beforeEach(() => {
    forecastState = { predictions: { outline: {}, output: { result: [] }, } }
    initState = { predictions: { outline: {}, output: { result: [] }, }, predictionsByCurve: {} }
    action = { type: "", payload: null }
  })

  it('Get default state', () => {
    const newState = forecastReducer(forecastState, action)
    expect(newState).toEqual(forecastState)
  })

  describe('Init status', () => {
    beforeEach(() => {
      action.type = FORECAST.INIT_STATUS
    })
    it('Do not have any payload', () => {
      const newState = forecastReducer(forecastState, action)
      expect(newState).toEqual(forecastState)
    })

    it('Init with payload', () => {
      const payload: ForecastPrediction = { outline: {}, output: {} }
      action.payload = payload
      const newState = forecastReducer(forecastState, action)
      expect(newState).toEqual({ ...payload, predictionsByCurve: {} })
    })

    it('Keeps each curve\'s tagged predictions', () => {
      const first = { outline: { code: 200 }, output: { result: [{ a: 1 }] }, curveIdx: 0 }
      const second = { outline: { code: 200 }, output: { result: [{ b: 2 }] }, curveIdx: 1 }
      let state = forecastReducer(forecastState, { type: FORECAST.INIT_STATUS, payload: { predictions: first } })
      state = forecastReducer(state, { type: FORECAST.INIT_STATUS, payload: { predictions: second } })
      expect(state.predictions).toEqual(second)
      expect(state.predictionsByCurve).toEqual({ 0: first, 1: second })
    })

    it('Does not tag predictions without a curve index', () => {
      const predictions = { outline: { code: 200 }, output: { result: [] } }
      const state = forecastReducer(forecastState, { type: FORECAST.INIT_STATUS, payload: { predictions } })
      expect(state.predictionsByCurve).toEqual({})
    })
  })

  describe('Set NMR status', () => {
    const shifts = () => ({ shifts: [{ atom: 1, prediction: 7.1 }] })
    const accept = (curveIdx?: number) => ({
      type: FORECAST.SET_NMR_STATUS,
      payload: {
        predictions: { idx: 0, atom: 1, identity: 'Owner', value: 'accept' },
        svgs: [],
        curveIdx,
      },
    })

    it('Edits the shared predictions when the host does not tag them', () => {
      const state = forecastReducer(
        { predictions: { outline: { code: 200 }, output: { result: [shifts()] } }, predictionsByCurve: {} },
        accept(1),
      )
      expect(state.predictions.output.result[0].shifts[0].statusOwner).toEqual('accept')
      expect(state.predictionsByCurve).toEqual({})
    })

    it('Edits only the selected curve\'s tagged predictions', () => {
      const curve0 = { outline: { code: 200 }, output: { result: [shifts()] }, curveIdx: 0 }
      const curve1 = { outline: { code: 200 }, output: { result: [shifts()] }, curveIdx: 1 }
      const state = forecastReducer(
        { predictions: curve1, predictionsByCurve: { 0: curve0, 1: curve1 } },
        accept(0),
      )
      expect(state.predictionsByCurve[0].output.result[0].shifts[0].statusOwner).toEqual('accept')
      expect(state.predictionsByCurve[1]).toBe(curve1)
    })
  })

  describe('Clear and reset', () => {
    beforeEach(() => {
      forecastState = { predictions: { outline: null, output: null }}
    })

    it('Clear status', () => {
      action.type = FORECAST.CLEAR_STATUS
      
      const newState = forecastReducer(forecastState, action)
      expect(newState).toEqual(initState)
    })

    it('Reset status', () => {
      action.type = MANAGER.RESETALL
      const newState = forecastReducer(forecastState, action)
      expect(newState).toEqual(initState)
    })
  })

  // TODO: need more tests implementation
  // describe('Set IR status', () => {
  //   it('Just a simple test', () => {
  //     forecastState = { predictions: { outline: {}, output: { result: [{svgs: "", fgs: [{sma: 'd', identity: 'identity'}]}] }, } }
  //     const payload = { predictions: { outline: {}, output: { result: [{sma: "d"}] }, } }
  //     action.type = FORECAST.SET_IR_STATUS
  //     action.payload = payload
  //     const newState = forecastReducer(forecastState, action)
  //     expect(newState).toEqual(initState)
  //   })
  // })
})
