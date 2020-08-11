import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  label: {
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center',
    },
  },
}))

export default function CookingTime({
  hourTime,
  setHourTime,
  minuteTime,
  setMinuteTime,
  secondTime,
  setSecondTime,
  handleChange,
}) {
  const classes = useStyles()

  const { errors } = useSelector((state) => state.recipe)

  return (
    <Grid item xs={12} sm={12} md={6}>
      <Typography
        component="h2"
        variant="body1"
        color="textSecondary"
        className={classes.label}
      >
        Cooking time
      </Typography>
      {errors ? (
        errors.data.cooking_time ? (
          <Alert severity="error">{errors.data.cooking_time}</Alert>
        ) : null
      ) : null}
      <TextField
        type="number"
        variant="outlined"
        id="hours"
        fullWidth
        margin="normal"
        value={hourTime}
        onChange={(e) => handleChange(e, setHourTime)}
        InputProps={{
          inputProps: { min: 0, max: 24 },
          endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
        }}
      />
      <TextField
        type="number"
        variant="outlined"
        id="minutes"
        fullWidth
        margin="normal"
        value={minuteTime}
        onChange={(e) => handleChange(e, setMinuteTime)}
        InputProps={{
          inputProps: { min: 0, max: 60 },
          endAdornment: <InputAdornment position="end">mins</InputAdornment>,
        }}
      />
      <TextField
        type="number"
        variant="outlined"
        id="seconds"
        fullWidth
        margin="normal"
        value={secondTime}
        onChange={(e) => handleChange(e, setSecondTime)}
        InputProps={{
          inputProps: { min: 0, max: 60 },
          endAdornment: <InputAdornment position="end">secs</InputAdornment>,
        }}
      />
    </Grid>
  )
}
