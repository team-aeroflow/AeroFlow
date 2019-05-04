import React from 'react'
import { connect } from 'react-redux'
import { dashboardActions } from '../../state/dashboard/actions'
import StateSection from './StateSection'
import GraphSection from './GraphSection'
import './Dashboard.css'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      countMeta: {},
      button: [],
      projectPath: '',
      effects: [],
      point_to: []
    }
  }

  componentWillReceiveProps(props) {
    const { meta, countMeta, projectPath, tree, effects } = props
    if (this.props !== props) {
      console.log('props', props)
      this.setState(prevState => {
        return {
          ...prevState,
          countMeta,
          projectPath,
          button: tree,
          effects: effects.nodes,
          point_to: effects.links
        }
      })
    }
  }

  componentDidUpdate() {
    ipcRenderer.once('watch-file-response', (event, arg) => {
      console.log(arg)
      this.setState(prevState => {
        return {
          ...prevState,
          projectPath: arg.projectPath,
          countMeta: arg.countMeta,
          button: arg.tree,
          effects: arg.effects,
          effects: arg.effects.nodes,
          point_to: arg.effects.links
        }
      })
    })
  }

  onCodeClick(source) {
    const { projectPath } = this.state
    console.log(source)
    // ipcRenderer.send('read-file', `${path}/${source}`)
    ipcRenderer.send('read-file', source)
    ipcRenderer.once('read-file-click', (event, arg) => {
      console.log(arg)
    })
  }

  render() {
    const { projectPath, countMeta, button, effects, point_to } = this.state
    console.log(projectPath)
    return (
      <div className="dashboard">
        <StateSection countMeta={countMeta} />
        <GraphSection projectPath={projectPath}
          button={button}
          effects={effects}
          point_to={point_to}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { meta, countMeta, projectPath, tree, effects, effect_path } = state.dashboard
  return {
    meta,
    countMeta,
    projectPath,
    tree,
    effects,
    effect_path
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // setDashboard: (a) => {
    //   dispatch(dashboardActions.setDashboard(a))
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)