import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../layout/Navbar'
import AddRecipe from '../recipe/AddRecipe'
import RecipeList from '../recipe/RecipeList'
import { makeStyles, Container } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(16),
    [theme.breakpoints.only('xs')]: {
      paddingTop: theme.spacing(12),
    },
  },
}))

export default function Dashboard() {
  const classes = useStyles()

  const { userLoading } = useSelector((state) => state.auth)
  return (
    <Container maxWidth="md">
      <Navbar />
      <div className={classes.root}>
        <AddRecipe />
        {userLoading ? null : <RecipeList />}
      </div>
    </Container>
  )
}
