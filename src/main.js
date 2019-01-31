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
  // send list of e-mails to forked process
  process.send({
    path,
    name
  })
  // listen for messages from forked process
  process.on('message', (message) => {
    console.log(message)
  })

  // let serverProc = require('child_process').fork(
  //   require.resolve('./worker.js'),
  //   ['--key', 'value'], // pass to process.argv into child
  //   {
  //     // options
  //   }
  // )
  // serverProc.on('exit', (code, sig) => {
  //   // finishing
  // })
  // serverProc.on('error', (error) => {
  //   // error handling
  // })
  // execSync(`cd ${path} && npx create-react-app ${name}`, { encoding: 'utf-8' })
  // execSync(`cd ${path}/${name} && npm install --save-dev yo @tanawat/generator-redux-plus`, { encoding: 'utf-8' })
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
  // const n = cp.fork(`${__dirname}/worker.js`);

  // n.on('message', (m) => {
  //   console.log('PARENT got message:', m);
  // });
  // n.send({ hello: 'world' });
  // mainWindow.loadURL(url.format({
  //   pathname: path.resolve(__dirname, '../build/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))
  // fork another process
  // const process = fork(path.resolve(__dirname, './worker.js'))
  // // send list of e-mails to forked process
  // process.send({ mails: 'peerasorn' });
  // // listen for messages from forked process
  // process.on('message', (message) => {
  //   console.log(`Number of mails sent ${message}`);
  // });

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