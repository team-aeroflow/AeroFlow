import React from 'react'
import { connect } from 'react-redux'
import { dashboardActions } from '../../state/dashboard/actions'

const electron = window.require('electron')
const remote = electron.remote
const mainProcess = remote.require('./main.js')
const ipcRenderer = electron.ipcRenderer

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      button: [],
      path: '',
    }
  }

  componentDidMount() {
    // this.props.setDashboard()
    // ipcRenderer.on('on-dashboard', (event, arg) => {
    //   this.setState(prevState => {
    //     return {
    //       ...prevState,
    //       path: arg.path,
    //       button: arg.tree
    //     }
    //   })
    //   ipcRenderer.send('watch-file', arg.path)
    // })
  }

  componentDidUpdate() {
    ipcRenderer.once('watch-file-response', (event, arg) => {
      // console.log(arg)
      console.log(arg.code)
      this.setState(prevState => {
        return {
          ...prevState,
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
    // console.log(this.state.button)
    const { button } = this.state
    return (
      <div>
        DASHBOARD
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
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {
    setDashboard: () => {
      dispatch(dashboardActions.setDashboard())
    }
  }
}

export default Dashboard