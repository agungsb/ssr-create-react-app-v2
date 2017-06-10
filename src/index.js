import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import configureStore from './store'
import './index.css'
import App from './containers/App'
import ApiClient from './ApiClient'

import FirstPage from './containers/FirstPage'
import SecondPage from './containers/SecondPage'
import NoMatch from './components/NoMatch'

const routes = [
  {
    path: '/',
    exact: true,
    component: FirstPage
  },
  {
    path: '/second',
    component: SecondPage,
  },
  {
    component: NoMatch
  }
]

// Let the reducers handle initial state
const initialState = {};
const client = new ApiClient();
const store = configureStore(client, initialState)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App routes={routes} initialData={window.DATA} />
    </BrowserRouter>
  </Provider>
  , document.getElementById('root')
)


