// @flow
import React from 'react'
import { connect } from 'react-redux'

type State = {
  keyToClose: Object,
}

type Props = {
  countMeta: Object,
}

class StateList extends React.Component<Props, State>{
  constructor(props) {
    super(props)
    this.state = {
      keyToClose: {}
    }
  }

  componentWillReceiveProps(props) {
    const { countMeta } = props
    const keyToClose = {}
    Object.keys(countMeta).map(meta => {
      keyToClose[meta] = true
    })
    this.setState(prevState => {
      return {
        ...prevState,
        keyToClose
      }
    })
  }
  // static getDerivedStateFromProps(props, state) {
  //   const { countMeta } = props
  //   const keyToClose = {}
  //   console.log(1)
  //   if (state !== props && countMeta !== undefined) {
  //     Object.keys(countMeta).map(meta => {
  //       keyToClose[meta] = true
  //     })
  //     // const keyToClose = Object.keys(countMeta).fill(1)
  //     return {
  //       ...state,
  //       keyToClose
  //     }
  //   } else {
  //     return state
  //   }
  // }

  toggle(key) {
    const { keyToClose } = this.state

    this.setState(prevState => {
      return {
        ...prevState,
        keyToClose: {
          ...prevState.keyToClose,
          [key]: !prevState.keyToClose[key]
        }
      }
    })
  }

  render() {
    const { keyToClose } = this.state
    const { countMeta } = this.props

    return (
      <div>
        {
          countMeta !== undefined && Object.keys(countMeta).map((key, i) => {
            return (
              <div key={i} className="state-block" >
                <div className="state-name-block" onClick={this.toggle.bind(this, key)}>
                  <span>State: {key}</span>
                  <span >
                    {keyToClose[key] ? '-' : '+'}
                  </span>
                </div>

                {
                  (keyToClose[key]) ?
                    (
                      <div className="state-block-info">
                        <p>
                          <span className="dot" id="dot-action"></span>
                          <span className="type">Actions </span>
                          <span className="count">{countMeta[key].actions}</span>
                        </p>
                        <p>
                          <span className="dot" id="dot-channel"></span>
                          <span className="type">Channels </span>
                          <span className="count">{countMeta[key].channels}</span>
                        </p>
                        <p>
                          <span className="dot" id="dot-effect"></span>
                          <span className="type">Effects </span>
                          <span className="count">{countMeta[key].effects}</span>
                        </p>
                        <p>
                          <span className="dot" id="dot-reducer"></span>
                          <span className="type">Reducers </span>
                          <span className="count">{countMeta[key].reducers}</span>
                        </p>
                      </div>
                    )
                    : null
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { countMeta } = state.dashboard
  return {
    countMeta,
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StateList)