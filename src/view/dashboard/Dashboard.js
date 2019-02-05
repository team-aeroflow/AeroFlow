import React from 'react'
const electron = window.require('electron')
const remote = electron.remote
const mainProcess = remote.require('./main.js')
const ipcRenderer = electron.ipcRenderer

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      button: []
    }
  }
  componentDidMount() {
    ipcRenderer.on('dashboard', (event, arg) => {
      console.log(arg)
      console.log(arg.meta)
      console.log(arg.tree)
      console.log(arg.tree.split('\n'))
      this.setState(prevState => {
        return {
          ...prevState,
          button: arg.tree.split('\n').slice(0, -1)
        }
      })
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
                <button key={data}>{data}</button>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Dashboard