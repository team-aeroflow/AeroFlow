const _ = require('lodash')
const path = require('path')
const fs = require('fs')

function countProperty(meta) {
  const countMeta = {}
  const { states } = meta
  Object.values(states).map((d, i) => {
    countMeta[d.name] = {
      actions: _.size(d.actions),
      channels: _.size(d.channels),
      effects: _.size(d.effects),
      reducers: _.size(d.reducers),
    }
  })
  return countMeta
}

module.exports = {
  countProperty
}