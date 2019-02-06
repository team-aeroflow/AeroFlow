const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
const fs = require('fs')

const execSync = require('child_process').execSync
const { fork, spawn } = require('child_process')

const path = require('path')
const url = require('url')
const ipcMain = electron.ipcMain

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
  return directory[0]
}

exports.createProject = (name) => {
  const path = this.getDirectoryPath()
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
  console.log(arg)
  if (fs.lstatSync(arg).isDirectory()) {
    return;
  }
  const code = fs.readFileSync(arg).toString()
  event.sender.send('read-file-click', code)

  fs.watchFile(arg, (cur, prev) => {
    const content = fs.readFileSync(arg).toString()
    event.sender.send('watch-file-response', content)
    console.log(content)
  })
})

ipcMain.on('open-project', (event, arg) => {
  const getPath = this.getDirectoryPath()
  const tree = this.getFileList(getPath)
  const metaPath = `${getPath}/src/state/__state__/`
  if (tree === undefined || !fs.existsSync(metaPath)) {
    console.log('No such file or directory')
    event.sender.send('open-project-reply', {
      success: false
    })
    return;
  }
  const meta = this.readFileFromUser(metaPath, 'meta.json')

  // console.log(arg) // prints "open project" 
  console.log(tree)
  event.sender.send('open-project-reply', {
    success: true
  })
  event.sender.send('dashboard', {
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