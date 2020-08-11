import {
  AUTHENTICATED,
  AUTHENTICATING,
  AUTH_ERRORS,
  CLEAR_AUTH_ERRORS,
  USER_LOADING,
  USER_LOADED,
  LOGOUT_SUCCESS,
} from './types'
import axios from 'axios'

export const loadUser = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LOADING })

    const res = await axios.get('/api/auth/user', tokenConfig(getState))

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: AUTH_ERRORS,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    })
  }
}

export const registerUser = (input) => async (dispatch) => {
  try {
    dispatch({ type: AUTHENTICATING })

    const newUser = {
      username: input.username,
      email: input.email,
      password: input.password,
    }

    const res = await axios.post('/api/auth/register', newUser)

    input.clearForm()

    dispatch({
      type: AUTHENTICATED,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: AUTH_ERRORS,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    })
  }
}

export const loginUser = (input) => async (dispatch) => {
  try {
    dispatch({ type: AUTHENTICATING })

    const userInput = {
      username: input.username,
      password: input.password,
    }

    const res = await axios.post('/api/auth/login', userInput)

    input.clearForm()

    dispatch({
      type: AUTHENTICATED,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: AUTH_ERRORS,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    })
  }
}

export const logoutUser = () => async (dispatch, getState) => {
  try {
    await axios.post('/api/auth/logout', null, tokenConfig(getState))

    dispatch({
      type: LOGOUT_SUCCESS,
    })
  } catch (err) {
    dispatch({
      type: AUTH_ERRORS,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    })
  }
}

export const clearErrors = () => {
  return {
    type: CLEAR_AUTH_ERRORS,
  }
}

export const tokenConfig = (getState) => {
  const token = getState().auth.token

  const config = {
    headers: {},
  }

  if (token) {
    config.headers['Authorization'] = `Token ${token}`
  }

  return config
}
