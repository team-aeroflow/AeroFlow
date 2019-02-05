import React from 'react'
const electron = window.require('electron')
const remote = electron.remote
const mainProcess = remote.require('./main.js')
const ipcRenderer = electron.ipcRenderer

class Dashboard extends React.Component {
  componentDidMount() {
    ipcRenderer.once('open-project-reply', (event, arg) => {
      console.log(arg.meta)
      console.log(arg.tree)
    })
  }
  render() {
    return (
      <div>
        DASHBOARD
      </div>
    )
  }
}

export default Dashboard