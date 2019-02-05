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
      code: ''
    }
  }

  componentDidMount() {
    // ต้องใช้ path เดิมหลังจากที่ open project มาแล้ว ดังนั้นแล้วเราจะนำ path นั้นไปเก็บอย่างไรดี
    ipcRenderer.on('dashboard', (event, arg) => {
      console.log(arg.path)
      this.setState(prevState => {
        return {
          ...prevState,
          path: arg.path,
          button: arg.tree.split('\n').slice(0, -1)
        }
      })
    })
  }

  onCodeClick(source) {
    const { path } = this.state
    ipcRenderer.send('read-file', `${path}/${source}`)
    ipcRenderer.on('read-file-response', (event, arg) => {
      console.log(arg)
    })
  }

  render() {
    console.log(this.state.button)
    const { button, code } = this.state
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
        <textarea disabled={true} value={code} style={{ fontSize: '11pt' }}></textarea>

      </div>
    )
  }
}

export default Dashboard