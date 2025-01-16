import { useEffect, useState } from 'react';
import { useAuthentication } from '../../../authentication/context/AuthenticationContextProvider';
import LeftSideBar from '../../Components/LeftSideBar/LeftSideBar';
import RightSideBar from '../../Components/RightSideBar/RightSideBar';
import classes from './Feed.module.scss';
import Button from '../../../authentication/components/Button/Button';
import Post from '../../Components/Post/Post';
import fetchClient from '../../../../utils/fetchClient';
import { API, GET, GET_FEED_URL, V1 } from '../../../authentication/constants/apiConstants';
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
      try {
        const resp = await fetchClient({
          url: import.meta.env.VITE_API_URL + API + V1 + GET_FEED_URL + `${filter === "allPosts" ? "/posts" : ''}`,
          httpMethod: GET,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        if (resp.ok) {
          const posts = await resp.json();
          setPosts(posts);
        } else {
          const { message } = await resp.json();
          throw new Error(message);
        }
      } catch(error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else setErrorMessage("Something went wrong");
      }
    };

    fetchPosts();
  }, [filter]);

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
              ? posts.map((post) => <Post key={`${post.id}`} post={post} setPosts={setPosts} />)
              : null
          }
        </div>
        <Modal showModal={showModal} setShowModal={setShowModal} title="Create a post" />
      </div>
      <div className={classes.right}>
        <RightSideBar />
      </div>
    </div>
  );
}