const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
const fs = require('fs')

const execSync = require('child_process').execSync

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

function createWindow() {
  mainWindow = new BrowserWindow({ 
    width: 800, 
    height: 600
  })

  mainWindow.loadURL('http://localhost:3000')
  // mainWindow.loadURL(url.format({
  //   pathname: path.resolve(__dirname, '../build/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))

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