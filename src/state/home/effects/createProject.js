// @flow

import type { Effect } from '../../types'
import { homeActions } from '../actions'
import {
  take,
  call,
  put
} from 'redux-saga/effects'
import { router } from '../../../router'
import { dashboardActions } from '../../dashboard/actions'

const electron = window.require('electron')
const remote = electron.remote
const mainProcess = remote.require('./main.js')
const ipcRenderer = electron.ipcRenderer

// const _createProject = () => {
//   return new Promise((resolve, reject) => {
//     ipcRenderer.once('create-success', (event, arg) => {
//       resolve(arg)
//       ipcRenderer.send('watch-file', arg)
//     })
//   })
// }


// async function createProject() {
//   // const project = await _createProject()
//   return project
// }


export function* createProjectEffect(): Effect {
  // TODO: put your effect logic here
  while (true) {
    const action = yield take(homeActions.createProject.id)
    const { projectName } = action.payload
    // yield call(mainProcess.createProject, projectName)
    ipcRenderer.send('create-project', projectName)
    // const data = yield call(createProject)
    // yield put(dashboardActions.setDashboard(data))
    ipcRenderer.on('create-project-response', (event, arg) => {
      const { success } = arg
      router.navigate('dashboard')
    })
  }
}
