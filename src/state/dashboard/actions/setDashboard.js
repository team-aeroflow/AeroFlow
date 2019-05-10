// @flow
import type { Action } from '../../../state/types'

export type SetDashboardPayload = {
  meta: any,
  countMeta: Object,
  projectPath: string,
  tree: Array<string>,
  effect_path: Array<string>,
  effects: Object,
}

const id = 'dashboard/SET_DASHBOARD'

export const setDashboard = (data: SetDashboardPayload): Action<SetDashboardPayload> => ({
  type: id,
  payload: {
    meta: data.meta,
    countMeta: data.countMeta,
    projectPath: data.projectPath,
    tree: data.tree,
    effect_path: data.effect_path,
    effects: data.effects
  }
})

setDashboard.id = id
