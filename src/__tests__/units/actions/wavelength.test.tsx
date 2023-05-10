import { updateWaveLength } from "../../../actions/wavelength";
import { XRD } from "../../../constants/action_type";

describe('Test redux action for wavelength', () => {
  it('Update wavelength value', () => {
    const wavelength = 1.0
    const { type, payload } = updateWaveLength(wavelength)
    expect(type).toEqual(XRD.UPDATE_WAVE_LENGTH)
    expect(payload).toEqual(wavelength)
  })
})
