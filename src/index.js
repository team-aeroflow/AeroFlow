import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Root from './Root'
import * as serviceWorker from './serviceWorker'

import { RouteProvider } from 'react-router5'
import { router } from './router'
import { Provider } from 'react-redux'
import { store } from './state/store'

const App = () => (
  <Provider store={store}>
    <RouteProvider router={router}>
      <Root />
    </RouteProvider>
  </Provider>
)

router.start('')
ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
