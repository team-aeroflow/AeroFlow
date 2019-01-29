import React, { Component } from 'react'
import './Root.css'

import { RouteNode } from 'react-router5'
import Home from './view/home/Home'

class Root extends Component {
  renderChild(route) {
    console.log(route.name)
    if (route.name === 'home') {
      return <Home />
    } else if (route.name === 'read') {
      return '2'
    }
  }

  render() {
    return (
      <div className="Root App-header">
        <RouteNode nodeName="">
          {(context) => this.renderChild(context.route)}
        </RouteNode>
      </div>
    )
  }
}

export default Root
