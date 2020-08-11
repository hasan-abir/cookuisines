import {
  RECIPE_DETAIL,
  RECIPES_LOADING,
  GET_RECIPES,
  RECIPE_ADDING,
  ADD_RECIPE,
  RECIPE_DELETING,
  DELETE_RECIPE,
  RECIPE_EDITING,
  EDIT_RECIPE,
  RECIPE_ERRORS,
  CLEAR_RECIPE_ERRORS,
} from './types'
import { formatRecipe } from '../common/helpers'
import axios from 'axios'
import { tokenConfig } from './auth'

export const getRecipeDetail = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: RECIPES_LOADING })

    const res = await axios.get(`/api/recipes/${id}`, tokenConfig(getState))

    dispatch({
      type: RECIPE_DETAIL,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: RECIPE_ERRORS,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    })
  }
}

export const getRecipes = () => async (dispatch) => {
  try {
    dispatch({ type: RECIPES_LOADING })

    const res = await axios.get('/api/recipes/')

    dispatch({
      type: GET_RECIPES,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: RECIPE_ERRORS,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    })
  }
}

export const addRecipe = (input, clearForm) => async (dispatch, getState) => {
  try {
    const { ingredients, steps } = input

    dispatch({
      type: RECIPE_ADDING,
    })

    if (ingredients.length === 0) {
      return dispatch({
        type: RECIPE_ERRORS,
        payload: {
          status: 400,
          data: {
            ingredients: ['Need to provide at least one ingredient'],
          },
        },
      })
    }

    if (steps.length === 0) {
      return dispatch({
        type: RECIPE_ERRORS,
        payload: {
          status: 400,
          data: {
            steps: ['Need to provide at least one step'],
          },
        },
      })
    }

    const newRecipe = formatRecipe(input)

    const res = await axios.post(
      '/api/recipes/',
      newRecipe,
      tokenConfig(getState)
    )

    dispatch({
      type: ADD_RECIPE,
      payload: res.data,
    })

    clearForm()
  } catch (err) {
    dispatch({
      type: RECIPE_ERRORS,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    })
  }
}

export const deleteRecipe = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: RECIPE_DELETING,
    })

    await axios.delete(`/api/recipes/${id}`, tokenConfig(getState))

    dispatch({
      type: DELETE_RECIPE,
      payload: id,
    })
  } catch (err) {
    dispatch({
      type: RECIPE_ERRORS,
      payload: {
        status: err.response.status,
        data: err.response.data,
      },
    })
  }
}

export const editRecipe = (id, input, clearForm, setEditOpen) => async (
  dispatch,
  getState
) => {
  try {
    const { ingredients, steps } = input

    dispatch({
      type: RECIPE_EDITING,
    })

    if (ingredients.length === 0) {
      return dispatch({
        type: RECIPE_ERRORS,
        payload: {
          status: 400,
          data: {
            edit: {
              ingredients: ['Need to provide at least one ingredient'],
            },
          },
        },
      })
    }

    if (steps.length === 0) {
      return dispatch({
        type: RECIPE_ERRORS,
        payload: {
          status: 400,
          data: {
            edit: {
              steps: ['Need to provide at least one step'],
            },
          },
        },
      })
    }

    const existingRecipe = formatRecipe(input)

    const res = await axios.put(
      `/api/recipes/${id}/`,
      existingRecipe,
      tokenConfig(getState)
    )

    dispatch({
      type: EDIT_RECIPE,
      payload: res.data,
    })

    clearForm()
    setEditOpen(false)
  } catch (err) {
    dispatch({
      type: RECIPE_ERRORS,
      payload: {
        status: err.response.status,
        data: {
          edit: err.response.data,
        },
      },
    })
  }
}

export const clearErrors = () => {
  return {
    type: CLEAR_RECIPE_ERRORS,
  }
}
