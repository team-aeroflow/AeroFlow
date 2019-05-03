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
      button: [],
      path: '',
      effects: [],
      point_to: []
    }
  }

  componentWillReceiveProps(props) {
    const { meta, path, tree, effects } = props
    if (this.props !== props) {
      console.log('props', props)
      this.setState(prevState => {
        return {
          ...prevState,
          path,
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
          path: arg.path,
          button: arg.tree,
          effects: arg.effects,
          effects: arg.effects.nodes,
          point_to: arg.effects.links
        }
      })
    })
  }

  onCodeClick(source) {
    const { path } = this.state
    console.log(source)
    // ipcRenderer.send('read-file', `${path}/${source}`)
    ipcRenderer.send('read-file', source)
    ipcRenderer.once('read-file-click', (event, arg) => {
      console.log(arg)
    })
  }

  render() {
    const { path, button, effects, point_to } = this.state

    return (
      <div className="dashboard">
        <StateSection />
        <GraphSection path={path}
          button={button}
          effects={effects}
          point_to={point_to}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { meta, path, tree, effects, effect_path } = state.dashboard
  return {
    meta,
    path,
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