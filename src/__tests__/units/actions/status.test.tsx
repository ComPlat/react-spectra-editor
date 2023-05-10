import {
  enableAllBtn, toggleAllBtn, toggleSubmitBtn,
} from "../../../actions/status";
import { STATUS } from "../../../constants/action_type";

describe('Test redux action for status', () => {
  it('Toggle submit button', () => {
    const { type, payload } = toggleSubmitBtn()
    expect(type).toEqual(STATUS.TOGGLEBTNSUBMIT)
    expect(payload).toEqual([])
  })

  it('Toggle all button', () => {
    const { type, payload } = toggleAllBtn()
    expect(type).toEqual(STATUS.TOGGLEBTNALL)
    expect(payload).toEqual([])
  })

  it('Enable all button', () => {
    const { type, payload } = enableAllBtn()
    expect(type).toEqual(STATUS.ENABLEBTNALL)
    expect(payload).toEqual([])
  })
})
