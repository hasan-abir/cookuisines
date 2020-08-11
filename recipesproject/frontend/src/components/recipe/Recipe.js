import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  makeStyles,
  Grid,
  Typography,
  Paper,
  Avatar,
  Button,
  IconButton,
  Popover,
  Modal,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import DeleteRecipe from './DeleteRecipe'
import EditRecipe from './EditRecipe'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
  recipe: {
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    },
  },
  avatar: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  description: {
    marginBottom: theme.spacing(3),
  },
  fullHeight: {
    height: '100%',
  },
  buttonGroup: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.only('xs')]: {
      justifyContent: 'center',
    },
  },
  modal: {
    overflowY: 'scroll',
  },
  modalPaper: {
    outline: 'none',
    margin: theme.spacing(8, 6),
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(4, 2),
    },
  },
}))

export default function Recipe({ recipe }) {
  const classes = useStyles()

  const [isCreator, setIsCreator] = useState(false)
  const [anchorDel, setAnchorDel] = useState(null)
  const [editOpen, setEditOpen] = useState(false)

  const delOpen = Boolean(anchorDel)
  const delId = delOpen ? 'delete-popover' : undefined

  const { user, isLoggedIn } = useSelector((state) => state.auth)
  const { deleting } = useSelector((state) => state.recipe)

  useEffect(() => {
    if (user) {
      if (recipe.creator === user.id) {
        setIsCreator(true)
      }
    }
  }, [])

  return (
    <Paper className={classes.paper} elevation={3}>
      <Grid container wrap="wrap" spacing={3} className={classes.recipe}>
        <Grid item>
          <Avatar
            alt="Remy Sharp"
            src="https://images.pexels.com/photos/196643/pexels-photo-196643.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            className={classes.avatar}
          />
        </Grid>
        <Grid item xs>
          <Typography component="h2" variant="h5" className={classes.title}>
            {recipe.title}
          </Typography>
          <Typography
            component="h2"
            variant="body1"
            className={classes.description}
          >
            {recipe.description}
          </Typography>
          <Typography component="h2" variant="body1" color="textSecondary">
            Published by {recipe.username}
          </Typography>
        </Grid>
        <Grid item>
          <Grid
            container
            className={classes.fullHeight}
            justify="space-around"
            alignItems="flex-end"
            direction="column"
          >
            {isLoggedIn ? (
              isCreator ? (
                <Grid
                  container
                  alignItems="center"
                  justify="flex-end"
                  spacing={2}
                  className={classes.buttonGroup}
                >
                  <IconButton
                    color="primary"
                    disabled={deleting}
                    onClick={() => setEditOpen(true)}
                  >
                    <EditIcon />
                  </IconButton>
                  <Modal
                    open={editOpen}
                    className={classes.modal}
                    onClose={() => setEditOpen(false)}
                  >
                    <Paper className={classes.modalPaper}>
                      <EditRecipe setEditOpen={setEditOpen} recipe={recipe} />
                    </Paper>
                  </Modal>
                  <IconButton
                    color="secondary"
                    disabled={deleting}
                    onClick={(e) => setAnchorDel(e.currentTarget)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Popover
                    id={delId}
                    open={delOpen}
                    anchorEl={anchorDel}
                    onClose={() => setAnchorDel(null)}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'center',
                      horizontal: 'right',
                    }}
                  >
                    <DeleteRecipe
                      setAnchorDel={setAnchorDel}
                      recipeId={recipe.id}
                    />
                  </Popover>
                </Grid>
              ) : null
            ) : null}
            <Button
              variant="outlined"
              color="primary"
              disabled={deleting}
              component={Link}
              to={'/recipe/' + recipe.id}
            >
              Full Recipe
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}
