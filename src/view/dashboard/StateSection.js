// @flow

import React from 'react'
import StateList from './StateList'
import OpenModal from './OpenModal'
import './StateSection.css'

type State = {
  isModalShow: boolean,
}

class StateSection extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.state = {
      isModalShow: false,
    }
  }

  handleShow() {
    this.setState({
      isModalShow: true
    })
  }

  handleClose() {
    this.setState({
      isModalShow: false
    })
  }

  render() {
    const { isModalShow } = this.state

    return (
      <div className="state-section">
        <div className="state-info">
          <StateList />
        </div>
        <div className="add-state-block">
          <button id="add-state"
            onClick={this.handleShow.bind(this)}
          >
            + Add States
          </button>
          <OpenModal isModalShow={isModalShow}
            handleClose={this.handleClose.bind(this)}
          />
        </div>
      </div>
    )
  }
}

export default StateSection