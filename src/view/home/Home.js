import React from 'react'
import './Home.css'
import CreateProject from './CreateProject'

const electron = window.require('electron')
const remote = electron.remote
const mainProcess = remote.require('./main.js')

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showDialog: false
    }
  }

  onNewProjectClick() {
    // mainProcess.getDirectoryPath()
    this.setState(prevState => {
      return {
        ...prevState,
        showDialog: !this.state.showDialog
      }
    })

  }

  render() {
    const { showDialog } = this.state
    return (
      <div>
        <button onClick={this.onNewProjectClick.bind(this)}>New Project</button>
        {showDialog ? <CreateProject /> : null}
        <div>__________</div>
        <button>Open Existing...</button>
      </div>
    )
  }
}

export default Home