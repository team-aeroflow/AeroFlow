const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
const ipcMain = electron.ipcMain
const os = require('os')
const fs = require('fs')
const path = require('path')
const url = require('url')
const watch = require('node-watch')
const flow = require('flow-parser')

const execSync = require('child_process').execSync
const { fork, spawn } = require('child_process')

let mainWindow

filterDirectory = (_path, fileList) => {
  const arrFile = []
  fileList.map((data, i) => {
    if (!fs.lstatSync(`${_path}/${data}`).isDirectory()) {
      arrFile.push(data)
    }
  })
  return arrFile
}

exports.getFileList = (path) => {
  if (!fs.existsSync(`${path}/src`)) {
    console.log('No such file or directory')
    return;
  }
  const fileList = execSync(`cd ${path} && find src`, { encoding: 'utf-8' })
  return filterDirectory(path, fileList.toString().split('\n').slice(0, -1))
}

exports.getDirectoryPath = () => {
  const directory = dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  if (directory === undefined) {
    return
  }
  return directory[0]
}

exports.createProject = (name) => {
  const path = this.getDirectoryPath()
  if (path === undefined) {
    return
  }
  const process = fork(`${__dirname}/worker.js`)
  // send to forked process
  process.send({
    path,
    name
  })
  // listen for messages from forked process
  process.on('message', (message) => {
    console.log('message from fork', message)
  })
}

exports.readFileFromUser = (_path, fileName) => {
  const filePath = path.resolve(_path, `${fileName}`)
  const code = fs.readFileSync(filePath).toString()
  return code
}

ipcMain.on('read-file', (event, arg) => {
  // console.log('arg', arg)
  if (fs.lstatSync(arg).isDirectory()) {
    return;
  }
  const code = fs.readFileSync(arg).toString()
  event.sender.send('read-file-click', code)
})

ipcMain.once('watch-file', (event, arg) => {
  let self = this
  watch(arg, { recursive: true }, (evt, name) => {
    const tree = self.getFileList(arg)
    // console.log(tree)
    let code = ''
    if (fs.existsSync(name)) {
      if (!fs.lstatSync(name).isDirectory()) {
        code = fs.readFileSync(name).toString()
      }
    } else { // in case delete file
      code = 'file delete'
    }

    // WATCH EFFECT HERE
    const meta = []
    if (name.match(/state\/(\w+)\/effects\/(\w+)\.js/)) {
      // console.log('watch', name)
      console.log('watch', path.resolve(name))
      const filePath = path.resolve(name)
      const content = fs.readFileSync(filePath).toString()
      const f = flow.parse(content, {})
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

      console.log(meta)
    }




    // END OF WATCH EFFECT


    event.sender.send('watch-file-response', {
      code,
      path: arg,
      tree
    })
  })
})

ipcMain.on('update-dashboard', (event, arg) => {
  const lists = this.getFileList(arg)
  if (arg === null || lists === undefined) {
    return
  }
  console.log('ARG', arg)
  console.log('LIST', lists)
  event.sender.send('on-dashboard', {
    tree: lists,
    path: arg
  })
})

ipcMain.on('open-project', (event, arg) => {
  const getPath = this.getDirectoryPath()
  const tree = this.getFileList(getPath)
  const metaPath = `${getPath}/src/state/__state__/`
  if (tree === undefined || !fs.existsSync(metaPath)) {
    // console.log('No such file or directory')
    event.sender.send('open-project-response', {
      success: false
    })
    return;
  }
  const meta = this.readFileFromUser(metaPath, 'meta.json')

  event.sender.send('open-project-response', {
    success: true
  })
  event.sender.send('on-dashboard', {
    tree,
    meta,
    path: getPath
  })
})

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegrationInWorker: true
    },
    width: 800,
    height: 600
  })
  mainWindow.loadURL('http://localhost:3000')
  mainWindow.webContents.openDevTools()
  BrowserWindow.addDevToolsExtension(
    path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0')
  )

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}


app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
