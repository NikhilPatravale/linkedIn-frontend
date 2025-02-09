import { useEffect, useState } from "react";
import LeftSideBar from "../../Components/LeftSideBar/LeftSideBar";
import RightSideBar from "../../Components/RightSideBar/RightSideBar";
import classes from "./Notifications.module.scss";
import request from "../../../../utils/api";
import { User } from "../../../authentication/context/TypeInterfaces";
import Time from "../../Components/Time/Time";
import Post from "../../Components/Post/Post";
import { PUT } from "../../../authentication/constants/apiConstants";

enum NotificationType {
  LIKE ='LIKE',
  COMMENT = 'COMMENT',
}

export interface NotificationInterface {
  id: number,
  actor: User,
  recipient: User,
  isRead: boolean,
  creationDateTime: string,
  notificationType: NotificationType,
  resourceId: number,
}

function Notifications() {
  const [notifications, setNotifications] = useState<NotificationInterface[] | []>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      await request<NotificationInterface[]>({
        endPoint: "/api/v1/notifications",
        onSuccess: (data) => {
          setNotifications(data);
          setErrorMessage("");
        },
        onFailure: (error) => {
          console.log(error);
          setErrorMessage(error);
        }
      });
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const markNotificationsRead = async (notifications: NotificationInterface[]) => {
      const unreadNotifications = notifications.filter(notification => !notification.isRead);

      await Promise.all(unreadNotifications.map(async (notification) => await request({
        endPoint: `/api/v1/notifications/${notification.id}`,
        httpMethod: PUT,
      })));
    };

    return () => {
      markNotificationsRead(notifications);
      return;
    };
  }, [notifications]);

  const notificationClickHandler = async (postId: number) => {
    await request<Post>({
      endPoint: `/api/v1/feed/posts/${postId}`,
      onSuccess: (data) => setSelectedPost(data),
      onFailure: (errorMessage) => setErrorMessage(errorMessage),
    });
  };

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <LeftSideBar />
      </div>
      <div className={classes.center}>
        {errorMessage && <span>{errorMessage}</span>}
        {
          !selectedPost && notifications.map(
            (notification) => (
              <button key={`notification-${notification.id}`} type="button" onClick={() => notificationClickHandler(notification.resourceId)} className={`${classes.notification} ${notification.isRead ? classes.isRead : ''}`}>
                <div className={classes.details}>
                  <img
                    src={notification.actor?.profilePicture ? notification.actor.profilePicture : "/public/avatar.png"}
                    alt=""
                    className={classes.notificationAuthorProfilePic}
                  />
                  <div>
                    {notification.notificationType === NotificationType.LIKE && <span>{notification.actor?.firstName + " " + notification.actor?.lastName} liked your post.</span>}
                    {notification.notificationType === NotificationType.COMMENT && <span>{notification.actor?.firstName + " " + notification.actor?.lastName} added comment on your post.</span>}
                  </div>
                </div>
                <Time key={`notification-time-${notification.id}`} creationTime={notification.creationDateTime} isEdited={false} />
              </button>
            )
          )
        }
        {selectedPost && <div>
          <button className={classes.backButton} onClick={() => setSelectedPost(null)}>
            <svg xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              height="800px"
              width="800px"
              version="1.1"
              id="Capa_1"
              viewBox="0 0 219.151 219.151"
            >
              <g>
                <path d="M109.576,219.151c60.419,0,109.573-49.156,109.573-109.576C219.149,49.156,169.995,0,109.576,0S0.002,49.156,0.002,109.575   C0.002,169.995,49.157,219.151,109.576,219.151z M109.576,15c52.148,0,94.573,42.426,94.574,94.575   c0,52.149-42.425,94.575-94.574,94.576c-52.148-0.001-94.573-42.427-94.573-94.577C15.003,57.427,57.428,15,109.576,15z" />
                <path d="M94.861,156.507c2.929,2.928,7.678,2.927,10.606,0c2.93-2.93,2.93-7.678-0.001-10.608l-28.82-28.819l83.457-0.008   c4.142-0.001,7.499-3.358,7.499-7.502c-0.001-4.142-3.358-7.498-7.5-7.498l-83.46,0.008l28.827-28.825   c2.929-2.929,2.929-7.679,0-10.607c-1.465-1.464-3.384-2.197-5.304-2.197c-1.919,0-3.838,0.733-5.303,2.196l-41.629,41.628   c-1.407,1.406-2.197,3.313-2.197,5.303c0.001,1.99,0.791,3.896,2.198,5.305L94.861,156.507z" />
              </g>
            </svg>
            <span>Notifications</span>
          </button>
          <Post post={selectedPost} /></div>}
      </div>
      <div className={classes.right}>
        <RightSideBar />
      </div>
    </div>
  );
}

export default Notifications;