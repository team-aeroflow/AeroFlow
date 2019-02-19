// @flow
import type {Action} from '../../../state/types'

export type CreateProjectPayload = {
  // TODO: Add payload content
}

const id = 'home/CREATE_PROJECT'

export const createProject = (projectName): Action<CreateProjectPayload> => ({
  type: id,
  payload: {
    // TODO: Add payload content
    projectName
  }
})

createProject.id = id
