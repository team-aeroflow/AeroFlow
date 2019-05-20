// @flow

import type {Action} from '../../types'
import type {HomeState} from '../types'
import type {CheckIsProjectPayload} from '../actions/checkIsProject'

export function checkIsProjectReducer(state: HomeState, action: Action<CheckIsProjectPayload>): HomeState {
  console.log(8, state, action)
  const { status } = action.payload
  return {
    ...state,
    status,
  }
}
