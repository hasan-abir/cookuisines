import React from 'react'
import {
  Typography,
  makeStyles,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Container,
} from '@material-ui/core'
import TimeIcon from '@material-ui/icons/AccessTime'
import StarIcon from '@material-ui/icons/Star'
import BookMarkIcon from '@material-ui/icons/Bookmark'
import { formatCookingTime } from '../../common/helpers'

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 'bold',
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.h5.fontSize,
      textAlign: 'center',
    },
  },
  heading: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(2),
  },
  step: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    background: theme.palette.primary.main,
    color: '#fff',
  },
  ingredient: {
    marginBottom: theme.spacing(1),
    background: theme.palette.primary.main,
    color: '#fff',
  },
  icon: {
    color: '#fff',
  },
}))

export default function FullRecipe({ recipe }) {
  const classes = useStyles()

  const hours = recipe.cooking_time.split(':')[0]
  const minutes = recipe.cooking_time.split(':')[1]
  const seconds = recipe.cooking_time.split(':')[2]

  const timeObj = formatCookingTime(hours, minutes, seconds)

  return (
    <Container maxWidth="md">
      <Typography component="h1" variant="h4" className={classes.title}>
        {recipe.title}
      </Typography>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={8} className={classes.leftColumn}>
          <Typography component="h1" variant="h6" className={classes.heading}>
            Description
          </Typography>
          <Typography
            component="p"
            variant="body1"
            className={classes.description}
          >
            {recipe.description}
          </Typography>
          <Typography component="h1" variant="h6" className={classes.heading}>
            Steps to follow
          </Typography>
          <List>
            {recipe.steps.map((item, index) => {
              return (
                <Paper className={classes.step} key={index} elevation={2}>
                  <ListItem>
                    <ListItemIcon>
                      <StarIcon className={classes.icon} />
                    </ListItemIcon>
                    <ListItemText>{item.description}</ListItemText>
                  </ListItem>
                </Paper>
              )
            })}
          </List>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography component="h1" variant="h6" className={classes.heading}>
            Cooking Time
          </Typography>
          <List>
            {timeObj.hours !== '' ? (
              <ListItem>
                <ListItemIcon>
                  <TimeIcon />
                </ListItemIcon>
                <ListItemText>{timeObj.hours}</ListItemText>
              </ListItem>
            ) : null}
            {timeObj.minutes !== '' ? (
              <ListItem>
                <ListItemIcon>
                  <TimeIcon />
                </ListItemIcon>
                <ListItemText>{timeObj.minutes}</ListItemText>
              </ListItem>
            ) : null}
            {timeObj.seconds !== '' ? (
              <ListItem>
                <ListItemIcon>
                  <TimeIcon />
                </ListItemIcon>
                <ListItemText>{timeObj.seconds}</ListItemText>
              </ListItem>
            ) : null}
          </List>
          <Typography component="h1" variant="h6" className={classes.heading}>
            Ingredients
          </Typography>
          <List>
            {recipe.ingredients.map((item, index) => {
              return (
                <Paper className={classes.ingredient} key={index} elevation={0}>
                  <ListItem>
                    <ListItemIcon>
                      <BookMarkIcon className={classes.icon} />
                    </ListItemIcon>
                    <ListItemText>{item.name}</ListItemText>
                  </ListItem>
                </Paper>
              )
            })}
          </List>
        </Grid>
      </Grid>
    </Container>
  )
}
