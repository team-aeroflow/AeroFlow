const fs = require('fs')
const path = require('path')
const flow = require('flow-parser')

function ParserCode(name) {
  const filePath = path.resolve(name)
  const content = fs.readFileSync(filePath).toString()

  if (content.length === 0) {
    return
  }

  const f = flow.parse(content, {})
  if (f.body[f.body.length - 1] === undefined || f.body[f.body.length - 1].declaration === undefined) {
    return
  }
  const toJSON = f.body[f.body.length - 1].declaration.body.body[0].body
  const body = toJSON.body
  const meta = []

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
              }
            })
            meta.push({
              name: varName,
              effect,
              type,
              params: params.length === 0 ? null : params,
              point_to: typeId[0] === undefined ? null : typeId[0]
            })
          })
        } else if (body.type === 'ExpressionStatement') {
          const varName = null
          const effect = body.expression.argument.callee.name
          const type = effect === 'call' ? 'function' : 'action'

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
          meta.push({
            name: varName,
            effect,
            type,
            params: params.length === 0 ? null : params,
            point_to: typeId[0] === undefined ? null : typeId[0]
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
              typeId.push(id)
            } else if (da.object.type === 'Identifier') {
              const param = `${da.object.name}.${da.property.name}`
              // console.log(param)
              params.push(param)
            }
          }
        })

        meta.push({
          name: varName,
          effect,
          type,
          params: params.length === 0 ? null : params,
          point_to: typeId[0] === undefined ? null : typeId[0]
        })
      })
    } else if (d.type === 'ExpressionStatement') {
      [d.expression].map((dat, j) => {
        // console.log(dat.argument.arguments[j].type)
        const varName = null
        const effect = dat.argument.callee.name
        const type = dat.argument.callee.name === 'call' ? 'function' : 'action'
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
        // console.log(params)
        // console.log(typeId)
        meta.push({
          name: varName,
          effect,
          type,
          params: params.length === 0 ? null : params,
          point_to: typeId[0] === undefined ? null : typeId[0]
        })
        // console.log('----')
      })
    }
  })

  // console.log(meta)
  return meta
}

module.exports = {
  ParserCode
}