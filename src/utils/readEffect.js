const fs = require('fs')
const path = require('path')
const flow = require('flow-parser')
const _ = require('lodash')

const meta = {}
const nodes = []
const links = []

function isIndexFile(str, target) {
  return str.substr(-(target.length)) === target
}

function removeItem(value, array) {
  for (let i in array) {
    if (array[i] === value) {
      array.splice(i, 1)
      break;
    }
  }
}

function isInArray(value, array) {
  return array.indexOf(value) > -1
}

function clearMeta() {
  for (let datum in meta) {
    delete meta[datum]
  }
  nodes.length = 0
  links.length = 0
}

function reduceSameID(data) {
  const result = _(data)
    .groupBy('id')
    .map(g => _.mergeWith({}, ...g, (o, s, k) => {
      if (k !== 'point_to') return

      if (_.isNil(s)) return o

      return [].concat(o || [], s)
    }))
    .value()
  return result
}

function ParserEffect(name) {
  const filePath = path.resolve(name)
  const content = fs.readFileSync(filePath).toString()

  if (content.length === 0) {
    return
  }

  const f = flow.parse(content, {})
  if (f.body[f.body.length - 1] === undefined || f.body[f.body.length - 1].declaration === undefined || isIndexFile(name, "index.js") || f.body[f.body.length - 1].declaration.body.body.length === 0) {
    return
  }
  const toJSON = f.body[f.body.length - 1].declaration.body.body[0].body
  const effectFunction = f.body[f.body.length - 1].declaration.id.name
  const body = toJSON.body

  body.map((d, i) => {
    // console.log(d.type)
    if (d.type === 'IfStatement') {
      // console.log(d.consequent)
      const body = d.consequent.body
      body.map((body, i) => {
        if (body.type === 'VariableDeclaration') {
          [body.declarations].map((dat, j) => {
            if (dat[j].id.type === 'ObjectPattern') {
              return
            }
            const varName = dat[j].id.name
            const effect = dat[j].init.argument.callee.name
            const type = effect === 'call' ? 'function' : 'action'

            const argument = dat[j].init.argument.arguments

            const params = []
            const typeId = []
            argument.map((da) => {
              // console.log(da)
              if (da.type === 'Identifier') {
                // console.log('00',da.name)
                params.push(da.name)
              } else if (da.type === 'MemberExpression') {
                if (da.object.type === 'MemberExpression') {
                  const val = `${da.object.object.name}.${da.object.property.name}.${da.property.name}`
                  const name = da.object.object.name.replace('Actions', '')
                  const id = name + '/' + da.object.property.name.split(/(?=[A-Z])/).join('_').toUpperCase()
                  params.push(val)
                  typeId.push(id)
                } else if (da.object.type === 'Identifier') {
                  const func = `${da.object.name}.${da.property.name}`
                  params.push(func)
                }
              } else if (da.type === 'CallExpression') {
                const name = da.callee.object.name.replace('Actions', '')
                const id = name + '/' + da.callee.property.name.split(/(?=[A-Z])/).join('_').toUpperCase()
                typeId.push(id)
                da.arguments.map((p) => {
                  if (p.type === 'Identifier') {
                    params.push(p.name)
                  } else if (p.type === 'Literal') {
                    params.push(p.value)
                  }
                })
              }
            })
            const name = typeId[0] === undefined ? params[0] : typeId[0]
            // const point_to = typeId[0] === undefined ? null : effect === 'take' ? effectFunction : typeId[0]
            const isView = typeId[0] === 'router/NAVIGATE_TO' ? 'view' : 'effect'
            const paramName = typeId[0] === undefined ? params[0] : typeId[0]
            // let point_to = effect === 'take' ? effectFunction : params[0]
            let point_to = effect === 'take' ? effectFunction : effect === 'call' ? null : params[0]
            if (point_to === 'router/NAVIGATE_TO') {
              point_to = params[0]
            }

            if (effect === 'take') {
              nodes.push({
                id: effectFunction,
                name: effectFunction,
                functionName: effectFunction,
                effect,
                type: 'effect',
                params: null,
                point_to: null,
                path: filePath
              })
            } else if (effect === 'put') {
              nodes.push({
                id: point_to,
                name: point_to,
                functionName: effectFunction,
                effect: null,
                type: 'action',
                params: null,
                point_to: null,
                path: filePath
              })
            } else if (effect === 'call') {
              nodes.push({
                id: effectFunction,
                name: effectFunction,
                functionName: effectFunction,
                effect: null,
                type: isView,
                params: null,
                point_to: paramName,
                path: filePath
              })
            }

            nodes.push({
              id: effect === 'take' ? paramName : effect === 'put' ? varName : effect === 'call' ? paramName : null,
              name: effect === 'take' ? paramName : effect === 'put' ? varName : effect === 'call' ? paramName : null,
              // id: effect === 'take' ? name : effect === 'put' ? varName : params[0],
              // name: effect === 'take' ? name : effect === 'put' ? varName : params[0],
              functionName: effectFunction,
              effect,
              type,
              params: params.length === 0 ? null : params,
              point_to,
              path: filePath
            })
          })
        } else if (body.type === 'ExpressionStatement') {
          const varName = null
          if (body.expression.argument === undefined) {
            return
          }
          const effect = body.expression.argument.callee.name
          const type = effect === 'call' ? 'function' : 'effect'

          const params = []
          const typeId = []

          const argument = body.expression.argument.arguments
          argument.map((da) => {
            if (da.type === 'Identifier') {
              params.push(da.name)
            } else if (da.type === 'Literal') {
              params.push(da.value)
            } else if (da.type === 'MemberExpression') {
              const func = `${da.object.name}.${da.property.name}`
              params.push(func)
            } else if (da.type === 'CallExpression') {
              const action = `${da.callee.object.name}.${da.callee.property.name}`
              const name = da.callee.object.name.replace('Actions', '')
              const id = name + '/' + da.callee.property.name.split(/(?=[A-Z])/).join('_').toUpperCase()
              typeId.push(id)
              params.push(action)
              const arguments = da.arguments
              arguments.map((t) => {
                if (t.type === 'Literal') {
                  params.push(t.value)
                } else if (t.type === 'Identifier') {
                  params.push(t.name)
                }
              })
            }
          })
          const paramName = typeId[0] === undefined ? params[0] : typeId[0]
          let point_to = typeId[0] === undefined ? null : effect === 'take' ? varName : typeId[0]
          if (typeId[0] === 'router/NAVIGATE_TO') {
            point_to = params[params.length - 1]
          }
          const isView = typeId[0] === 'router/NAVIGATE_TO' ? 'view' : effect === 'put' ? 'action' : effect === 'call' ? 'function' : 'effect'

          if (effect === 'call') {
            nodes.push({
              id: effectFunction,
              name: effectFunction,
              functionName: effectFunction,
              effect: null,
              type: 'effect',
              params: null,
              point_to: paramName,
              path: filePath
            })
          } else if (effect === 'put') {
            nodes.push({
              id: point_to,
              name: point_to,
              functionName: effectFunction,
              effect: null,
              type: isView,
              params: null,
              point_to: null,
              path: filePath
            })
          }

          nodes.push({
            id: effect === 'call' ? paramName : effect === 'put' ? effectFunction : null,
            name: effect === 'call' ? paramName : effect === 'put' ? effectFunction : null,
            functionName: effectFunction,
            effect,
            type,
            params: params.length === 0 ? null : params,
            point_to,
            path: filePath
          })
        }
      })
    } else if (d.type === 'VariableDeclaration') {
      const kind = d.kind
      if (d.declarations[0].id.type === 'ObjectPattern') {
        return
      }
      [d.declarations].map((dat, j) => {
        const varName = dat[j].id.name
        // console.log(varName)
        const effect = dat[j].init.argument.callee.name
        // console.log(effect)
        const type = dat[j].init.argument.callee.name === 'call' ? 'function' : 'action'
        // console.log('TYPE:', type)
        // console.log(dat[j].init.argument.arguments)
        const arguments = dat[j].init.argument.arguments

        const params = []
        const typeId = []
        arguments.map((da, k) => {
          if (da.type === 'Identifier') {
            const functionName = da.name
            // console.log('fname', functionName)
            params.push(functionName)
          } else {
            if (da.object.type === 'MemberExpression') {
              const param = `${da.object.object.name}.${da.object.property.name}.${da.property.name}`
              const name = da.object.object.name.replace('Actions', '')
              const id = name + '/' + da.object.property.name.split(/(?=[A-Z])/).join('_').toUpperCase()
              // console.log(id)
              params.push(param)
              typeId.push(id)
            } else if (da.object.type === 'Identifier') {
              const param = `${da.object.name}.${da.property.name}`
              // console.log(param)
              params.push(param)
            }
          }
        })

        const paramName = typeId[0] === undefined ? params[0] : typeId[0]
        // let point_to = typeId[0] === undefined ? null : effect === 'take' ? effectFunction : typeId[0]
        let point_to = effect === 'take' ? effectFunction : params[0]
        if (point_to === 'router/NAVIGATE_TO') {
          point_to = params[0]
        }

        // init node
        if (effect === 'take') {
          nodes.push({
            id: effectFunction,
            name: effectFunction,
            functionName: effectFunction,
            effect: null,
            type: 'effect',
            params: null,
            point_to: null,
            path: filePath
          })
        } else if (effect === 'call') {
          nodes.push({
            id: params[0],
            name: params[0],
            functionName: effectFunction,
            effect: null,
            type: 'function',
            params: null,
            point_to: null,
            path: filePath
          })
        }
        nodes.push({
          id: effect === 'take' ? paramName : effect === 'put' ? varName : effectFunction,
          name: effect === 'take' ? paramName : effect === 'put' ? varName : effectFunction,
          functionName: effectFunction,
          effect,
          type,
          params: params.length === 0 ? null : params,
          point_to,
          path: filePath
        })
      })
    } else if (d.type === 'ExpressionStatement') {
      [d.expression].map((dat, j) => {
        // console.log(dat.argument.arguments[j].type)
        const varName = null
        if (dat.argument === undefined) {
          return
        }
        const effect = dat.argument.callee.name
        const type = dat.argument.callee.name === 'call' ? 'function' : 'effect'
        // console.log('TYPE:', type)
        // console.log(dat.argument.arguments)
        const params = []
        const typeId = []

        if (dat.argument.arguments[j].type === 'MemberExpression') {
          const param = `${dat.argument.arguments[j].object.name}.${dat.argument.arguments[j].property.name}`
          // console.log(param)
          params.push(param)
          const arguments = dat.argument.arguments
          // const params = []
          arguments.map((da, k) => {
            if (da.type === 'Identifier') {
              params.push(da.name)
              // console.log(da.name)
            } else if (da.type === 'Literal') {
              // console.log(da.value)
              params.push(da.value)
            }
          })

        } else if (dat.argument.arguments[j].type === 'CallExpression') {
          const actionName = `${dat.argument.arguments[j].callee.object.name}.${dat.argument.arguments[j].callee.property.name}`
          const name = dat.argument.arguments[j].callee.object.name.replace('Actions', '')
          const id = name + '/' + dat.argument.arguments[j].callee.property.name.split(/(?=[A-Z])/).join('_').toUpperCase()
          // params.push(id)
          typeId.push(id)
          const arguments = dat.argument.arguments[j].arguments
          arguments.map((da, k) => {
            if (da.type === 'Literal') {
              // console.log(da.value)
              params.push(da.value)
            } else {
              // console.log(da.name)
              params.push(da.name)
            }
          })
        }
        const paramName = typeId[0] === undefined ? params[0] : typeId[0]
        let point_to = typeId[0] === undefined ? null : effect === 'take' ? varName : typeId[0]
        if (typeId[0] === 'router/NAVIGATE_TO') {
          point_to = params[0]
        }
        const isView = typeId[0] === 'router/NAVIGATE_TO' ? 'view' : effect === 'put' ? 'action' : effect === 'call' ? 'function' : 'effect'

        if (effect === 'put') {
          nodes.push({
            id: point_to,
            name: point_to,
            functionName: effectFunction,
            effect: null,
            type: isView,
            params: null,
            point_to: null,
            path: filePath
          })
        } else if (effect === 'call') {
          nodes.push({
            id: effectFunction,
            name: effectFunction,
            functionName: effectFunction,
            effect: null,
            type: isView,
            params: null,
            point_to: paramName,
            path: filePath
          })
        }
        nodes.push({
          id: effect === 'call' ? paramName : effect === 'put' ? effectFunction : null,
          name: effect === 'call' ? paramName : effect === 'put' ? effectFunction : null,
          functionName: effectFunction,
          effect,
          type,
          params: params.length === 0 ? null : params,
          point_to,
          path: filePath
        })
        // console.log('----')
      })
    }
  })

  // console.log(meta)
  return nodes
}

