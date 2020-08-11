import React from 'react'
import { Grid, makeStyles, CircularProgress } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export default function Loader() {
  const classes = useStyles()

  return (
    <Grid container component="main" className={classes.root}>
      <CircularProgress />
    </Grid>
  )
}
