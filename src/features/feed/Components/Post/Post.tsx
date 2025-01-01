import { User } from "../../../authentication/context/TypeInterfaces";
import classes from "./Post.module.scss";

interface Comment {
  id: Number,
  author_id: Number,
  post_id: Number,
  update_date_time?: String,
  content: String
}

interface Post {
  id: Number,
  content: String,
  picture?: String,
  creationDateTime: String,
  updatedDateTime?: String,
  author: User,
  likes?: User[],
  comments?: Comment[],
}

function Post() {
  return (
    <div className={classes.root}>
      Post
    </div>
  );
}

export default Post;