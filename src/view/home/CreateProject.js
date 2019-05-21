// @flow

import React from 'react'
import { homeActions } from '../../state/home/actions'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import './CreateProject.css'

type State = {
  projectName: string,
}

type Props = {
  show: boolean,
  handleClose: () => void,
  createProject: (name: string) => void,
}

class CreateProject extends React.Component<Props, State> {
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
    const { show, handleClose } = this.props

    return (
      // <div style={{ backgroundColor: 'white', color: 'black' }}>
      //   <h2>Project Name</h2>
      //   {/* {console.log(mainProcess.getFileTree())} */}
      //   <input onChange={this.onNameChange.bind(this)}></input>
      //   <button onClick={this.onNameSubmit.bind(this)}>Create</button>
      // </div>
      <div className="modal-block">
        <Modal show={show}
          onHide={handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Create Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span>Project name</span>
            <input id="modal-input"
              onChange={this.onNameChange.bind(this)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary"
              onClick={handleClose}
            >
              Close
           </Button>
            <Button variant="primary"
              onClick={this.onNameSubmit.bind(this)}
            >
              Create
           </Button>
          </Modal.Footer>
        </Modal>
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