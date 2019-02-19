// @flow

import type {Action} from '../../types'
import type {HomeState} from '../types'
import type {OpenProjectPayload} from '../actions/openProject'

export function openProjectReducer(state: HomeState, action: Action<OpenProjectPayload>): HomeState {

  return {
    ...state,
  }
}
