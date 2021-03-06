// @flow

import React from 'react'
import Graph from './Graph'
import './GraphSection.css'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

type linkType = {
  source: string,
  target: string,
}

type nodeType = {
  effect: string,
  functionName: string,
  id: string,
  name: string,
  params: Array<string>,
  path: string,
  point_to: string,
  type: string,
}

type Props = {
  projectPath: string,
  button: Array<string>,
  effects: Array<nodeType>,
  point_to: Array<linkType>,
  graph: Object,
}

class GraphSection extends React.Component<Props> {
  onCodeClick(source: string) {
    // const { path } = this.props
    console.log(source)
    // ipcRenderer.send('read-file', `${path}/${source}`)
    ipcRenderer.send('read-file', source)
    ipcRenderer.once('read-file-click', (event, arg) => {
      console.log(arg)
    })
  }

  render() {
    const {
      projectPath,
      button,
      effects,
      point_to,
      graph
    } = this.props

    return (
      <div className="graph-section"
        style={{ width: '100%', overflow: 'auto' }}
      >
        {"Project Name"}
        <span style={{ display: 'block', fontSize: '14px' }}>PATH: {projectPath}</span>
        <Graph graph={graph} />
        {/* {
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
        } */}
      </div>
    )
  }
}

export default GraphSection