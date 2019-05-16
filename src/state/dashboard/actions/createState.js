// @flow
import type {Action} from '../../../state/types'

export type CreateStatePayload = {
  name: string,
}

const id = 'dashboard/CREATE_STATE'

export const createState = (name: string, projectPath: string): Action<CreateStatePayload> => ({
  type: id,
  payload: {
    // TODO: Add payload content
    name,
    projectPath,
  }
})

createState.id = id
