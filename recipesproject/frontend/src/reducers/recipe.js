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
} from '../actions/types'

const initialState = {
  loading: true,
  recipeDetail: null,
  recipes: [],
  editing: false,
  adding: false,
  deleting: false,
  errors: null,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case RECIPE_DETAIL:
      return {
        ...state,
        loading: false,
        recipeDetail: action.payload,
        errors: null,
      }
    case RECIPES_LOADING:
      return {
        ...state,
        loading: true,
      }
    case GET_RECIPES:
      return {
        ...state,
        loading: false,
        recipes: action.payload,
        errors: null,
      }
    case RECIPE_ADDING:
      return {
        ...state,
        adding: true,
        errors: null,
      }
    case ADD_RECIPE:
      return {
        ...state,
        recipes: [action.payload, ...state.recipes],
        adding: false,
      }
    case RECIPE_DELETING:
      return {
        ...state,
        deleting: true,
        errors: null,
      }
    case DELETE_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes].filter(
          (recipe) => recipe.id !== action.payload
        ),
        deleting: false,
      }
    case RECIPE_EDITING:
      return {
        ...state,
        editing: true,
        errors: null,
      }
    case EDIT_RECIPE:
      const allRecipes = [...state.recipes]

      const index = allRecipes.findIndex(
        (recipe) => recipe.id === action.payload.id
      )

      allRecipes[index] = action.payload
      return {
        ...state,
        recipes: allRecipes,
        editing: false,
      }
    case RECIPE_ERRORS:
      return {
        ...state,
        errors: action.payload,
        adding: false,
        deleting: false,
        editing: false,
        loading: false,
      }
    case CLEAR_RECIPE_ERRORS:
      return {
        ...state,
        errors: null,
      }
    default:
      return state
  }
}
