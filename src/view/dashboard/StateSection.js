import React from 'react'
import './StateSection.css'

class StateSection extends React.Component {
  
  render() {
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
                    <span className="dot" style={{ backgroundColor: 'red' }}></span>
                    Actions {countMeta[key].actions}
                  </p>
                  <p>
                    <span className="dot" style={{ backgroundColor: 'yellow' }}></span>
                    Channels {countMeta[key].channels}
                  </p>
                  <p>
                    <span className="dot" style={{ backgroundColor: 'green' }}></span>
                    Effects {countMeta[key].effects}
                  </p>
                  <p>
                    <span className="dot" style={{ backgroundColor: 'blue' }}></span>
                    Reducers {countMeta[key].reducers}
                  </p>
                </div>
              )
            })
          }
        </div>
        <div className="add-state-block">
          <div id="add-state"> + Add States</div>
        </div>
      </div>
    )
  }
}

export default StateSection