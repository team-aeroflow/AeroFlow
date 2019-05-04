// @flow
import type { Action } from '../../../state/types'

export type SetDashboardPayload = {
  // TODO: Add payload content
}

const id = 'dashboard/SET_DASHBOARD'

export const setDashboard = ({ meta, countMeta, projectPath, tree, effect_path, effects }): Action<SetDashboardPayload> => ({
  type: id,
  payload: {
    // TODO: Add payload content
    meta,
    countMeta,
    projectPath,
    tree,
    effect_path,
    effects
  }
})

setDashboard.id = id
