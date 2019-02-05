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

exports.getFileTree = (path) => {
  const tree = execSync(`cd ${path}/src && tree`, { encoding: 'utf-8' })
  return tree
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

exports.openExistingProject = () => {
  const getPath = this.getDirectoryPath()
  const tree = this.getFileTree(getPath)
  const metaPath = `${getPath}/src/state/__state__/`
  const meta = this.readFileFromUser(metaPath, 'meta.json')

  // console.log(tree)
  // ipcMain.on('file-tree', (event, arg) => {
  //   console.log(arg)
  //   // event.sender.send('file-tree-reply', 'kuay')
  //   // event.sender.send('asynchronous-reply', 'async pong')
  // })
}

ipcMain.once('open-project', (event, arg) => {
  const getPath = this.getDirectoryPath()
  const tree = this.getFileTree(getPath)
  const metaPath = `${getPath}/src/state/__state__/`
  const meta = this.readFileFromUser(metaPath, 'meta.json')

  console.log(arg) // prints "open project" 

  event.sender.send('open-project-reply', { tree, meta })
})



function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegrationInWorker: true
    },
    width: 800,
    height: 600
  })
  // mainWindow.webContents.send('data', { msg: 'hello from main process' })

  // mainWindow.webContents.send('data', { msg: 'hello from main process' })
  // mainWindow.webContents.once('dom-ready', () => {
  //   win.webContents
  //     .send('sum-request', 23, 98, 3, 61)
  //   ipcMain.once('sum-reply', (event, sum) => {
  //     doJobWithResult(sum)
  //   })
  // })

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