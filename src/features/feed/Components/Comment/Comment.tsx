import { PostComment } from "../Post/Post";
import Time from "../Time/Time";
import classes from "./Comment.module.scss";

function Comment({ comment }: { comment: PostComment }) {
  const { content, author, creationDateTime } = comment;
  return (
    <div className={classes.root}>
      <button>
        <img className={classes.commentAuthorProfilePic} src={author.profilePicture ? author.profilePicture : '/public/avatar.png'} />
      </button>
      <div className={classes.commentAuthorAndContent}>
        <div>
          <button className={classes.commentAuthorInfoButton}>
            <div className={classes.commentAuthorInfo}>
              <div className={classes.commentAuthorName}>{author.firstName + " " + author.lastName}</div>
              <div className={classes.commentAuthorPosition}>{author.position + " at " + author.company}</div>
            </div>
          </button>
          <Time key={`time-${creationDateTime}`} creationTime={creationDateTime} isEdited={false} />
        </div>
        <div className={classes.commentContent}>{content}</div>
      </div>
    </div>
  );
}

export default Comment;