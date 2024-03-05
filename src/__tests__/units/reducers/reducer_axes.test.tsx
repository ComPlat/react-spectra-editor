import axesReducer from "../../../reducers/reducer_axes";
import { AXES } from "../../../constants/action_type";

describe('Test redux axes reducer', () => {
  interface Axes {
    xUnit: string,
    yUnit: string
  }

  interface AxesState {
    axes: [Axes]
  }

  interface AxesAction {
    type: string
    payload: any
  }

  let axesState: AxesState
  let action: AxesAction

  beforeEach(() => {
    const axes1 = { xUnit: '', yUnit: '' }
    axesState = { axes: [axes1] }
    action = { type: "", payload: null }
  })

  it('Get default state', () => {
    const newState = axesReducer(axesState, action)
    expect(newState).toEqual(axesState)
  })

  it('Update x-axis at index 0', () => {
    const xLabel = 'new-x-axes'
    const index = 0
    action.type = AXES.UPDATE_X_AXIS
    action.payload = { value: xLabel, curveIndex: index }
    const { axes } = axesReducer(axesState, action)
    const { xUnit, yUnit } = axes[index]
    expect(xUnit).toEqual(xLabel)
    expect(yUnit).toEqual('')
  })

  it('Update y-axis at index 0', () => {
    const yLabel = 'new-y-axes'
    const index = 0
    action.type = AXES.UPDATE_Y_AXIS
    action.payload = { value: yLabel, curveIndex: index }
    const { axes } = axesReducer(axesState, action)
    const { xUnit, yUnit } = axes[index]
    expect(xUnit).toEqual('')
    expect(yUnit).toEqual(yLabel)
  })

  it('Update x-axis at index 2 that has not existed', () => {
    const xLabel = 'new-x-axes'
    const index = 2
    action.type = AXES.UPDATE_X_AXIS
    action.payload = { value: xLabel, curveIndex: index }
    const { axes } = axesReducer(axesState, action)
    expect(axes.length).toEqual(3)
    const { xUnit, yUnit } = axes[index]
    expect(xUnit).toEqual(xLabel)
    expect(yUnit).toEqual('')
  })
})
