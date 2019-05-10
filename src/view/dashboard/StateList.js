// @flow
import React from 'react'
import { connect } from 'react-redux'

type Props = {
  countMeta: Object,
}

class StateList extends React.Component<Props>{


  render() {
    const { countMeta } = this.props

    return (
      <div>
        {
          countMeta !== undefined && Object.keys(countMeta).map((key, i) => {
            return (
              <div key={i} className="state-block">
                <h3>
                  State : {key}
                </h3>
                <div>
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