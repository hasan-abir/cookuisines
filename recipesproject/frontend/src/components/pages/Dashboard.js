import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../layout/Navbar'
import AddRecipe from '../recipe/AddRecipe'
import RecipeList from '../recipe/RecipeList'
import { makeStyles } from '@material-ui/core'

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

export default function Dashboard() {
  const classes = useStyles()

  const { userLoading } = useSelector((state) => state.auth)
  return (
    <div>
      <Navbar />
      <div className={classes.root}>
        <AddRecipe />
        {userLoading ? null : <RecipeList />}
      </div>
    </div>
  )
}
