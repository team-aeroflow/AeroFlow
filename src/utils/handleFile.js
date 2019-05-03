const fs = require('fs')
const execSync = require('child_process').execSync
const path = require('path')

function filterDirectory(_path, fileList) {
  const arrFile = []
  fileList.map((data, i) => {
    if (!fs.lstatSync(`${_path}/${data}`).isDirectory()) {
      arrFile.push(data)
    }
  })
  return arrFile
}

function getFileList(_path) {
  if (!fs.existsSync(`${_path}/src`)) {
    console.log('No such file or directory')
    return;
  }
  const fileList = execSync(`cd ${_path} && find src`, { encoding: 'utf-8' })
  return filterDirectory(_path, fileList.toString().split('\n').slice(0, -1))
}

function readFileFromUser(_path, fileName) {
  const filePath = path.resolve(_path, `${fileName}`)
  const code = fs.readFileSync(filePath).toString()
  return JSON.parse(code)
}


module.exports = {
  filterDirectory,
  getFileList,
  readFileFromUser,
}