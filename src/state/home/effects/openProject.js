// @flow

import type { Effect } from '../../types'

import {
  take,
} from 'redux-saga/effects'
import { homeActions } from '../actions'
import { actions as routerActions } from 'redux-router5'
import { router } from '../../../router'

const electron = window.require('electron')
const remote = electron.remote
const mainProcess = remote.require('./main.js')
const ipcRenderer = electron.ipcRenderer

export function* openProjectEffect(): Effect {
  while (true) {
    const action = yield take(homeActions.openProject.id)
    ipcRenderer.send('open-project', 'open project')
    ipcRenderer.on('open-project-response', (event, arg) => {
      const { success } = arg
      if (!success) {
        console.log('This project not support')
        return;
      }
      console.log('open project success')
      router.navigate('dashboard')
    })
  }
}
