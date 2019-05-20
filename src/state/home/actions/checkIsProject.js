// @flow
import type {Action} from '../../../state/types'

export type CheckIsProjectPayload = {
  // TODO: Add payload content
}

const id = 'home/CHECK_IS_PROJECT'

export const checkIsProject = (status: string): Action<CheckIsProjectPayload> => ({
  type: id,
  payload: {
    status,
  }
})

checkIsProject.id = id
