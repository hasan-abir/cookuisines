import React from 'react'
import {
  Paper,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  makeStyles,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles((theme) => ({
  text: {
    wordBreak: 'break-word',
  },
  icon: {
    marginLeft: theme.spacing(2),
  },
  ingredient: {
    marginTop: theme.spacing(2),
  },
}))

export default function Ingredient({ ingredient, removeIngredient, editMode }) {
  const classes = useStyles()

  return (
    <ListItem component={Paper} className={classes.ingredient}>
      <ListItemText className={classes.text}>{ingredient.name}</ListItemText>
      {editMode ? null : (
        <ListItemSecondaryAction className={classes.icon}>
          <IconButton
            edge="end"
            color="primary"
            onClick={() => removeIngredient(ingredient.tempId)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  )
}
