import React, { useState } from 'react'
import {
  makeStyles,
  useTheme,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  Container,
} from '@material-ui/core/'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logoutUser } from '../../actions/auth'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appbar: {
    boxShadow: 'none',
  },
  title: {
    flexGrow: 1,
    textDecoration: 'none',
    color: '#000',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  drawerLink: {
    textAlign: 'center',
  },
}))

export default function Navbar() {
  const classes = useStyles()

  const theme = useTheme()

  const [drawerOpen, setDrawerOpen] = useState(false)

  const dispatch = useDispatch()

  const { userLoading, isLoggedIn } = useSelector((state) => state.auth)
  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="default" className={classes.appbar}>
        <Container maxWidth="md">
          <Toolbar disableGutters>
            <Typography
              component={Link}
              to="/"
              variant="h6"
              className={classes.title}
            >
              Cookuisines
            </Typography>
            <Box display={{ xs: 'inline', sm: 'none' }}>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                display={{ xs: 'inline', sm: 'none' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Box component="div" display={{ xs: 'none', sm: 'inline' }}>
              {userLoading ? null : isLoggedIn ? (
                <>
                  <Button component={Link} to="/dashboard" color="primary">
                    Dashboard
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => dispatch(logoutUser())}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button component={Link} to="/login" color="primary">
                    Login
                  </Button>
                  <Button component={Link} to="/register" color="primary">
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            {theme.direction === 'rtl' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {userLoading ? null : isLoggedIn ? (
            <>
              <ListItem button component={Link} to="/dashboard">
                <ListItemText className={classes.drawerLink}>
                  Dashboard
                </ListItemText>
              </ListItem>
              <ListItem button onClick={() => dispatch(logoutUser())}>
                <ListItemText className={classes.drawerLink}>
                  Logout
                </ListItemText>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem button component={Link} to="/login">
                <ListItemText className={classes.drawerLink}>
                  Login
                </ListItemText>
              </ListItem>
              <ListItem button component={Link} to="/register">
                <ListItemText className={classes.drawerLink}>
                  Register
                </ListItemText>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </div>
  )
}
