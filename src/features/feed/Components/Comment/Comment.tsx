import { PostComment } from "../Post/Post";
import classes from "./Comment.module.scss";

function Comment({ comment }: { comment: PostComment }) {
  const { content, author } = comment;
  return (
    <div className={classes.root}>
      <button>
        <img className={classes.commentAuthorProfilePic} src={author.profilePicture ? author.profilePicture : '/public/avatar.png'} />
      </button>
      <div className={classes.commentAuthorAndContent}>
        <button className={classes.commentAuthorInfoButton}>
          <div className={classes.commentAuthorInfo}>
            <div className={classes.commentAuthorName}>{author.firstName + " " + author.lastName}</div>
            <div className={classes.commentAuthorPosition}>{author.position + " at " + author.company}</div>
          </div>
        </button>
        <div className={classes.commentContent}>{content}</div>
      </div>
    </div>
  );
}

export default Comment;