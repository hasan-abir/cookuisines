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
import Fastfood from '@material-ui/icons/Fastfood'
import EditIcon from '@material-ui/icons/Edit'
import DeleteRecipe from './DeleteRecipe'
import EditRecipe from './EditRecipe'

const useStyles = makeStyles((theme) => ({
  paper: {
    background: theme.palette.primary.main,
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
  foodIcon: {
    fontSize: theme.spacing(9),
    color: '#fff',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: theme.spacing(3),
    textDecoration: 'none',
  },
  description: {
    color: '#fff',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  author: {
    color: '#fff',
    opacity: 0.5,
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
  editBtn: {
    color: '#fff',
  },
  recipeBtn: {
    background: '#fff',
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: '#fff',
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
    <Paper className={classes.paper} elevation={0}>
      <Grid container wrap="wrap" spacing={3} className={classes.recipe}>
        <Grid item>
          <Fastfood className={classes.foodIcon} />
        </Grid>
        <Grid item xs>
          <Typography
            component={Link}
            to={'/recipe/' + recipe.id}
            variant="h2"
            className={classes.title}
          >
            {recipe.title}
          </Typography>
          <Typography
            component="h2"
            variant="body1"
            className={classes.description}
          >
            {recipe.description}
          </Typography>
          <Typography component="h2" variant="body1" className={classes.author}>
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
                    className={classes.editBtn}
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
              variant="contained"
              disabled={deleting}
              component={Link}
              className={classes.recipeBtn}
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
