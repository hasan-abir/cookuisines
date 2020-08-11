import {
  AUTHENTICATING,
  AUTHENTICATED,
  AUTH_ERRORS,
  CLEAR_AUTH_ERRORS,
  USER_LOADED,
  USER_LOADING,
  LOGOUT_SUCCESS,
} from '../actions/types'

const initialState = {
  userLoading: true,
  authenticating: false,
  isLoggedIn: false,
  errors: null,
  token: localStorage.getItem('token'),
  user: null,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        userLoading: true,
      }
    case USER_LOADED:
      return {
        ...state,
        userLoading: false,
        isLoggedIn: true,
        user: action.payload,
      }
    case AUTHENTICATING:
      return {
        ...state,
        authenticating: true,
        errors: null,
      }
    case AUTHENTICATED:
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        isLoggedIn: true,
        authenticating: false,
        errors: null,
        user: action.payload.user,
        token: action.payload.token,
      }
    case LOGOUT_SUCCESS:
      localStorage.removeItem('token')
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        user: null,
      }
    case AUTH_ERRORS:
      return {
        ...state,
        authenticating: false,
        userLoading: false,
        errors: action.payload,
      }
    case CLEAR_AUTH_ERRORS:
      return {
        ...state,
        errors: null,
      }
    default:
      return state
  }
}
