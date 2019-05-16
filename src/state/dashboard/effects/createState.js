// @flow

import type { Effect } from '../../types'
import { dashboardActions } from '../actions'
import {
  take,
} from 'redux-saga/effects'
const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

export function* createStateEffect(): Effect {
  // TODO: put your effect logic here
  while (true) {
    const action = yield take(dashboardActions.createState.id)
    // const { name, projectPath } = action.payload
    const { payload } = action
    ipcRenderer.send('create-state', payload)
  }
}
