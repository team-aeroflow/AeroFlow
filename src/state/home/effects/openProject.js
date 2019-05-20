// @flow

import type { Effect } from '../../types'

import {
  take,
  call,
  put,
} from 'redux-saga/effects'
import { homeActions } from '../actions'
// import { actions as routerActions } from 'redux-router5'
import { router } from '../../../router'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

const _checkIsProject = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.on('open-project-response', (event, arg) => {
      const { success } = arg
      if (!success) {
        resolve(arg)
        return
      }
      resolve(arg)
      router.navigate('dashboard')
    })
  })
}

async function checkIsProject() {
  const isProject = await _checkIsProject()
  return isProject
}

export function* openProjectEffect(): Effect {
  while (true) {
    const action = yield take(homeActions.openProject.id)
    console.log(1)
    console.log(action)
    ipcRenderer.send('open-project', 'open project')
    const isProject = yield call(checkIsProject)
    console.log(42, isProject)
    yield put(homeActions.checkIsProject(isProject))
    // ipcRenderer.on('open-project-response', (event, arg) => {
    //   const { success } = arg
    //   if (!success) {
    //     console.log('This project not support')

    //     return
    //   }
    //   console.log(success)
    //   console.log('open project success')
    //   router.navigate('dashboard')
    // })
  }
}
