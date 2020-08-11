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
    paddingLeft: theme.spacing(2),
  },
  step: {
    marginTop: theme.spacing(2),
  },
}))

export default function Step({ step, removeStep, editMode }) {
  const classes = useStyles()

  return (
    <ListItem component={Paper} className={classes.step}>
      <ListItemText className={classes.text}>{step.description}</ListItemText>
      {editMode ? null : (
        <ListItemSecondaryAction className={classes.icon}>
          <IconButton
            edge="end"
            color="primary"
            onClick={() => removeStep(step.tempId)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  )
}
