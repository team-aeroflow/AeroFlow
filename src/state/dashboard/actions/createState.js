// @flow
import type {Action} from '../../../state/types'

export type CreateStatePayload = {
  // TODO: Add payload content
}

const id = 'dashboard/CREATE_STATE'

export const createState = (name): Action<CreateStatePayload> => ({
  type: id,
  payload: {
    // TODO: Add payload content
    name,
  }
})

createState.id = id
