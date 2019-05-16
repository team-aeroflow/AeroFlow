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
const utils = require('./utils/readEffect')
const handleFile = require('./utils/handleFile')
const readMeta = require('./utils/readMeta')

let mainWindow

exports.openProject = () => {
  const directory = dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  if (directory === undefined) {
    return
  }
  return directory[0]
}

exports.createProject = (name) => {
  const path = this.openProject()
  if (path === undefined) {
    return
  }
  const process = fork(`${__dirname}/utils/worker.js`)
  // send to forked process
  process.send({
    path,
    name
  })
  // listen for messages from forked process
  process.on('message', (message) => {
    console.log('message from fork', message) // path, name
  })
}

/**
 * Creates a new State.
 * @param {Object} arg is StateName and ProjectPath.
 */
ipcMain.on('create-state', (event, arg) => {
  const process = fork(`${__dirname}/utils/createState.js`)
  process.send({
    arg
  })
  process.on('message', (message) => {
    console.log('message from fork', message)
  })
})

ipcMain.on('read-file', (event, arg) => {
  if (fs.lstatSync(arg).isDirectory()) {
    return;
  }
  const code = fs.readFileSync(arg).toString()
  console.log(code)
  event.sender.send('read-file-click', code)
})

ipcMain.once('watch-file', (event, arg) => {
  // console.log('arg', arg.effects)
  let self = this
  const p = arg.projectPath

  watch(p, { recursive: true }, (evt, name) => {
    const metaPath = `${p}/src/state/__state__/`
    const meta = handleFile.readFileFromUser(metaPath, 'meta.json')
    const countMeta = readMeta.countProperty(meta)
    // console.log(68, countMeta)
    const tree = handleFile.getFileList(p)
    console.log(evt, name)

    let code = ''
    if (fs.existsSync(name)) {
      if (!fs.lstatSync(name).isDirectory()) {
        code = fs.readFileSync(name).toString()
      }
    } else { // in case delete file
      code = 'file delete'
    }

    const effectPath = arg.effect_path
    const actionPath = arg.action_path

    const effectRegx = /(\w+)\/src\/state\/(\w+)\/effects\/(\w+)\.js/
    const actionsRegx = /(\w+)\/src\/state\/(\w+)\/actions\/index\.js/
    if (name.match(effectRegx) && !utils.isInArray(name, effectPath)) {
      effectPath.push(name)
    } else if (name.match(actionsRegx) && !utils.isInArray(name, actionPath)) {
      actionPath.push(name)
    }

    if (code === 'file delete') {
      // TODO: fix bug if delete action
      utils.removeItem(name, effectPath)
    }
    utils.clearMeta()
    const n = {}
    n.effects = effectPath
    n.actions = actionPath
    utils.collectEffect(n)

    console.log(110, utils.meta)
    event.sender.send('watch-file-response', {
      meta,
      countMeta,
      code,
      projectPath: p,
      tree,
      effects: utils.meta
    })
  })
})

// ipcMain.on('update-dashboard', (event, arg) => {
//   const lists = handleFile.getFileList(arg)
//   if (arg === null || lists === undefined) {
//     return
//   }
//   console.log('ARG', arg)
//   console.log('LIST', lists)
//   event.sender.send('on-dashboard', {
//     tree: lists,
//     path: arg
//   })
// })


ipcMain.on('create-project', (event, arg) => {
  const getPath = this.openProject()
  if (getPath === undefined) {
    return
  }
  const process = fork(`${__dirname}/utils/worker.js`)
  // send to forked process
  process.send({
    path: getPath,
    name: arg
  })
  // listen for messages from forked process
  process.on('message', (message) => {
    console.log('message from fork', message) // path, name
    const tree = handleFile.getFileList(message)
    const metaPath = `${message}/src/state/__state__/`
    const meta = handleFile.readFileFromUser(metaPath, 'meta.json')
    const effectPath = []
    const actionPath = []

    utils.clearMeta()

    const effectRegx = /(\w+)\/src\/state\/(\w+)\/effects\/(\w+)\.js/
    const actionsRegx = /(\w+)\/src\/state\/(\w+)\/actions\/index\.js/
    tree.map((t) => {
      if (t.match(effectRegx)) {
        effectPath.push(`${getPath}/${t}`)
      } else if (t.match(actionsRegx)) {
        actionPath.push(`${getPath}/${t}`)
      }
    })

    const n = {}
    n.effects = effectPath
    n.actions = actionPath
    utils.collectEffect(n)
    console.log(173, n)
    // effectPath.map((name) => {
    //   utils.collectEffect(path.resolve(name))
    // })

    // TODO: FIX BUG : effects: utils.meta
    event.sender.send('create-project-response', {
      success: true
    })
    event.sender.send('on-dashboard', {
      tree,
      meta,
      path: message,
      effect_path: effectPath,
      action_path: actionPath,
      effects: utils.meta
    })
  })
})

ipcMain.on('open-project', (event, arg) => {
  // const getPath = this.openProject()
  const getPath = '/Users/peerasorn/Desktop/finalproject'
  const tree = handleFile.getFileList(getPath)
  const metaPath = `${getPath}/src/state/__state__/`
  if (tree === undefined || !fs.existsSync(metaPath)) {
    // console.log('No such file or directory')
    event.sender.send('open-project-response', {
      success: false
    })
    return;
  }
  const meta = handleFile.readFileFromUser(metaPath, 'meta.json')
  const countMeta = readMeta.countProperty(meta)
  const effectPath = []
  const actionPath = []
  // console.log(meta)
  // console.log(196, countMeta)
  utils.clearMeta()
  const effectRegx = /src\/state\/(\w+)\/effects\/(\w+)\.js/
  const actionsRegx = /src\/state\/(\w+)\/actions\/index\.js/
  tree.map((t) => {
    if (t.match(effectRegx)) {
      effectPath.push(`${getPath}/${t}`)
    } else if (t.match(actionsRegx)) {
      actionPath.push(`${getPath}/${t}`)
    }
  })
  const n = {}
  n.effects = effectPath
  n.actions = actionPath

  utils.collectEffect(n)
  console.log(226, utils.meta)
  // TODO: FIX BUG : effects: utils.meta
  event.sender.send('open-project-response', {
    success: true
  })
  event.sender.send('on-dashboard', {
    tree,
    meta,
    countMeta,
    projectPath: getPath,
    effect_path: effectPath,
    action_path: actionPath,
    effects: utils.meta
  })
})

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegrationInWorker: true
    },
    width: 1300,
    height: 800
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
