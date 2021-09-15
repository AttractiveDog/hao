import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase-config/firebase-config'
import UserContext from '../../store/user-context'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  divider: {
    height: 20,
    backgroundColor: "#2A2F32",
  },
}));

export default function RecipeReviewCard() {
  const classes = useStyles();
  const userPostsRef = db.collection('posts')
  const [postsSnapshot] = useCollection(userPostsRef)
  const userCtx = useContext(UserContext)
  return (
    <div>
      {
          postsSnapshot?.docs.length === 0 ?
            <Typography className={classes.listItem}>
              <Typography type="body2" className={classes.textSecondary}>
                  You don't have any post
              </Typography>
            </Typography>
            :
            postsSnapshot?.docs.map((post) => (
              <Card
                className={classes.root}
                key={post.id}
                id={post.id}
                groupName={post.data().name}
                postPhoto={post.data().photoUrl}
                lastMessage={post.data().lastmsg}
                timestamp={post.data().time?.toDate().getTime()}
              >
                <CardHeader
                    avatar={
                      <Avatar aria-label="recipe" className={classes.avatar} src={post.data().userPhoto}/>
                        
                    }
                    title={post.data().name}
                    subheader={post.data().timestamp?.toDate().getTime()}
                  />
                  <CardMedia
                    className={classes.media}
                    image={post.data().photoUrl}
                    title={post.data().text}
                  />
                  <CardContent>
                    <Typography variant="body2" color="white" component="p">
                      {post.data().text}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                </CardActions>
                <div className={classes.divider}></div>

              </Card>
            ))
        }
      </div>
    
  );
}