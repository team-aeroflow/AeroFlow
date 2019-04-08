import React from 'react'
import { connect } from 'react-redux'
import { dashboardActions } from '../../state/dashboard/actions'
import { prev } from 'locutus/php/array';

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      button: [],
      path: '',
    }
  }

  componentWillReceiveProps(props) {
    const { meta, path, tree } = props
    if (this.props !== props) {
      // console.log(tree)
      this.setState(prevState => {
        return {
          ...prevState,
          path,
          button: tree,
        }
      })
    }
  }

  componentDidUpdate() {
    ipcRenderer.once('watch-file-response', (event, arg) => {
      console.log(arg.tree)
      this.setState(prevState => {
        return {
          ...prevState,
          path: arg.path,
          button: arg.tree
        }
      })
    })
  }

  onCodeClick(source) {
    const { path } = this.state
    ipcRenderer.send('read-file', `${path}/${source}`)
    ipcRenderer.on('read-file-click', (event, arg) => {
      console.log(arg)
    })
  }

  render() {
    const { path, button } = this.state
    return (
      <div>
        DASHBOARD
        <span style={{ display: 'block', fontSize: '14px' }}>PATH: {path}</span>
        {
          button.map((data, i) => {
            return (
              <div key={`${data}_${i}`}>
                <button key={data} onClick={this.onCodeClick.bind(this, data)}>{data}</button>
              </div>
            )
          })
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { meta, path, tree } = state.dashboard
  return {
    meta,
    path,
    tree
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