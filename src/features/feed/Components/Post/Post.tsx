import { FormEvent, useEffect, useRef, useState } from "react";
import { User } from "../../../authentication/context/TypeInterfaces";
import classes from "./Post.module.scss";
import { useAuthentication } from "../../../authentication/context/AuthenticationContextProvider";
import request from "../../../../utils/api";
import { PUT } from "../../../authentication/constants/apiConstants";
import Comment from "../Comment/Comment";
import Modal from "../Modal/Modal";
import Time from "../Time/Time";
import { useWebSocketContext } from "../../../ws/WebSocketContextProvider";
import { StompSubscription } from "@stomp/stompjs";

export interface PostComment {
  id: Number,
  content: string,
  author: User,
  creationDateTime: string,
}

interface Post {
  id: number,
  content: string,
  picture?: string,
  creationDateTime: string,
  updatedDateTime?: string,
  author: User,
}

interface PostProps {
  post: Post,
  deletePost?: (postToDelete: Post) => void,
  editPost?: ({ postId, content, picture }: { postId: number, content: string, picture: string }) => void,
}

function Post({post, deletePost, editPost }: PostProps) {
  const { user } = useAuthentication() || {};
  const webSocketClient = useWebSocketContext();
  const commentBoxInputRef = useRef<HTMLInputElement>(null);
  const [postLiked, setPostLiked] = useState(false);
  const [showCommentsSection, setShowCommentsSection] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [likes, setLikes] = useState<User[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLikes = async () => {
      await request<User[]>({
        endPoint: `/api/v1/feed/posts/${post.id}/likes`,
        onSuccess: (data) => {
          setLikes(data);
          setPostLiked(data.some((like: User) => like.id === user?.id));
        },
        onFailure: (error) => setError(error),
      });
    };
    fetchLikes();
  }, [post.id, user?.id]);

  useEffect(() => {
    let likeSubscription: StompSubscription | undefined;
    let commentSubscription: StompSubscription | undefined;
    if (post?.id) {
      likeSubscription = webSocketClient?.subscribe(`/topic/notifications/post/${post.id}/likes`, (mesage) => {
        if (mesage.body) {
          console.log(JSON.parse(mesage.body));
          setLikes(JSON.parse(mesage.body));
        }
      });
      commentSubscription = webSocketClient?.subscribe(`/topic/notifications/post/${post.id}/comment`, (message) => {
        const body = message.body;
        if (body) {
          setComments(prev => [JSON.parse(body), ...prev]);
        }
      });
    }

    return () => {
      if (likeSubscription) {
        likeSubscription.unsubscribe();
      }
      if (commentSubscription) {
        commentSubscription.unsubscribe();
      }
    };
  }, [webSocketClient, post?.id]);

  useEffect(() => {
    const fetchComments = async () => {
      await request<PostComment[]>({
        endPoint: `/api/v1/feed/posts/${post.id}/comments`,
        onSuccess: (data) => setComments(data),
        onFailure: (error) => setError(error),
      });
    };
    fetchComments();
  }, [post.id]);

  const likePost = async () => {
    setPostLiked(prev => {
      console.log("Current PostLiked: ", prev);
      return !prev;
    });
    
    await request<User>({
      endPoint: `/api/v1/feed/posts/${post.id}/like`,
      httpMethod: PUT,
      onFailure: () => setPostLiked(prev => !prev),
    });
  };

  const addComment = async (e: FormEvent<HTMLFormElement>, postId: Number) => {
    e.preventDefault();
    if (commentBoxInputRef.current) {
      const commentContent = commentBoxInputRef.current.value;

      if (!commentContent) {
        setError("Comment content can not be empty");
        return;
      }

      await request<PostComment>({
        endPoint: `/api/v1/feed/posts/${postId}/comments`,
        httpMethod: PUT,
        body: JSON.stringify({
          content: commentContent,
        }),
        onSuccess: () => {
          if (commentBoxInputRef.current) {
            commentBoxInputRef.current.value = "";
          }
        },
        onFailure: (error) => console.log(error),
      });
    }
  };

  const postDeletHandler = async () => {
    if (deletePost) {
      deletePost(post);
      setShowEditOptions(false);
    }
  };

  const postEditHandler = async ({ postId, content, picture }: { postId: number, content: string, picture: string }) => {
    if (editPost) {
      editPost({ postId, content, picture });
      setEditingPost(false);
    }
  };

  return (
    <>
      <Modal
        title="Editing a post"
        showModal={editingPost}
        setShowModal={setEditingPost}
        onSubmit={postEditHandler}
        content={post.content}
        pictureUrl={post.picture}
        postId={post.id}
      />
      <div className={classes.root}>
        {/* Post top section with post author profile picture and info */}
        <div className={classes.top}>
          <button>
            <img src={`${post.author.profilePicture ? post.author.profilePicture : '/public/avatar.png'}`} />
          </button>
          <div className={classes.postInfo}>
            <button className={classes.authorInfo}>
              <div className={classes.authorName}>{post.author.firstName + " " + post.author.lastName}</div>
              <div className={classes.authorPosition}>
                {post.author.position + " at " + post.author.company}
              </div>
            </button>
            <Time creationTime={post.creationDateTime} isEdited={!!post.updatedDateTime} />
          </div>
        </div>

        {/* Button to edit post for post author only */}
        {post.author.id === user?.id ? <button className={classes.editPostButton} onClick={() => setShowEditOptions(prev => !prev)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.25 8C3.25 8.69 2.69 9.25 2 9.25C1.31 9.25 0.75 8.69 0.75 8C0.75 7.31 1.31 6.75 2 6.75C2.69 6.75 3.25 7.31 3.25 8ZM14 6.75C13.31 6.75 12.75 7.31 12.75 8C12.75 8.69 13.31 9.25 14 9.25C14.69 9.25 15.25 8.69 15.25 8C15.25 7.31 14.69 6.75 14 6.75ZM8 6.75C7.31 6.75 6.75 7.31 6.75 8C6.75 8.69 7.31 9.25 8 9.25C8.69 9.25 9.25 8.69 9.25 8C9.25 7.31 8.69 6.75 8 6.75Z" fill="currentColor"></path>
          </svg>
        </button> : null}

        {/* Post edit options - Edit, Delete */}
        {showEditOptions ? <div className={classes.postEditOptions}>
          <button onClick={() => {
            setShowEditOptions(false);
            setEditingPost(true);
          }}>Edit</button>
          <button type="button" onClick={postDeletHandler}>Delete</button>
        </div> : null}
      
        {/* Post content section */}
        <div className={classes.center}>
          <div className={classes.content}>
            <div className={classes.postContent}>{post.content}</div>
            {post.picture && <img className={classes.postPicture} src={post.picture} />}
          </div>
          <div className={classes.stats}>
            <div className={classes.likes}>
              {
                likes.length > 0
                  ? `${postLiked ? 'You' : likes[0].firstName + " " + likes[0].lastName}
                  ${likes.length - 1 > 0 // If likes are more than 1 then show 'and {count of remaining likes}'
      ? `and ${likes.length - 1} ${likes.length - 1 > 1 ? 'others' : 'other'}` // If {count of remaining likes} is more than 1 then show 'others' or show 'other'
      : ''} liked this` // Static text to show when any like is present
                  : '' // If likes are less than or equal to 0 then don't show anything
              }
            </div>
            <div className={classes.commentsStat}>
              {
                comments.length > 0 ? (
                  <button onClick={() => setShowCommentsSection(prev => !prev)}>
                    {comments.length} {comments.length > 1 ? 'comments' : 'comment'}
                  </button>
                ) : null
              }
            </div>
          </div>
        </div>
        {error && <div style={{color: 'red'}}>{error}</div>}

        {/* Post bottom section with like and comment buttons */}
        <div className={classes.bottom}>
          <button
            className={`${classes.likes} ${postLiked ? classes.active : ''}`}
            onClick={likePost}
          >
            <svg
              role="none"
              aria-hidden="true"
              className="artdeco-button__icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16" 
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="thumbs-up-outline-small" aria-hidden="true" role="none" data-supported-dps="16x16" fill="currentColor">
                <path d="M12.91 7l-2.25-2.57a8.21 8.21 0 01-1.5-2.55L9 1.37A2.08 2.08 0 007 0a2.08 2.08 0 00-2.06 2.08v1.17a5.81 5.81 0 00.31 1.89l.28.86H2.38A1.47 1.47 0 001 7.47a1.45 1.45 0 00.64 1.21 1.48 1.48 0 00-.37 2.06 1.54 1.54 0 00.62.51h.05a1.6 1.6 0 00-.19.71A1.47 1.47 0 003 13.42v.1A1.46 1.46 0 004.4 15h4.83a5.61 5.61 0 002.48-.58l1-.42H14V7zM12 12.11l-1.19.52a3.59 3.59 0 01-1.58.37H5.1a.55.55 0 01-.53-.4l-.14-.48-.49-.21a.56.56 0 01-.34-.6l.09-.56-.42-.42a.56.56 0 01-.09-.68L3.55 9l-.4-.61A.28.28 0 013.3 8h5L7.14 4.51a4.15 4.15 0 01-.2-1.26V2.08A.09.09 0 017 2a.11.11 0 01.08 0l.18.51a10 10 0 001.9 3.24l2.84 3z"></path>
              </svg>
              <use href="#thumbs-up-outline-small" width="16" height="16"></use>
            </svg>
            <span>Like</span>
          </button>
          <button className={classes.commentButton} onClick={() => setShowCommentsSection(prev => !prev)}>
            <svg
              role="none"
              aria-hidden="true"
              className="artdeco-button__icon "
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="comment-small" aria-hidden="true" role="none" data-supported-dps="16x16" fill="currentColor">
                <path d="M5 8h5v1H5zm11-.5v.08a6 6 0 01-2.75 5L8 16v-3H5.5A5.51 5.51 0 010 7.5 5.62 5.62 0 015.74 2h4.76A5.5 5.5 0 0116 7.5zm-2 0A3.5 3.5 0 0010.5 4H5.74A3.62 3.62 0 002 7.5 3.53 3.53 0 005.5 11H10v1.33l2.17-1.39A4 4 0 0014 7.58zM5 7h6V6H5z"></path>
              </svg>
              <use href="#comment-small" width="16" height="16"></use>
            </svg>
            <span>Comment</span>
          </button>
        </div>

        {/* This section opens up when we click on comments count or Comment button */}
        {showCommentsSection ? <div className={classes.commentsSection}>
          <form onSubmit={(e) => addComment(e, post.id)} className={classes.commentSectionTop}>
            <button type="button" onClick={() => {console.log('asdf');}}>
              <img className={classes.commentSectionProfilePic} src={user && user.profilePicture ? user.profilePicture : '/public/avatar.png'} alt="" />
            </button>
            <input
              ref={commentBoxInputRef}
              className={classes.commentBox}
              name="commentBox"
              placeholder="Add a comment..."
            />
            <div className={classes.commentInputOptions}>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="emoji-medium" aria-hidden="true" role="none" data-supported-dps="24x24" fill="currentColor">
                  <path d="M8 10.5A1.5 1.5 0 119.5 12 1.5 1.5 0 018 10.5zm6.5 1.5a1.5 1.5 0 10-1.5-1.5 1.5 1.5 0 001.5 1.5zm7.5 0A10 10 0 1112 2a10 10 0 0110 10zm-2 0a8 8 0 10-8 8 8 8 0 008-8zm-8 4a6 6 0 01-4.24-1.76l-.71.76a7 7 0 009.89 0l-.71-.71A6 6 0 0112 16z"></path>
                </svg>
              </button>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="image-medium" aria-hidden="true" role="none" data-supported-dps="24x24" fill="currentColor">
                  <path d="M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm1 13a1 1 0 01-.29.71L16 14l-2 2-6-6-4 4V7a1 1 0 011-1h14a1 1 0 011 1zm-2-7a2 2 0 11-2-2 2 2 0 012 2z"></path>
                </svg>
              </button>
            </div>
          </form>
          <div className={classes.commentsList}>
            {comments.map((comment) => <Comment key={`comment-${comment.id}`} comment={comment} />)}
          </div>
        </div>
          : null}
      </div>
    </>
  );
}

export default Post;