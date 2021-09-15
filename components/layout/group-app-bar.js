import { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import { db } from '../../firebase-config/firebase-config'
import { useWindowSize } from '../../helpers/handle-window-size'
import UserContext from '../../store/user-context'
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import FormDialog from '../dialogs/find-friends-dialog';
import SignOutDialog from '../dialogs/sign-out-dialog';
import DropDown from './drop-down'
import CreateGroupDialog from '../dialogs/create-group-dialog'

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    height: 71,
    backgroundColor: "#2A2F32",
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
    width: 25
  }
}));

export default function ChatAppBar({ groupName, handleDrawerOpen, groupPhoto, groupFriends }) {
  const windowSize = useWindowSize()
  const classes = useStyles()
  const userCtx = useContext(UserContext)
  const router = useRouter()
  const [textWidth, setTextWidth] = useState(80)
  const [openFindFriendModal, setOpenFindFriendModal] = useState(false)
  const [openSignOutModal, setOpenSignOutModal] = useState(false)
  const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false)
  const [email, setEmail] = useState("")
  const [anchorEl, setAnchorEl] = useState(null);
  const [errorInEmail, setErrorInEmail] = useState({
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

  function handleStartNewGroup() {
    handleClosePopUp()
    handleOpenCreateGroupDialog()
  }

  function handleOpenFindFriendModal() {
    setOpenFindFriendModal(true)
  }

  function handleCloseFindFriendDialog() {
    setOpenFindFriendModal(false)
    setErrorInEmail({
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

  function cleanField() {
    setEmail("")
  }

  function chatAlreadyExists(recipientEmail) {
    return !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    )
  }

  function handleAddFriend() {
    if (email.includes("@") && !chatAlreadyExists(email) && email !== userCtx.email) {
      alert('The Group has been added to your conversation list. However, it is possible that this user is not registered in our database yet. If this happens, when entering the conversation with this user, it will appear that he is unavailable')
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
      <CreateGroupDialog
        open={openCreateGroupDialog}
        handleClose={handleCloseCreateGroupDialog}
      />
      <FormDialog
        title="
        Look for new friend circle"
        content="Enter your friend's gmail and add it to your list"
        btnLabel1="Addr"
        btnLabel2="Cancel"
        btnFunc1={handleAddFriend}
        btnFunc2={handleCloseFindFriendDialog}
        open={openFindFriendModal}
        onChange={handleEmailInput}
        value={email}
        error={errorInEmail.error}
        errorText={errorInEmail.text}
      />
      <SignOutDialog
        title="Sign out"
        content={`
        Do you want to sign out of ${userCtx.name}?`}
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
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
              >
                <MenuIcon className={classes.icon} />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleOpenPopUp}
              >
                <SearchIcon className={classes.icon} />
              </IconButton>
            </Grid>
            <DropDown
              handleClose={handleClosePopUp}
              anchorEl={anchorEl}
              handleStartNewChat={handleStartNewChat}
              handleStartNewGroup={handleStartNewGroup}
            />
            <div className={classes.sizedBox} />
            <Grid item>
              <ListItem>
                <ListItemAvatar>
                  {
                    groupPhoto ?
                      <Avatar src={groupPhoto} />
                      :
                      <Avatar />
                  }
                </ListItemAvatar>
                <ListItemText
                  primary=
                  {
                    <Typography type="body2" className={classes.textPrimary} style={{ width: textWidth }}>
                      {groupName}
                    </Typography>
                  }
                  secondary=
                  {
                    <Typography type="body2" className={classes.textSecondary} style={{ width: textWidth }}>
                      {groupFriends.toString()}
                    </Typography>
                  }
                />
              </ListItem>
            </Grid>
          </Grid>
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
    </AppBar>
  )
}