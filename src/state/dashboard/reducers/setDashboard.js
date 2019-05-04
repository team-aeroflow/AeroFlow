// @flow

import type { Action } from '../../types'
import type { DashboardState } from '../types'
import type { SetDashboardPayload } from '../actions/setDashboard'

export function setDashboardReducer(state: DashboardState, action: Action<SetDashboardPayload>): DashboardState {
  const {
    meta,
    countMeta,
    projectPath,
    tree,
    effect_path,
    effects
  } = action.payload
  
  return {
    ...state,
    meta,
    countMeta,
    projectPath,
    tree,
    effect_path,
    effects
  }
}
