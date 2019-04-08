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
const ipcRenderer = electron.ipcRenderer

const updateDashboard = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('on-dashboard', (event, arg) => {
      resolve(arg)
      ipcRenderer.send('watch-file', arg.path)
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
      console.log('data', data)
      yield put(dashboardActions.setDashboard(data))
    }
  }
}

