import createRouter from 'router5'
import browserPlugin from 'router5/plugins/browser'

const routes = [
  { name: 'home', path: '/' },
  { name: 'read', path: '/read' }
]

const options = {
  defaultRoute: 'home'
}

export const router = createRouter(routes, options)
  .usePlugin(browserPlugin({
    useHash: true
  }))