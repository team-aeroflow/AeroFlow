import React from 'react'
import './Home.css'
import CreateProject from './CreateProject'
import { router } from '../../router'

const electron = window.require('electron')
const remote = electron.remote
const mainProcess = remote.require('./main.js')
const ipcRenderer = electron.ipcRenderer



class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showDialog: false
    }
  }

  isOpenNewProject() {
    this.setState(prevState => {
      return {
        ...prevState,
        showDialog: !this.state.showDialog
      }
    })
  }

  onOpenExistProjectClick() {
    // mainProcess.openExistingProject()
    // ipcRenderer.once('open-project-reply', (event, arg) => {
    //   console.log(arg.meta)
    //   console.log(arg.tree)
    // })
    ipcRenderer.send('open-project', 'open project')
    router.navigate('read')
  }

  render() {
    const { showDialog } = this.state
    return (
      <div>
        <button onClick={this.isOpenNewProject.bind(this)}>New Project</button>
        {showDialog ? <CreateProject /> : null}
        <div>__________</div>
        <button onClick={this.onOpenExistProjectClick.bind(this)}>Open Existing...</button>
      </div>
    )
  }
}

export default Home