const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
const fs = require('fs')

const execSync = require('child_process').execSync
const { fork, spawn } = require('child_process')

const path = require('path')
const url = require('url')

let mainWindow

exports.getFileTree = () => {
  const tree = execSync(`cd src && tree`, { encoding: 'utf-8' })
  return tree
}

exports.getFileFromUser = (fileName) => {
  const filePath = path.resolve(__dirname, `${fileName}`)
  const code = fs.readFileSync(filePath).toString()
  return code
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

exports.openExistingProject = () => {
  const path = this.getDirectoryPath()
  console.log(path)
}

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