// @flow

import type { Effect } from '../../types'
import { actionTypes as routerTypes } from 'redux-router5'
import { dashboardActions } from '../actions'
import {
  take,
  put
} from 'redux-saga/effects'

const electron = window.require('electron')
const remote = electron.remote
const mainProcess = remote.require('./main.js')
const ipcRenderer = electron.ipcRenderer

function* test(a) {
  yield put(dashboardActions.setDashboard(a))
}

export function* enterDashboardEffect(): Effect {
  while (true) {
    const transition = yield take(routerTypes.TRANSITION_SUCCESS)
    console.log(transition)
    if (transition.payload.route.name === 'dashboard') {
      console.log('hi dash')
      ipcRenderer.on('on-dashboard', (event, arg) => {
        // ส่ง arg {meta, path, tree} ไปให้ store และนำไป render
        // yield put(dashboardActions.setDashboard(arg))
        test(arg)
        ipcRenderer.send('watch-file', arg.path)
        // return arg
      })
      // console.log(test())
    }
  }
}

