import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import PrivateRoute from '../common/PrivateRoute'
import { ThemeProvider } from '@material-ui/core/'
import { createMuiTheme } from '@material-ui/core/styles'
import deepPurple from '@material-ui/core/colors/deepPurple'

import store from '../store/'
import { loadUser } from '../actions/auth'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import RecipeDetail from './pages/RecipeDetail'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: deepPurple['A400'],
    },
  },
})

export default function App() {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <Route exact path="/recipe/:id" component={RecipeDetail} />
          </Switch>
        </Router>
      </ThemeProvider>
    </Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
