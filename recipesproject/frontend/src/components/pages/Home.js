import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../layout/Navbar'
import RecipeList from '../recipe/RecipeList'
import { Link } from 'react-router-dom'
import {
  Typography,
  makeStyles,
  Grid,
  Button,
  Container,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {},
  hero: {
    position: 'relative',
    paddingTop: theme.spacing(16),
    paddingBottom: theme.spacing(12),
    [theme.breakpoints.only('xs')]: {
      paddingTop: theme.spacing(12),
      paddingBottom: theme.spacing(8),
    },
  },
  heroOverlay: {
    zIndex: '-1',
    position: 'absolute',
    top: '0',
    display: 'block',
    height: '100%',
    width: '100%',
    background:
      "url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940') center/cover no-repeat",
    '&::after': {
      position: 'absolute',
      top: '0',
      content: '""',
      display: 'block',
      height: '100%',
      width: '100%',
      background: theme.palette.primary.main,
      opacity: '0.8',
    },
  },
  header: {
    marginBottom: theme.spacing(2),
    color: '#fff',
    fontWeight: 'bold',
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.h5.fontSize,
      textAlign: 'center',
    },
  },
  secondHeader: {
    marginBottom: theme.spacing(4),
    color: '#fff',
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
  loginBtn: {
    background: '#fff',
    color: theme.palette.primary.main,
    '&:hover': {
      background: '#fff',
    },
  },
  registerBtn: {
    color: '#fff',
    borderColor: '#fff',
  },
}))

export default function Home() {
  const classes = useStyles()

  const { userLoading } = useSelector((state) => state.auth)
  return (
    <div className={classes.root}>
      <Navbar />
      <div className={classes.hero}>
        <Container maxWidth="md">
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
                className={classes.loginBtn}
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
                className={classes.registerBtn}
                variant="outlined"
                size="large"
                component={Link}
                to="/register"
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </Container>
        <div className={classes.heroOverlay}></div>
      </div>
      {userLoading ? null : (
        <Container maxWidth="md">
          <RecipeList />
        </Container>
      )}
    </div>
  )
}
