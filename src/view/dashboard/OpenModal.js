// @flow 

import React from 'react'
import { connect } from 'react-redux'
import { dashboardActions } from '../../state/dashboard/actions'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import './OpenModal.css'

type State = {
  name: string,
  projectPath: string,
}

type Props = {
  isModalShow: boolean,
  handleClose: boolean,
  handleClose: () => void,
  createState: (name: string, projectPath: string) => void,
}

class OpenModal extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      projectPath: ''
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { projectPath } = props
    if (state !== props && projectPath !== undefined) {
      return {
        ...state,
        projectPath
      }
    } else {
      return state
    }
  }

  onNameChange(evt) {
    this.setState({
      name: evt.target.value
    })
  }

  submitName() {
    const { name, projectPath } = this.state
    const { createState, handleClose } = this.props
    handleClose()
    createState(name, projectPath)
  }


  render() {
    const {
      isModalShow,
      handleClose,
    } = this.props
    console.log(this.state)
    return (
      <div className="modal-block">
        <Modal show={isModalShow}
          onHide={handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Create State</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span>State name</span>
            <input id="modal-input"
              type="text"
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
              onClick={this.submitName.bind(this)}
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
  const { projectPath } = state.dashboard
  return {
    projectPath,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createState: (name, projectPath) => {
      dispatch(dashboardActions.createState(name, projectPath))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenModal)