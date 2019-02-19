// @flow

import type { Effect } from '../../types'
import { homeActions } from '../actions'
import {
  take,
  call
} from 'redux-saga/effects'

const electron = window.require('electron')
const remote = electron.remote
const mainProcess = remote.require('./main.js')

export function* createProjectEffect(): Effect {
  // TODO: put your effect logic here
  while (true) {
    const action = yield take(homeActions.createProject.id)
    const { projectName } = action.payload
    yield call(mainProcess.createProject, projectName)
  }
}
