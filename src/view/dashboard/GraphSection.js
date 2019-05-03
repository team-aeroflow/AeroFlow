import React from 'react'
import './GraphSection.css'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

class GraphSection extends React.Component {
  onCodeClick(source) {
    const { path } = this.props
    console.log(source)
    // ipcRenderer.send('read-file', `${path}/${source}`)
    ipcRenderer.send('read-file', source)
    ipcRenderer.once('read-file-click', (event, arg) => {
      console.log(arg)
    })
  }

  render() {
    const {
      path,
      button,
      effects,
      point_to
    } = this.props

    const divStyles = {
      color: 'black',
      margin: 10,
      backgroundColor: 'blue',
      borderRadius: 10,
      cursor: 'pointer',
    }

    return (
      <div>
        Dashboard
        <span style={{ display: 'block', fontSize: '14px' }}>PATH: {path}</span>
        {
          effects.map((data, i) => {
            return (
              <div key={i} style={divStyles} onClick={this.onCodeClick.bind(this, data.path)}>
                <p>id {data.id}</p>
                <p>name {data.name}</p>
                <p>type {data.type}</p>
                <p>params {data.params}</p>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default GraphSection