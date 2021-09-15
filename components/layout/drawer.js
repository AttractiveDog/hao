import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { useRouter } from 'next/router'
import { useContext } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase-config/firebase-config'
import UserContext from '../../store/user-context'
import Chat from './chat'
import Group from './group'
import { getRecipientEmail } from '../../helpers/get-recipient-email'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import GroupIcon from '@material-ui/icons/Group';
import ChatIcon from '@material-ui/icons/Chat'
import { Grid } from '@material-ui/core';
import styles from '../../styles/Home.module.css'


const useStyles = makeStyles({
  list: {
    width: 275,
  },
  fullList: {
    width: 'auto',
  },
  friendList: {
    height: "100%",
    minHeight: "100vh",
    overflowY: "scroll",
    overflowX: "hidden",
  },
  textPrimary: {
    color: "rgba(241, 241, 242, 0.92)",
    fontSize: 16,
  },
  textSecondary: {
    color: "rgba(241, 241, 242, 0.63)",
    
    fontSize: 14,
  },
  listItem: {
    borderBottom: "1px solid #30383d",
    backgroundColor: "#1286a6",
    borderRadius: "10px",
    boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px",
  },
  icon: {
    fill: '#b1b3b5'
  }
});

export default function TemporaryDrawer(props) {
  const userCtx = useContext(UserContext)
  const userChatRef = db.collection('chats').where('users', 'array-contains', userCtx.email)
  const userGroupsRef = db.collection('groups').where('users', 'array-contains', userCtx.email)
  const userclubsRef = db.collection('clubs').where('users', 'array-contains', userCtx.email)
  const [chatsSnapshot] = useCollection(userChatRef)
  const [groupsSnapshot] = useCollection(userGroupsRef)
  const [clubsSnapshot] = useCollection(userclubsRef)
  const classes = useStyles();
  const router = useRouter();

  function handleClickFriend(id) {
    props.handleDrawerClose()
    router.push(`/chat-page/${id}`)
  }

  function handleClickGroup(id) {
    props.handleDrawerClose()
    router.push(`/group-page/${id}`)
  }

  function handleClickClub(id) {
    props.handleDrawerClose()
    router.push(`/club-page/${id}`)
  }

  const list = () => (
    <div className={styles.list}>
    <div
      className={classes.list}
    >
      <div className={styles.containerMain3}>
      <List className={classes.friendList}>
        <ListItem className={classes.listItem}>
          <Grid container direction='row' alignItems='center' justify='center' spacing={2}>
            <Grid item>
              <ChatIcon className={classes.icon} />
            </Grid>
            <Grid item>
              <Typography type="body2" className={classes.textPrimary}>
                Conversations
              </Typography>
            </Grid>
          </Grid>
          
        </ListItem>
        
        {
          chatsSnapshot?.docs.length === 0 ?
            <ListItem className={classes.listItem}>
              <Typography type="body2" className={classes.textSecondary}>
                You don't have any conversations yet
              </Typography>
            </ListItem>
            :
            chatsSnapshot?.docs.map((chat) => (
              <Chat
                key={chat.id}
                id={chat.id}
                friendEmail={getRecipientEmail(chat.data().users, userCtx.email)}
                lastMessage={chat.data().lastMessage}
                timestamp={chat.data().timestamp?.toDate().getTime()}
                handleClickFriend={handleClickFriend}
              />
            ))
        }
        <ListItem className={classes.listItem}>
          <Grid container direction='row' alignItems='center' justify='center' spacing={2}>
            <Grid item>
              <GroupIcon className={classes.icon} />
            </Grid>
            <Grid item>
              <Typography type="body2" className={classes.textPrimary}>Groups</Typography>
            </Grid>
          </Grid>
        </ListItem>
        {
          groupsSnapshot?.docs.length === 0 ?
            <ListItem className={classes.listItem}>
              <Typography type="body2" className={classes.textSecondary}>
                  You don't have any groups
              </Typography>
            </ListItem>
            :
            groupsSnapshot?.docs.map((group) => (
              <Group
                key={group.id}
                id={group.id}
                groupName={group.data().groupName}
                groupPhoto={group.data().groupPhoto}
                lastMessage={group.data().lastMessage}
                timestamp={group.data().timestamp?.toDate().getTime()}
                handleClickFriend={handleClickGroup}
              />
            ))
        }
        <ListItem className={classes.listItem}>
          <Grid container direction='row' alignItems='center' justify='center' spacing={2}>
            <Grid item>
              <ChatIcon className={classes.icon} />
            </Grid>
            <Grid item>
              <Typography type="body2" className={classes.textPrimary}>
                Clubs
              </Typography>
            </Grid>
          </Grid>
          
        </ListItem>

        {
          clubsSnapshot?.docs.length === 0 ?
            <ListItem className={classes.listItem}>
              <Typography type="body2" className={classes.textSecondary}>
                  You don't have any club
              </Typography>
            </ListItem>
            :
            clubsSnapshot?.docs.map((club) => (
              <Group
                key={club.id}
                id={club.id}
                groupName={club.data().name}
                groupPhoto={club.data().dp}
                lastMessage={club.data().lastmsg}
                timestamp={club.data().timestamp?.toDate().getTime()}
                handleClickFriend={handleClickClub}
              />
            ))
        }

      </List>
    </div>
    </div>
    </div>
  );

  return (
    <div>
      <Drawer open={props.open} onClose={props.handleDrawerClose} variant="permanent">
        {list()}
      </Drawer>
    </div>
  );
}
