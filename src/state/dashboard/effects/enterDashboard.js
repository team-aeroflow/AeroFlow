// @flow

import type { Effect } from '../../types'
import { actionTypes as routerTypes } from 'redux-router5'
import { dashboardActions } from '../actions'
import {
  take,
  put,
  call
} from 'redux-saga/effects'

const electron = window.require('electron')
const remote = electron.remote
const mainProcess = remote.require('./main.js')
const ipcRenderer = electron.ipcRenderer

const updateDashboard = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.on('on-dashboard', (event, arg) => {
      ipcRenderer.send('watch-file', arg.path)
      resolve(arg)
    })
  })
}

async function getDashboard() {
  const dashboard = await updateDashboard()
  return dashboard
}

export function* enterDashboardEffect(): Effect {
  while (true) {
    const transition = yield take(routerTypes.TRANSITION_SUCCESS)
    if (transition.payload.route.name === 'dashboard') {
      const data = yield call(getDashboard)
      yield put(dashboardActions.setDashboard(data))
    }
  }
}

