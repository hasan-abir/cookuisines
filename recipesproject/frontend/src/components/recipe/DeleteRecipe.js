import React from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles, Grid, Typography, Button } from '@material-ui/core'
import { deleteRecipe } from '../../actions/recipe'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  text: {
    marginBottom: theme.spacing(2),
  },
}))

export default function DeleteRecipe({ setAnchorDel, recipeId }) {
  const classes = useStyles()

  const dispatch = useDispatch()

  const handleDelete = () => {
    dispatch(deleteRecipe(recipeId))
    setAnchorDel(null)
  }
  return (
    <div className={classes.root}>
      <Typography component="p" variant="body2" className={classes.text}>
        Are you sure you want to delete this recipe?
      </Typography>
      <Grid container justify="center" spacing={2}>
        <Grid item>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setAnchorDel(null)}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={handleDelete}
          >
            Confirm
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
