// @flow
import type { Action } from '../../../state/types'

export type SetDashboardPayload = {
  // TODO: Add payload content
}

const id = 'dashboard/SET_DASHBOARD'

export const setDashboard = ({ meta, path, tree, effect }): Action<SetDashboardPayload> => ({
  type: id,
  payload: {
    // TODO: Add payload content
    meta,
    path,
    tree,
    effect
  }
})

setDashboard.id = id
