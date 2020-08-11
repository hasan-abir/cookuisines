import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CookingTime from './CookingTime'
import Ingredient from './Ingredient'
import Step from './Step'
import {
  makeStyles,
  Typography,
  Grid,
  Button,
  InputAdornment,
  TextField,
  List,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import ShareIcon from '@material-ui/icons/Share'
import { v4 as uuidv4 } from 'uuid'
import { addRecipe } from '../../actions/recipe'

const useStyles = makeStyles((theme) => ({
  header: {
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.h5.fontSize,
      textAlign: 'center',
    },
  },
  secondHeader: {
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.body1.fontSize,
      textAlign: 'center',
    },
  },
  subHeader: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center',
    },
  },
  form: {
    width: '100%',
  },
  label: {
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center',
    },
  },
  gridGap: {
    marginTop: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(4),
  },
  buttonGrid: {
    [theme.breakpoints.only('xs')]: {
      justifyContent: 'center',
    },
  },
}))

export default function AddRecipe() {
  const classes = useStyles()

  const dispatch = useDispatch()
  const { adding, errors } = useSelector((state) => state.recipe)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [hourTime, setHourTime] = useState('')
  const [minuteTime, setMinuteTime] = useState('')
  const [secondTime, setSecondTime] = useState('')

  const [ingredient, setIngredient] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [step, setStep] = useState('')
  const [steps, setSteps] = useState([])

  const handleChange = (e, setState) => {
    setState(e.target.value)
  }
  const addIngredient = (e) => {
    e.preventDefault()

    if (ingredient !== '') {
      const newIngredient = {
        tempId: uuidv4(),
        name: ingredient,
      }

      const allIngredients = [...ingredients, newIngredient]

      setIngredients(allIngredients)

      setIngredient('')
    }
  }
  const removeIngredient = (id) => {
    const filteredIngredients = ingredients.filter((item) => item.tempId !== id)

    setIngredients(filteredIngredients)
  }
  const addStep = (e) => {
    e.preventDefault()

    if (step !== '') {
      const newStep = {
        tempId: uuidv4(),
        description: step,
      }

      const allSteps = [...steps, newStep]

      setSteps(allSteps)

      setStep('')
    }
  }
  const removeStep = (id) => {
    const filteredSteps = steps.filter((item) => item.tempId !== id)

    setSteps(filteredSteps)
  }
  const clearForm = () => {
    setTitle('')
    setDescription('')
    setHourTime('')
    setMinuteTime('')
    setSecondTime('')
    setIngredient('')
    setIngredients([])
    setStep('')
    setSteps([])
  }
  const submitRecipe = () => {
    const input = {
      title,
      description,
      hourTime,
      minuteTime,
      secondTime,
      ingredients,
      steps,
    }

    dispatch(addRecipe(input, clearForm))
  }

  return (
    <>
      <Typography component="h1" variant="h4" className={classes.header}>
        Create any recipe
      </Typography>
      <Typography component="h1" variant="h5" className={classes.secondHeader}>
        that you have made before
      </Typography>
      <Typography
        color="textSecondary"
        component="p"
        variant="subtitle1"
        className={classes.subHeader}
      >
        and which tasted real good!
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={6}>
          <Typography
            component="h2"
            variant="body1"
            color="textSecondary"
            className={classes.label}
          >
            Title
          </Typography>
          {errors ? (
            errors.data.title ? (
              <Alert severity="error">{errors.data.title}</Alert>
            ) : null
          ) : null}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="title"
            name="title"
            value={title}
            onChange={(e) => handleChange(e, setTitle)}
          />
          <Typography
            component="h2"
            variant="body1"
            color="textSecondary"
            className={classes.label}
          >
            Description
          </Typography>
          {errors ? (
            errors.data.description ? (
              <Alert severity="error">{errors.data.description}</Alert>
            ) : null
          ) : null}
          <TextField
            multiline
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="description"
            name="description"
            rows="5"
            value={description}
            onChange={(e) => handleChange(e, setDescription)}
          />
          <Grid container spacing={2} className={classes.gridGap}>
            <CookingTime
              hourTime={hourTime}
              setHourTime={setHourTime}
              minuteTime={minuteTime}
              setMinuteTime={setMinuteTime}
              secondTime={secondTime}
              setSecondTime={setSecondTime}
              handleChange={handleChange}
            />
            <Grid item xs={12} sm={12} md={6}>
              <Typography
                component="h2"
                variant="body1"
                color="textSecondary"
                className={classes.label}
              >
                Ingredients
              </Typography>
              {errors ? (
                errors.data.ingredients ? (
                  <Alert severity="error">{errors.data.ingredients}</Alert>
                ) : null
              ) : null}
              <form onSubmit={(e) => addIngredient(e)}>
                <TextField
                  variant="outlined"
                  id="name"
                  label="Name"
                  fullWidth
                  margin="normal"
                  value={ingredient}
                  onChange={(e) => handleChange(e, setIngredient)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="outlined"
                          color="primary"
                          type="submit"
                        >
                          Add
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
              {ingredients.length > 0 ? (
                <List>
                  {ingredients.map((item) => {
                    return (
                      <Ingredient
                        ingredient={item}
                        key={item.tempId}
                        removeIngredient={removeIngredient}
                      />
                    )
                  })}
                </List>
              ) : (
                <Typography
                  component="p"
                  variant="body2"
                  color="textSecondary"
                  className={classes.label}
                >
                  Include the ingredients needed for the recipe!
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Typography
            component="h2"
            variant="body1"
            color="textSecondary"
            className={classes.label}
          >
            Steps
          </Typography>
          {errors ? (
            errors.data.steps ? (
              <Alert severity="error">{errors.data.steps}</Alert>
            ) : null
          ) : null}
          <form onSubmit={(e) => addStep(e)}>
            <TextField
              variant="outlined"
              id="description"
              label="Description"
              fullWidth
              margin="normal"
              value={step}
              onChange={(e) => handleChange(e, setStep)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button variant="outlined" color="primary" type="submit">
                      Add
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </form>
          {steps.length > 0 ? (
            <List>
              {steps.map((item) => {
                return (
                  <Step step={item} key={item.tempId} removeStep={removeStep} />
                )
              })}
            </List>
          ) : (
            <Typography
              component="p"
              variant="body2"
              color="textSecondary"
              className={classes.label}
            >
              Describe your steps thoroughly so that people don't make any
              mistakes!
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid container className={classes.buttonGrid}>
        <Button
          color="primary"
          variant="contained"
          className={classes.button}
          size="large"
          endIcon={<ShareIcon />}
          onClick={() => submitRecipe()}
          disabled={adding}
        >
          Share Recipe
        </Button>
      </Grid>
    </>
  )
}
