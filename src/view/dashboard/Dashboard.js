import React from 'react'
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
    const dashboardListener = ipcRenderer.on('dashboard', (event, arg) => {
      console.log(arg.path)
      this.setState(prevState => {
        return {
          ...prevState,
          path: arg.path,
          button: arg.tree
        }
      })
      ipcRenderer.send('watch-file', arg.path)
    })
  }

  componentDidUpdate() {
    console.log('update!')
    ipcRenderer.on('watch-file-response', (event, arg) => {
      console.log('response ...')
      console.log(arg)
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
    console.log(this.state.button)
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

export default Dashboard