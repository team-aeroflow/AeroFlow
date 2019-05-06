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

  static getDerivedStateFromProps(props, state) {
    const { meta, countMeta, projectPath, tree, effects } = props
    if (state !== props && effects !== undefined ) {
      return {
        ...state,
        countMeta,
        projectPath,
        button: tree,
        effects: effects.nodes,
        point_to: effects.links
      }
    } else {
      return state
    }
  }

  // componentWillReceiveProps(props) {
  //   const { meta, countMeta, projectPath, tree, effects } = props
  //   if (this.props !== props) {
  //     this.setState(prevState => {
  //       return {
  //         ...prevState,
  //         countMeta,
  //         projectPath,
  //         button: tree,
  //         effects: effects.nodes,
  //         point_to: effects.links
  //       }
  //     })
  //   }
  // }

  componentDidUpdate() {
    const { setDashboard } = this.props
    ipcRenderer.once('watch-file-response', (event, arg) => {
      setDashboard(arg)
    })
  }

  render() {
    const { projectPath, button, effects, point_to } = this.state

    return (
      <div className="dashboard">
        <StateSection />
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
    setDashboard: (payload) => {
      dispatch(dashboardActions.setDashboard(payload))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)