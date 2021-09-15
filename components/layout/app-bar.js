import { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import { db } from '../../firebase-config/firebase-config'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useWindowSize } from '../../helpers/handle-window-size'
import UserContext from '../../store/user-context'
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Grid from '@material-ui/core/Grid';
import FormDialog from '../dialogs/find-friends-dialog';
import SignOutDialog from '../dialogs/sign-out-dialog';
import TimeAgo from 'timeago-react'
import Skeleton from '@material-ui/lab/Skeleton';
import DropDown from './drop-down'
import CreateGroupDialog from '../dialogs/create-group-dialog'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import styles from '../../styles/Home.module.css'
import NewPost from '../dialogs/new-post';
import JoinClub from '../dialogs/join-club';
import TextField from '@material-ui/core/TextField';

const drawerWidth = 301;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    height: 71,
    backgroundColor: "#2A2F32",
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  sizedBox: {
    width: 5,
  },
  icon: {
    fill: "#b1b3b5"
  },
  textPrimary: {
    color: "rgba(241, 241, 242, 0.92)",
    fontSize: 16,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
  textSecondary: {
    color: "rgba(241, 241, 242, 0.63)",
    fontSize: 13,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
  avatar: {
    height: 25,
    width: 25,
    },
  search: {
    
    backgroundColor: '#fff',
  }
}));