function createMetaObject() {
  // Create Object to Nodes and Links format
  meta.nodes = nodes
  meta.nodes.map((node) => {
    if (node.name === null || node.point_to === null) return;
    links.push({
      source: node.id,
      target: node.point_to
    })
  })

  meta.links = links
  meta.nodes = reduceSameID(meta.nodes)
}

function ParserAction(file) {
  const filePath = path.resolve(__dirname, file)
  const content = fs.readFileSync(filePath).toString()
  const f = flow.parse(content, {})
  const body = f.body[f.body.length - 1].declaration.declarations[0]
  const name = body.id.name
  const body_actions = body.init.properties
  const action_id = name.replace('Actions', '')

  body_actions.map((d) => {
    nodes.push({
      id: `${action_id}/${d.key.name.split(/(?=[A-Z])/).join('_').toUpperCase()}`,
      name: d.key.name,
      effect: null,
      type: 'action',
      params: null,
      point_to: null,
      path: filePath
    })
  })
}

function collectEffect(name) {
  const { effects, actions } = name
  clearMeta()
  effects.forEach(d => {
    ParserEffect(d)
  })
  actions.forEach(d => {
    ParserAction(d)
  })
  createMetaObject()
}

module.exports = {
  collectEffect,
  // ParserAction,
  // ParserEffect,
  isIndexFile,
  meta,
  clearMeta,
  isInArray,
  removeItem
}