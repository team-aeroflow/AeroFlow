// @flow

import type { Action } from '../../types'
import type { DashboardState } from '../types'
import type { SetDashboardPayload } from '../actions/setDashboard'

export function setDashboardReducer(state: DashboardState, action: Action<SetDashboardPayload>): DashboardState {
  // console.log('set dashbord', action)
  const { meta, path, tree, effect_path, effects } = action.payload
  // console.log(effects)
  return {
    ...state,
    meta,
    path,
    tree,
    effect_path,
    effects
  }
}
