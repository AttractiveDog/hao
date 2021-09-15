import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import ChatAppBar from '../../components/layout/app-bar'
import DrawerChat from '../../components/layout/drawer'
import MediaCard from '../../components/layout/card'
import SwipeableTextMobileStepper from '../../components/layout/carousel'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    
    flexGrow: 1,
    padding: theme.spacing(3),
    overflowY: "scroll",
    overflowX: "hidden",
    height: "100%",
    minHeight: "100vh"
  },
  title: {
    color: "rgba(241, 241, 242, 0.95)",
    fontWeight: "lighter",
    textAlign: "center"
  },
  middle:{
    height: '100%',
    width: '100%',
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  divider: {
    height: 20,
  },
  btn: {
    display: 'grid',
    top: '500',
  }
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.containerMain}>
    
      <Head>
        <title>
          Home
        </title>
        <meta description="Home page with some instructions" name="Home page" />
      </Head>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.middle}>
            <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
              <Grid item xs={12}>
                <SwipeableTextMobileStepper/>
                <div className={classes.divider}></div>
                <MediaCard/>
                
              </Grid>
            </Grid>
          </div>
        </main>
      <CssBaseline />
      <ChatAppBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <DrawerChat open={open} handleDrawerClose={handleDrawerClose} />
    
  </div>
  );
}