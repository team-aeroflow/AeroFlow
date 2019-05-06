import React from 'react'
import Button from 'react-bootstrap/Button';
// import { Button } from 'react-bootstrap'
import './StateSection.css'
import OpenModal from './OpenModal'

class StateSection extends React.Component {
  constructor(props) {
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
    const { countMeta } = this.props
    return (
      <div className="state-section">
        <div className="state-info">
          {
            Object.keys(countMeta).map((key, i) => {
              return (
                <div key={i} className="state-block">
                  <h3>State : {key}</h3>
                  <p>
                    <span className="dot" id="dot-action"></span>
                    Actions {countMeta[key].actions}
                  </p>
                  <p>
                    <span className="dot" id="dot-channel"></span>
                    Channels {countMeta[key].channels}
                  </p>
                  <p>
                    <span className="dot" id="dot-effect"></span>
                    Effects {countMeta[key].effects}
                  </p>
                  <p>
                    <span className="dot" id="dot-reducer"></span>
                    Reducers {countMeta[key].reducers}
                  </p>
                </div>
              )
            })
          }
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