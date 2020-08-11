import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Alert from '@material-ui/lab/Alert'
import {
  CircularProgress,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core/'
import { Link as RouterLink } from 'react-router-dom'
import { loginUser, clearErrors } from '../../actions/auth'
import Loader from '../layout/Loader'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    backgroundImage:
      'url(https://images.pexels.com/photos/1070053/pexels-photo-1070053.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    margin: theme.spacing(10, 6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(6, 2),
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function Login() {
  const classes = useStyles()

  const dispatch = useDispatch()
  const { authenticating, errors, isLoggedIn, userLoading } = useSelector(
    (state) => state.auth
  )

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleChange = (e, setState) => {
    setState(e.target.value)
  }
  const clearForm = () => {
    setUsername('')
    setPassword('')
  }
  const submitForm = (e) => {
    e.preventDefault()

    const input = {
      username,
      password,
      clearForm,
    }

    dispatch(loginUser(input))
  }

  useEffect(() => {
    dispatch(clearErrors())
  }, [])

  if (userLoading) {
    return <Loader />
  } else if (isLoggedIn) {
    return <Redirect to="/dashboard" />
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h4">
            Log In
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={(e) => submitForm(e)}
          >
            {errors ? (
              errors.data.non_field_errors ? (
                <Alert severity="error">{errors.data.non_field_errors}</Alert>
              ) : null
            ) : null}
            {errors ? (
              errors.data.username ? (
                <Alert severity="error">{errors.data.username}</Alert>
              ) : null
            ) : null}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              name="username"
              autoFocus
              value={username}
              onChange={(e) => handleChange(e, setUsername)}
            />
            {errors ? (
              errors.data.password ? (
                <Alert severity="error">{errors.data.password}</Alert>
              ) : null
            ) : null}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => handleChange(e, setPassword)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={authenticating}
            >
              {authenticating ? <CircularProgress /> : 'Sign In'}
            </Button>
            <Grid container justify="center">
              <Grid item>
                <Link component={RouterLink} to="/register">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  )
}
