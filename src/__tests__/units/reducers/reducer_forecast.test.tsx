import { FORECAST, MANAGER } from "../../../constants/action_type";
import forecastReducer from "../../../reducers/reducer_forecast";

describe('Test redux reducer for forecast', () => {
  interface ForecastPrediction {
    outline: any
    output: any
  }

  interface ForecastState {
    predictions: ForecastPrediction
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
    initState = { predictions: { outline: {}, output: { result: [] }, } }
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
      expect(newState).toEqual(payload)
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
