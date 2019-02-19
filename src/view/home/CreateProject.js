import React from 'react'
import { homeActions } from '../../state/home/actions'
import { connect } from 'react-redux'

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
    this.props.createProject(projectName)
    // TODO: set Loading
    // TODO: route page after loading success
  }

  render() {
    // TODO: pop modal block and set gray background
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

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {
    createProject: (projectName) => {
      dispatch(homeActions.createProject(projectName))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject)