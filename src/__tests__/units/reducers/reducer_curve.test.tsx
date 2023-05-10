import curveReducer from "../../../reducers/reducer_curve";
import { CURVE } from "../../../constants/action_type";
import { ExtractJcamp } from "../../../helpers/chem";
import nmr1HJcamp from "../../fixtures/nmr1h_jcamp";
import { LIST_LAYOUT } from "../../../constants/list_layout";

describe('Test redux curve reducer', () => {

  interface CurveState {
    listCurves: Object[]
    curveIdx: number
  }

  interface CurveAction {
    type: string
    payload: any
  }

  let curveState: CurveState
  let action: CurveAction

  beforeEach(() => {
    curveState = { listCurves: [], curveIdx: 0 }
    action = { type: "", payload: null }
  })

  it('Get default state', () => {
    const newState = curveReducer(curveState, action)
    expect(newState).toEqual(curveState)
  })

  it('Select the working curve', () => {
    action.type = CURVE.SELECT_WORKING_CURVE
    action.payload = 2
    const { curveIdx } = curveReducer(curveState, action)
    expect(curveIdx).toEqual(2)
  })

  it('Set all curves without payload', () => {
    action.type = CURVE.SET_ALL_CURVES
    const { listCurves } = curveReducer(curveState, action)
    expect(listCurves).toEqual(null)
  })

  it('Set all curves', () => {
    action.type = CURVE.SET_ALL_CURVES
    const entity = ExtractJcamp(nmr1HJcamp)
    action.payload = [ entity ]
    const { curveIdx, listCurves } = curveReducer(curveState, action)
    expect(listCurves.length).toEqual(1)
    expect(curveIdx).toEqual(0)

    const convertedEntity = listCurves[0]
    const { layout, topic, feature, hasEdit, integration, maxminPeak, color } = convertedEntity
    expect(layout).toEqual(LIST_LAYOUT.H1)
    expect(topic && feature && integration && color).not.toBeNull()
    expect(hasEdit).toEqual(true)
    expect(maxminPeak).toBeNull()
  })
})
