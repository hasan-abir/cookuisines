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
import { registerUser, clearErrors } from '../../actions/auth'
import Loader from '../layout/Loader'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage:
      'url(https://images.pexels.com/photos/1070053/pexels-photo-1070053.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(20, 6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(6, 2),
    },
  },
  header: {
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center',
    },
  },
  secondaryHeader: {
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center',
    },
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loginURL: {
    [theme.breakpoints.only('xs')]: {
      justifyContent: 'center',
    },
  },
}))

export default function Register() {
  const classes = useStyles()

  const dispatch = useDispatch()
  const { authenticating, errors, isLoggedIn, userLoading } = useSelector(
    (state) => state.auth
  )

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleChange = (e, setState) => {
    setState(e.target.value)
  }

  const clearForm = () => {
    setUsername('')
    setEmail('')
    setPassword('')
  }
  const submitForm = (e) => {
    e.preventDefault()

    const input = {
      username,
      email,
      password,
      clearForm,
    }

    dispatch(registerUser(input))
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
          <Typography component="h1" variant="h4" className={classes.header}>
            Create Your Account
          </Typography>
          <Typography
            component="p"
            variant="subtitle1"
            className={classes.secondaryHeader}
          >
            To be able to share recipes.
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={(e) => submitForm(e)}
          >
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
              errors.data.email ? (
                <Alert severity="error">{errors.data.email}</Alert>
              ) : null
            ) : null}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => handleChange(e, setEmail)}
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
              {authenticating ? <CircularProgress /> : 'Sign up'}
            </Button>
            <Grid container className={classes.loginURL}>
              <Grid item>
                <Link component={RouterLink} to="/login">
                  Already have an account? Sign In
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
    </Grid>
  )
}
