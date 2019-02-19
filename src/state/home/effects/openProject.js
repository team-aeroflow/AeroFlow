// @flow

import type { Effect } from '../../types'

import {
  take,
} from 'redux-saga/effects'
import { homeActions } from '../actions'

const electron = window.require('electron')
const remote = electron.remote
const mainProcess = remote.require('./main.js')
const ipcRenderer = electron.ipcRenderer

export function* openProjectEffect(): Effect {
  while (true) {
    const action = yield take(homeActions.openProject.id)
    ipcRenderer.send('open-project', 'open project')
  }
}
