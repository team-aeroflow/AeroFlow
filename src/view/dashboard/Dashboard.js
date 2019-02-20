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
    //TODO: หลังจากที่ watch แล้ว เมื่อสร้างไฟล์ใหม่มา หรือลบไฟล์ ปุ่มก็ควรจะเพิ่ม/ลด ตามไฟล์ด้วย
    ipcRenderer.on('on-dashboard', (event, arg) => {
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
    //FIXME: watch file ถูก render เป็นเท่าตัวทุกๆครั้งที่มีการแก้ไขภายใน file
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

export default Dashboard