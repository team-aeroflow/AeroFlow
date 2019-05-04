import React from 'react'
import './StateSection.css'

class StateSection extends React.Component {
  render() {
    const { countMeta } = this.props
    // console.log(countMeta)
    return (
      <div className="state-section">
        {
          Object.keys(countMeta).map((key, i) => {
            return (
              <div key={i}>
                <h3>State : {key}</h3>
                <p>Actions {countMeta[key].actions}</p>
                <p>Channels {countMeta[key].channels}</p>
                <p>Effects {countMeta[key].effects}</p>
                <p>Reducers {countMeta[key].reducers}</p>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default StateSection