import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  makeStyles,
  Typography,
  Grid,
  Button,
  InputAdornment,
  TextField,
  List,
} from '@material-ui/core'
import CookingTime from './CookingTime'
import Ingredient from './Ingredient'
import Step from './Step'
import Alert from '@material-ui/lab/Alert'
import EditIcon from '@material-ui/icons/Edit'
import { v4 as uuidv4 } from 'uuid'
import { editRecipe, clearErrors } from '../../actions/recipe'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(8, 6),
    [theme.breakpoints.only('xs')]: {
      padding: theme.spacing(6, 2),
    },
  },
  header: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.h5.fontSize,
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
  buttonGrid: {
    marginTop: theme.spacing(4),
    [theme.breakpoints.only('xs')]: {
      justifyContent: 'center',
    },
  },
}))

export default function EditRecipe({ setEditOpen, recipe }) {
  const classes = useStyles()

  const dispatch = useDispatch()
  const { editing, errors } = useSelector((state) => state.recipe)

  const [title, setTitle] = useState(recipe.title)
  const [description, setDescription] = useState(recipe.description)
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

    dispatch(editRecipe(recipe.id, input, clearForm, setEditOpen))
  }

  useEffect(() => {
    const totalTime = recipe.cooking_time.split(':')

    setHourTime(totalTime[0])
    setMinuteTime(totalTime[1])
    setSecondTime(totalTime[2])

    const allIngredients = recipe.ingredients.map((item) => {
      return {
        tempId: uuidv4(),
        ...item,
      }
    })

    setIngredients(allIngredients)

    const allSteps = recipe.steps.map((item) => {
      return {
        tempId: uuidv4(),
        ...item,
      }
    })

    setSteps(allSteps)

    dispatch(clearErrors())
  }, [])
  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h4" className={classes.header}>
        Edit Recipe
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
            errors.data.edit.title ? (
              <Alert severity="error">{errors.data.edit.title}</Alert>
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
            errors.data.edit.description ? (
              <Alert severity="error">{errors.data.edit.description}</Alert>
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
                errors.data.edit.ingredients ? (
                  <Alert severity="error">{errors.data.edit.ingredients}</Alert>
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
                        editMode
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
            errors.data.edit.steps ? (
              <Alert severity="error">{errors.data.edit.steps}</Alert>
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
                  <Step
                    step={item}
                    key={item.tempId}
                    removeStep={removeStep}
                    editMode
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
              Describe your steps thoroughly so that people don't make any
              mistakes!
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid container className={classes.buttonGrid} spacing={3}>
        <Grid item>
          <Button
            color="default"
            variant="outlined"
            size="large"
            disabled={editing}
            onClick={() => setEditOpen(false)}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            size="large"
            disabled={editing}
            endIcon={<EditIcon />}
            onClick={() => submitRecipe()}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
