import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db, storage } from '../../firebase-config/firebase-config';
import { useWindowSize } from '../../helpers/handle-window-size';
import UserContext from '../../store/user-context'
import { useState } from 'react'


const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  fullWidth: {
    width: '100%'
  },
  loadButton: {
    width: '100%',
    marginTop: '1em',
  },
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  alignCenter: {
    textAlign: 'center'
  },
  userList: {
    height: 200,
    overflowY: 'scroll'
  },
  textPrimary: {
    fontSize: 16,
    width: 180,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
}));

export default function AlertDialog({ open, handleClose }, props) {
  const classes = useStyles()
  const windowSize = useWindowSize()
  const userCtx = React.useContext(UserContext)
  const [checkedFriends, setCheckedFriends] = React.useState([])
  const [selectedFriendsArray, setSelectedFriendArray] = React.useState([])
  const [input, setInput] = React.useState('')
  const [limit, setLimit] = React.useState(5)
  const [imageAsFile, setImageAsFile] = React.useState('')
  const [imageAsUrl, setImageAsUrl] = React.useState('')
  const usersRef = db.collection('users').orderBy('email', 'asc')
  const [usersSnapshot, loading] = useCollection(usersRef.limit(limit))
  const [openNewPostModal, setOpenNewPostModal] = useState(false)


  const handleToggle = (value) => () => {
    const currentIndex = checkedFriends.indexOf(value);
    const newCheckedFriends = [...checkedFriends];
    const newSelectedFriends = [...selectedFriendsArray];

    if (currentIndex === -1) {
      newCheckedFriends.push(value);
      newSelectedFriends.push({
        email: usersSnapshot?.docs[value].data().email,
        photoURL: usersSnapshot?.docs[value].data().photoURL
      });
    } else {
      newCheckedFriends.splice(currentIndex, 1);
      newSelectedFriends.splice(currentIndex, 1);
    }

    setCheckedFriends(newCheckedFriends);
    setSelectedFriendArray(newSelectedFriends)
  };

  function loadMoreFriend() {
    if (usersSnapshot?.docs.length >= limit)
      setLimit(limit + 5)
  }

  function handleCloseNewPostModal() {
    setOpenNewPostModal(false)
  }

  function handleCloseDialog() {
    handleCloseNewPostModal()
    setLimit(5)
    setCheckedFriends([])
    setSelectedFriendArray([])
    setImageAsUrl('')
    setImageAsFile('')
    setInput('')

  }

  function createGroup(firebaseUrl) {
    const friends = [...getFriends()]
    
      db.collection('posts').add({
        name: friends,
        photoUrl: firebaseUrl,
        text: input,
        userPhoto: [userCtx.photoUrl]
      })
  
    handleCloseDialog()
  }

  function getFriends() {
    const friends = []
    for (let index = 0; index < selectedFriendsArray.length; index++) {
      const element = selectedFriendsArray[index];
      friends.push(element.email)
    }
    friends.push(userCtx.email)
    return friends
  }

  async function handleCreateGroup(e) {
    e.preventDefault()

    const friends = getFriends()

    if (friends && input.trim().length >= 1)
      handleFireBaseUpload()
    else
      handleCloseDialog()
  }

  const handleImageAsFile = (e) => {
    const image = e.target.files[0]
    if (image) {
      setImageAsFile(imageFile => (image))
      setImageAsUrl(URL.createObjectURL(image))
    }
  }

  function handleFireBaseUpload() {
    if (imageAsFile) {
      const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(imageAsFile)
      //initiates the firebase side uploading 
      uploadTask.on('state_changed',
        (snapShot) => {
          //takes a snap shot of the process as it is happening
          console.log(snapShot)
        }, (err) => {
          //catches the errors
          return false
        }, () => {
          // gets the functions from storage refences the image storage in firebase by the children
          // gets the download url then sets the image from firebase as the value for the imgUrl key:
          storage.ref('images').child(imageAsFile.name).getDownloadURL()
            .then(fireBaseUrl => {
              createGroup(fireBaseUrl)
            })
            .catch(err => {
              handleCloseDialog()
            })
        })
        alert("New Post was published successfully!")
    }
    
    else
      createGroup('')
  }


  function handleTextWidth() {
    if (windowSize.width >= 900)
      return (400)
    else if (windowSize.width >= 600)
      return (300)
    else if (windowSize.width >= 352)
      return (170)
    else
      return (130)
  }

  function handleQntAvatars() {
    if (windowSize.width >= 900)
      return (10)
    else if (windowSize.width >= 600)
      return (8)
    else if (windowSize.width >= 352)
      return (5)
    else
      return (4)
  }

  return (
    <div>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Create a new Post!
        </DialogTitle>
        <DialogContent>
          <Grid container direction='column' justify='center' alignItems='center' spacing={3}>
            <Grid item xs={12}>
              {
                !imageAsUrl ?
                  <>
                    <label for="avatar-file">
                      <Avatar className={classes.large}>
                        <AddAPhotoIcon />
                      </Avatar>
                    </label>
                    <input accept="image/*" id="avatar-file"
                      type="file"
                      onChange={handleImageAsFile}
                      style={{ display: "none" }}
                    />
                  </>
                  :
                  <>
                    <label for="avatar-file">
                      <Avatar src={imageAsUrl} className={classes.large} />
                    </label>
                    <input accept="image/*" id="avatar-file"
                      type="file"
                      onChange={handleImageAsFile}
                      style={{ display: "none" }}
                    />
                  </>
              }
            </Grid>
            <Grid item xs={12} className={classes.fullWidth}>
              <TextField
                id="standard-basic"
                label="Enter the group name"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                multiline
                fullWidth
              />
            </Grid>
            
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateGroup} color="primary" autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}