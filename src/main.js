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
    console.log('message from fork', message) // path, name
  })
}

exports.readFileFromUser = (_path, fileName) => {
  const filePath = path.resolve(_path, `${fileName}`)
  const code = fs.readFileSync(filePath).toString()
  return code
}

ipcMain.once('read-file', (event, arg) => {
  // console.log('arg', arg)
  if (fs.lstatSync(arg).isDirectory()) {
    return;
  }
  const code = fs.readFileSync(arg).toString()
  event.sender.send('read-file-click', code)
})

ipcMain.on('watch-file', (event, arg) => {
  // console.log('arg', arg.effects)
  let self = this
  const p = arg.path
  // console.log('p', p)
  watch(p, { recursive: true }, (evt, name) => {
    const tree = self.getFileList(p)
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

    if (name.match(/(\w+)\/src\/state\/(\w+)\/effects\/(\w+)\.js/) && !utils.isInArray(name, effectPath)) {
      effectPath.push(name)
    } else if (name.match(/(\w+)\/src\/state\/(\w+)\/actions\/(\w+)\.js/) && !utils.isInArray(name, actionPath)) {
      actionPath.push(name)
    }
    // console.log(effectPath)
    if (code === 'file delete') {
      // TODO: fix bug if delete action
      utils.removeItem(name, effectPath)
    }
    // console.log(effectPath)
    utils.clearMeta()
    const n = {}
    n.effects = effectPath
    n.actions = actionPath
    // console.log(n)
    utils.collectEffect(n)

    console.log('117', utils.meta)

    event.sender.send('watch-file-response', {
      code,
      path: p,
      tree,
      effects: utils.meta
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


ipcMain.on('create-project', (event, arg) => {
  const getPath = this.getDirectoryPath()
  if (getPath === undefined) {
    return
  }
  const process = fork(`${__dirname}/worker.js`)
  // send to forked process
  process.send({
    path: getPath,
    name: arg
  })
  // listen for messages from forked process
  process.on('message', (message) => {
    console.log('message from fork', message) // path, name
    const tree = this.getFileList(message)
    const metaPath = `${message}/src/state/__state__/`
    const meta = this.readFileFromUser(metaPath, 'meta.json')

    const effectPath = []
    const actionPath = []

    utils.clearMeta()
    tree.map((t) => {
      if (t.match(/src\/state\/(\w+)\/effects\/(\w+)\.js/)) {
        effectPath.push(`${getPath}/${t}`)
      } else if (t.match(/src\/state\/(\w+)\/actions\/(\w+)\.js/)) {
        actionPath.push(`${getPath}/${t}`)
      }
    })
    const n = {}
    n.effects = effectPath
    n.actions = actionPath
    utils.collectEffect(n)
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
  const effectPath = []
  const actionPath = []

  utils.clearMeta()
  tree.map((t) => {
    if (t.match(/src\/state\/(\w+)\/effects\/(\w+)\.js/)) {
      effectPath.push(`${getPath}/${t}`)
    } else if (t.match(/src\/state\/(\w+)\/actions\/(\w+)\.js/)) {
      actionPath.push(`${getPath}/${t}`)
    }
  })
  const n = {}
  n.effects = effectPath
  n.actions = actionPath

  utils.collectEffect(n)
  // console.log('UUU', utils.meta)
  // effectPath.map((name) => {
  //   utils.collectEffect(path.resolve(name))
  // })

  // TODO: FIX BUG : effects: utils.meta
  event.sender.send('open-project-response', {
    success: true
  })
  event.sender.send('on-dashboard', {
    tree,
    meta,
    path: getPath,
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
