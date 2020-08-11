import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../components/layout/Loader'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { userLoading, isLoggedIn } = useSelector((state) => state.auth)

  return (
    <Route
      {...rest}
      render={(props) => {
        if (userLoading) {
          return <Loader />
        } else if (!isLoggedIn) {
          return <Redirect to="/login" />
        } else {
          return <Component {...props} />
        }
      }}
    />
  )
}

export default PrivateRoute
