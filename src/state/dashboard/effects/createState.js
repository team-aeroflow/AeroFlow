// @flow

import type {Effect} from '../../types'
import { dashboardActions } from '../actions'

import {
  take,
} from 'redux-saga/effects'

export function* createStateEffect(): Effect {
  // TODO: put your effect logic here
  const action = yield take(dashboardActions.createState.id)
  console.log(action)
}
