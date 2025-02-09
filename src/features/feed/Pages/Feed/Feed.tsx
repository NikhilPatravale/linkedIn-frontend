import { useEffect, useState } from 'react';
import { useAuthentication } from '../../../authentication/context/AuthenticationContextProvider';
import LeftSideBar from '../../Components/LeftSideBar/LeftSideBar';
import RightSideBar from '../../Components/RightSideBar/RightSideBar';
import classes from './Feed.module.scss';
import Button from '../../../authentication/components/Button/Button';
import Post from '../../Components/Post/Post';
import request from '../../../../utils/api';
import { DELETE, POST, PUT } from '../../../authentication/constants/apiConstants';
import Modal from '../../Components/Modal/Modal';

export function Feed() {
  const context = useAuthentication();
  const { user } = context || { };
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState("feed");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      await request<Post[]>({
        endPoint: "/api/v1/feed" + `${filter === "allPosts" ? "/posts" : ''}`,
        onSuccess: (data) => {
          setErrorMessage("");
          setPosts(data);
        },
        onFailure: (error) => setErrorMessage(error),
      });
    };

    fetchPosts();
  }, [filter]);

  const createNewPost = async ({
    content,
    picture
  }: { content: string, picture: string }) => {
    await request<Post>({
      endPoint: "/api/v1/feed/posts",
      httpMethod: POST,
      body: JSON.stringify({
        content,
        picture,
      }),
      onSuccess: () => setShowModal(false),
      onFailure: (error) => console.log(error),
    });
  };

  const deletePost = async (postToDelete: Post) => {
    const postId = postToDelete.id;
    setPosts(prev => prev.filter(singlePost => singlePost.id !== postId));

    await request<String>({
      endPoint: `/api/v1/feed/posts/${postId}`,
      httpMethod: DELETE,
      onFailure: (error) => {
        setPosts(prev => [...prev, postToDelete]);
        console.log(error);
      },
    });
  };

  const editPost = async ({ postId, content, picture }: { postId: number, content: string, picture: string }) => {
    await request<Post>({
      endPoint: `/api/v1/feed/posts/${postId}`,
      httpMethod: PUT,
      body: JSON.stringify({
        content,
        picture
      }),
      onSuccess: (data) => setPosts(prev => prev.map((singlePost) => {
        if (singlePost.id === postId) {
          return data;
        }
        return singlePost;
      })),
      onFailure: () => {
        throw new Error("Something went wrong");
      },
    });
  };

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <LeftSideBar />
      </div>
      <div className={classes.center}>
        <div className={classes.posting}>
          <img className={classes.avatar} src={user?.profilePicture || "./avatar.png"} alt="" />
          <button
            className={classes.startPost}
            onClick={() => {
              setShowModal(prev => !prev);
            }}
          >
            Start Post
          </button>
        </div>
        <div className={classes.filterSection}>
          <div className={classes.filters}>
            <Button outline={true} className={`${classes.allFilter} ${filter === "allPosts" ? classes.active : ''}`} onClick={() => setFilter("allPosts")}>All</Button>
            <Button outline={false} className={`${classes.feedFilter} ${filter === "feed" ? classes.active : ''}`} onClick={() => setFilter("feed")}>Feed</Button>
          </div>
        </div>
        {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
        <div>
          {
            posts
              ? posts.map((post) => <Post key={`${post.id}`} post={post} deletePost={deletePost} editPost={editPost} />)
              : null
          }
        </div>
        <Modal
          title="Create a post"
          showModal={showModal}
          setShowModal={setShowModal}
          onSubmit={createNewPost}
        />
      </div>
      <div className={classes.right}>
        <RightSideBar />
      </div>
    </div>
  );
}