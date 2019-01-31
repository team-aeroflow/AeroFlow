import React from 'react'

const electron = window.require('electron')
const remote = electron.remote
// const ipcRenderer = electron.ipcRenderer
const mainProcess = remote.require('./main.js')

class CreateProject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projectName: ''
    }
  }

  onNameChange(e) {
    const projectName = e.target.value
    this.setState(prevState => {
      return {
        ...prevState,
        projectName
      }
    })
  }

  onNameSubmit() {
    const { projectName } = this.state
    mainProcess.createProject(projectName)
  }

  render() {
    return (
      <div style={{ backgroundColor: 'white', color: 'black' }}>
        <h2>Project Name</h2>
        {/* {console.log(mainProcess.getFileTree())} */}
        <input onChange={this.onNameChange.bind(this)}></input>
        <button onClick={this.onNameSubmit.bind(this)}>Create</button>
      </div>
    )
  }
}

export default CreateProject