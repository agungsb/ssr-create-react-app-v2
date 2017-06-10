const path = require('path')
const fs = require('fs')

const React = require('react')
const { Provider } = require('react-redux')
const { renderToString } = require('react-dom/server')
const { StaticRouter } = require('react-router-dom')

const { default: configureStore } = require('../src/store')
import ApiClient from '../src/ApiClient';
const { default: App } = require('../src/containers/App')
import FirstPage from '../src/containers/FirstPage'
import SecondPage from '../src/containers/SecondPage'
import NoMatch from '../src/components/NoMatch'

import { matchPath } from 'react-router-dom'

const routes = [
  {
    path: '/',
    exact: true,
    component: FirstPage,
  },
  {
    path: '/second',
    component: SecondPage,
  },
  {
    component: NoMatch
  }
]

module.exports = function universalLoader(req, res) {
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html')

  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err)
      return res.status(404).end()
    }

    // we'd probably want some recursion here so our routes could have
    // child routes like `{ path, component, routes: [ { route, route } ] }`
    // and then reduce to the entire branch of matched routes, but for
    // illustrative purposes, sticking to a flat route config
    const matches = routes.reduce((matches, route) => {
      const match = matchPath(req.url, route.path, route)
      if (match) {
        matches.push({
          route,
          match,
          promise: route.component.fetchData ?
            route.component.fetchData(match) : Promise.resolve(null)
        })
      }
      return matches
    }, [])

    if (matches.length === 0) {
      res.status(404)
    }

    const promises = matches.map((match) => match.promise)

    Promise.all(promises).then(data => {
      // do something w/ the data so the client
      // can access it then render the app
      console.log('data', data[0]);
      const context = {}
      const client = new ApiClient();
      const store = configureStore(client)
      const markup = renderToString(
        <Provider store={store}>
          <StaticRouter
            location={req.url}
            context={context}
          >
            <App routes={routes} initialData={data[0]} />
          </StaticRouter>
        </Provider>
      )

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        redirect(301, context.url)
      } else {
        // we're good, send the response
        const RenderedApp = htmlData.replace('{{SSR}}', markup).replace('{{WINDOW_DATA}}', JSON.stringify(data[0]));
        res.send(RenderedApp)
      }
    }, (error) => {
      handleError(res, error)
    })
  })
}

