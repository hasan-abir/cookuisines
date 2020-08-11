import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../layout/Navbar'
import RecipeList from '../recipe/RecipeList'
import { Link } from 'react-router-dom'
import { Typography, makeStyles, Grid, Button } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 6),
    paddingTop: theme.spacing(16),
    [theme.breakpoints.only('xs')]: {
      padding: theme.spacing(0, 2),
      paddingTop: theme.spacing(12),
    },
  },
  header: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.h5.fontSize,
      textAlign: 'center',
    },
  },
  secondHeader: {
    marginBottom: theme.spacing(4),
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center',
    },
  },
  buttonGrid: {
    marginTop: theme.spacing(4),
    [theme.breakpoints.only('xs')]: {
      justifyContent: 'center',
    },
  },
}))

export default function Home() {
  const classes = useStyles()

  const { userLoading } = useSelector((state) => state.auth)
  return (
    <div>
      <Navbar />
      <div className={classes.root}>
        <Typography component="h1" variant="h4" className={classes.header}>
          Cookuisines
        </Typography>
        <Typography
          component="p"
          variant="body1"
          className={classes.secondHeader}
        >
          An app where you can share recipes with everyone else. <br />
          You need to login or signup to be able to share, edit and delete
          recipes.
        </Typography>
        <Grid container className={classes.buttonGrid} spacing={3}>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              size="large"
              component={Link}
              to="/login"
            >
              Log In
            </Button>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="outlined"
              size="large"
              component={Link}
              to="/register"
            >
              Sign Up
            </Button>
          </Grid>
        </Grid>
        {userLoading ? null : <RecipeList />}
      </div>
    </div>
  )
}
