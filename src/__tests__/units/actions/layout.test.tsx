import { updateLayout, setCurrentDataset, setManualLayoutOverride } from "../../../actions/layout";
import { LAYOUT } from "../../../constants/action_type";

describe('Test redux action for layout', () => {
  it('Update new layout', () => {
    const layout = '1H'
    const { type, payload } = updateLayout(layout)
    expect(type).toEqual(LAYOUT.UPDATE)
    expect(payload).toEqual(layout)
  })

  it('Set current dataset', () => {
    const { type, payload } = setCurrentDataset('dataset-1')
    expect(type).toEqual(LAYOUT.SET_CURRENT_DATASET)
    expect(payload).toEqual('dataset-1')
  })

  it('Set manual layout override', () => {
    const override = { datasetId: 'dataset-1', layout: '1H' }
    const { type, payload } = setManualLayoutOverride(override)
    expect(type).toEqual(LAYOUT.SET_MANUAL_OVERRIDE)
    expect(payload).toEqual(override)
  })
})
