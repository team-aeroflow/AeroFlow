import React from 'react'

const electron = window.require('electron')
const remote = electron.remote
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
    console.log(this.state.projectName)
    const { projectName } = this.state
    // console.log(mainProcess.getFileTree())
    console.log(mainProcess.getFileFromUser(projectName))
  }

  render() {
    return (
      <div style={{backgroundColor: 'white', color: 'black'}}>
        <h2>Project Name</h2>
        <input onChange={this.onNameChange.bind(this)}></input>
        <button onClick={this.onNameSubmit.bind(this)}>Create</button>
      </div>
    )
  }
}

export default CreateProject