export default function ChatAppBar({ friendData, handleDrawerOpen, loading }) {
  const windowSize = useWindowSize()
  const classes = useStyles()
  const userCtx = useContext(UserContext)
  const router = useRouter()
  const userChatRef = db.collection('chats').where('users', 'array-contains', userCtx.email)
  const userClubRef = db.collection('clubs').where('users', 'array-contains', userCtx.email)
  const userClubCodeRef = db.collection('clubs').where('inviteCode', 'array-contains', userCtx.email)
  const [chatsSnapshot] = useCollection(userChatRef)
  const [clubsSnapshot] = useCollection(userClubRef)
  const [textWidth, setTextWidth] = useState(80)
  const [openFindFriendModal, setOpenFindFriendModal] = useState(false)
  const [openNewPostModal, setOpenNewPostModal] = useState(false)
  const [openJoinClubModal, setOpenJoinClubModal] = useState(false)
  const [openSignOutModal, setOpenSignOutModal] = useState(false)
  const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false)
  const [email, setEmail] = useState("")
  const [inviteCode, setCode] = useState("")
  const [anchorEl, setAnchorEl] = useState(null);
  const [errorInEmail, setErrorInEmail] = useState({
    error: false,
    text: ""
  })
  const [errorInCode, setErrorInCode] = useState({
    error: false,
    text: ""
  })
  

  function handleOpenPopUp(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClosePopUp() {
    setAnchorEl(null);
  };

  function handleOpenCreateGroupDialog() {
    setOpenCreateGroupDialog(true)
  }

  function handleCloseCreateGroupDialog() {
    setOpenCreateGroupDialog(false)
  }


  function handleStartNewChat() {
    handleOpenFindFriendModal()
    handleClosePopUp()
  }

  function handleStartJoinClub() {
    handleOpenJoinClubModal()
    handleClosePopUp()
  }

  function handlePostNewPost() {
    handleOpenNewPostModal()
    handleClosePopUp()
  }

  function handleStartNewGroup() {
    handleClosePopUp()
    handleOpenCreateGroupDialog()
  }

  function handleOpenFindFriendModal() {
    setOpenFindFriendModal(true)
  }

  function handleOpenJoinClubModal() {
    setOpenJoinClubModal(true)
  }

  function handleOpenNewPostModal() {
    setOpenNewPostModal(true)
  }

  function handleNewPost() {
    db.collection('posts').add({
      name: [userCtx.name]
    })
    alert("New post added successfully")
  }

  function handleCloseNewPostModal() {
    setOpenNewPostModal(false)
    router.push("/chat-page")
  }

  function handleCloseFindFriendDialog() {
    setOpenFindFriendModal(false)
    setErrorInEmail({
      error: false,
      text: "",
    })
  }

  function handleCloseJoinClubDialog() {
    setOpenJoinClubModal(false)
    setErrorInCode({
      error: false,
      text: "",
    })
  }

  function handleEmailInput(event) {
    if (errorInEmail.error)
      setErrorInEmail({
        error: false,
        text: "",
      })
    setEmail(event.target.value)
  }

  function handleCodeInput(event) {
    if (errorInCode.error)
      setErrorInCode({
        error: false,
        text: "",
      })
    setCode(event.target.value)
  }

  function cleanField() {
    setEmail("")
  }

  function chatAlreadyExists(recipientEmail) {
    return !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    )
  }

  function clubAlreadyExists(recipientEmail) {
    return !!clubsSnapshot?.docs.find(
      (club) =>
        club.data().users.find((user) => user === recipientEmail)?.length > 0
    )
  }

  

  // Tera dhyan kidhar hai asli code idhar hai

  function handleAddFriend() {
    if (email.includes("@") && !chatAlreadyExists(email) && email !== userCtx.email) {
      alert('The user has been added to your conversation list. However, it is possible that this user is not registered in our database yet. If this happens, when entering the conversation with this user, it will appear that he is unavailable')
      db.collection('chats').add({
        users: [userCtx.email, email]
      })
      setOpenFindFriendModal(false)
    }
    else {
      setErrorInEmail({
        error: true,
        text: "Invalid email or there is already a conversation with this email!"
      })
    }
    cleanField()
  }

  // asli code khatam

  function handleJoinClub() {
    
    if (!clubAlreadyExists(inviteCode) && inviteCode === 'awrgeahgeagheaghehggggtgwtgggwrwfgawtawegawgfawfWAEgwagAW') {
      alert('The user has been added to your conversation list. However, it is possible that this user is not registered in our database yet. If this happens, when entering the conversation with this user, it will appear that he is unavailable')
      db.collection('clubs').add({
        users: [userCtx.email]
      })
      setOpenFindFriendModal(false)
    }
    else {
      setErrorInEmail({
        error: true,
        text: "Invalid email or there is already a conversation with this email!"
      })
    }
    cleanField()
  }

  async function handleSignOut() {
    userCtx.signOut()
    router.push("/")
  }

  function handleCloseSignOutModal() {
    setOpenSignOutModal(false)
  }

  function handleOpenSignOutModal() {
    setOpenSignOutModal(true)
  }

  useEffect(() => {
    if (windowSize.width >= 550)
      setTextWidth(300)
    else if (windowSize.width >= 350)
      setTextWidth(120)
    else
      setTextWidth(80)
  }, [windowSize])

  return (
    <AppBar
      position="fixed"
      className={classes.appBar}
    > 
    <div className={styles.containerMain2}>
      <CreateGroupDialog
        open={openCreateGroupDialog}
        handleClose={handleCloseCreateGroupDialog}
      />
      <FormDialog
        title="Look for new friends!"
        content="Enter your friend's gmail and add it to your list"
        btnLabel1="Add"
        btnLabel2="Cancel"
        btnFunc1={handleAddFriend}
        btnFunc2={handleCloseFindFriendDialog}
        open={openFindFriendModal}
        onChange={handleEmailInput}
        value={email}
        error={errorInEmail.error}
        errorText={errorInEmail.text}
      />

      <JoinClub
        title="Look for new club!"
        content="Enter your friend's gmail and add it to your list"
        btnLabel1="Add"
        btnLabel2="Cancel"
        btnFunc1={handleJoinClub}
        btnFunc2={handleCloseJoinClubDialog}
        open={openJoinClubModal}
        onChange={handleCodeInput}
        value={inviteCode}
        error={errorInEmail.error}
        errorText={errorInEmail.text}
      />

      <NewPost
        title="Look for new post!"
        content="Enter whatever mummble in your mind!"
        btnLabel1="Add"
        btnLabel2="Cancel"
        btnFunc1={handleNewPost}
        btnFunc2={handleCloseNewPostModal}
        open={openNewPostModal}
        onChange={handleEmailInput}
        value={email}
        error={errorInEmail.error}
        errorText={errorInEmail.text}
      />

      <SignOutDialog
        title="Sign out"
        content={`Do you want to sign out of ${userCtx.name}?`}
        btnLabel1="Yes"
        btnLabel2="No"
        btnFunc1={handleSignOut}
        btnFunc2={handleCloseSignOutModal}
        open={openSignOutModal}
      />
      <Grid container direction="row" alignItems="center" justify="space-between" style={{ padding: "0 10px" }}>
        <Grid item>
          <Grid container direction="row" alignItems="center">
            <Grid item>
            </Grid>
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleOpenPopUp}
              >
                <AddCircleIcon className={classes.icon} />
              </IconButton>
            </Grid>
            <DropDown
              handleClose={handleClosePopUp}
              anchorEl={anchorEl}
              handleStartNewChat={handleStartNewChat}
              handlePostNewPost={handlePostNewPost}
              handleStartNewGroup={handleStartNewGroup}
              handleStartJoinClub={handleStartJoinClub}
            />
            
            <div className={classes.sizedBox} />
            <Grid item>
              {
                loading ?
                  <ListItem>
                    <ListItemAvatar>
                      <Skeleton animation="wave" variant="circle">
                        <Avatar />
                      </Skeleton>
                    </ListItemAvatar>
                    <ListItemText
                      primary=
                      {
                        <Skeleton animation="wave" variant="text" height={18} width={90}>
                        </Skeleton>
                      }
                      secondary=
                      {
                        <Skeleton animation="wave" variant="text" height={18} width={90}>
                        </Skeleton>
                      }
                    />
                  </ListItem>
                  :
                  <ListItem>
                    <ListItemAvatar>
                      {
                        friendData ?
                          <Avatar src={friendData.photoURL} />
                          :
                          <Avatar />
                      }
                    </ListItemAvatar>
                    <ListItemText
                      primary=
                      {
                        friendData ?
                          <Typography type="body2" className={classes.textPrimary} style={{ width: textWidth }}>
                            {friendData.email}
                          </Typography>
                          :
                          <Typography type="body2" className={classes.textPrimary} style={{ width: textWidth }}>
                            Open a chat to get started!
                      </Typography>
                      }

                      secondary=
                      {
                        friendData?.lastSeen?.toDate() ? (
                          <Typography type="body2" className={classes.textSecondary} style={{ width: textWidth }}>
                            <TimeAgo datetime={friendData?.lastSeen?.toDate()} style={{ width: textWidth }} />
                          </Typography>
                        )
                          :
                          <Typography type="body2" className={classes.textSecondary} style={{ width: textWidth }}>
                            No time to show
                          </Typography>
                          
                      }
                    />
                  </ListItem>
                  
              }
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item>
          <div className={classes.search}><TextField id="filled-basic" label="Search..." variant="filled" /></div>
        </Grid>

        <Grid item>
          <Avatar
            className={classes.avatar}
            src={userCtx.photoUrl}
            alt="Avatar"
            onClick={handleOpenSignOutModal}
          />
        </Grid>
      </Grid>
      </div>
    </AppBar>
  )
}