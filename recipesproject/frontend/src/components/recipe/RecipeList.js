import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getRecipes } from '../../actions/recipe'
import Recipe from './Recipe'
import {
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(12),
    [theme.breakpoints.only('xs')]: {
      paddingTop: theme.spacing(6),
    },
  },
  header: {
    fontWeight: 'bold',
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.h5.fontSize,
      textAlign: 'center',
    },
  },
  secondHeader: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.body1.fontSize,
      textAlign: 'center',
    },
  },
}))

export default function RecipeList() {
  const classes = useStyles()

  const dispatch = useDispatch()
  const { recipes, loading } = useSelector((state) => state.recipe)

  useEffect(() => {
    dispatch(getRecipes())
  }, [])
  return (
    <div className={classes.root}>
      {loading ? (
        <Grid container justify="center">
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Typography component="h1" variant="h4" className={classes.header}>
            Shared Recipes
          </Typography>
          <Typography
            component="p"
            variant="body1"
            className={classes.secondHeader}
          >
            By all users
          </Typography>
          {recipes.map((recipe) => {
            return <Recipe key={recipe.id} recipe={recipe} />
          })}
        </>
      )}
    </div>
  )
}
