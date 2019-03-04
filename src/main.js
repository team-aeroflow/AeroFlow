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
  if(path === undefined) {
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
    console.log(tree)
    let code = ''
    if (fs.existsSync(name)) {
      if (!fs.lstatSync(name).isDirectory()) {
        code = fs.readFileSync(name).toString()
      }
    } else { // in case delete file
      code = 'file delete'
    }

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
