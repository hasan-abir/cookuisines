import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../layout/Navbar'
import {
  Typography,
  makeStyles,
  Grid,
  CircularProgress,
} from '@material-ui/core'
import { getRecipeDetail } from '../../actions/recipe'
import FullRecipe from '../recipe/FullRecipe'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 6),
    paddingTop: theme.spacing(16),
    [theme.breakpoints.only('xs')]: {
      padding: theme.spacing(0, 2),
      paddingTop: theme.spacing(12),
    },
  },
}))

export default function Dashboard({ match }) {
  const classes = useStyles()

  const dispatch = useDispatch()
  const { recipeDetail, loading } = useSelector((state) => state.recipe)

  useEffect(() => {
    dispatch(getRecipeDetail(match.params.id))
  }, [])
  return (
    <div>
      <Navbar />
      <div className={classes.root}>
        {loading ? (
          <Grid container justify="center">
            <CircularProgress />
          </Grid>
        ) : recipeDetail ? (
          <FullRecipe recipe={recipeDetail} />
        ) : (
          <Typography component="h1" variant="h5" className={classes.header}>
            No recipe found :(
          </Typography>
        )}
      </div>
    </div>
  )
}
