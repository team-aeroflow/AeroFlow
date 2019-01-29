import React, { Component } from 'react'
import './Root.css'

import { RouteNode } from 'react-router5'

class Root extends Component {
  renderChild(route) {
    console.log(route.name)
    if (route.name === 'home') {
      return '1'
    } else if (route.name === 'read') {
      return '2'
    }
  }

  render() {
    return (
      <div className="Root">
        <RouteNode nodeName="">
          {(context) => this.renderChild(context.route)}
        </RouteNode>
      </div>
      // <div className="App">
      //   <header className="App-header">
      //     <p>
      //       Edit <code>src/App.js</code> and save to reload.
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div>
    )
  }
}

export default Root
