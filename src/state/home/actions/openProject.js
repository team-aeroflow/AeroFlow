// @flow
import type {Action} from '../../../state/types'

export type OpenProjectPayload = {
  // TODO: Add payload content
}

const id = 'home/OPEN_PROJECT'

export const openProject = (): Action<OpenProjectPayload> => ({
  type: id,
  payload: {
    // TODO: Add payload content
  }
})

openProject.id = id
