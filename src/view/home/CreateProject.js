import React from 'react'

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
    fetch('http://localhost:3003/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: projectName
      })
    })
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