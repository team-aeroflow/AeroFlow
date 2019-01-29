import React from 'react'
import './Home.css'
import CreateProject from './CreateProject'

class Home extends React.Component {
  render() {
    return (
      <div>
        <button>New Project</button>
        <CreateProject />
        <div>__________</div>
        <button>Open Existing...</button>
      </div>
    )
  }
}

export default Home