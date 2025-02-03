import { useEffect, useState } from "react";
import LeftSideBar from "../../Components/LeftSideBar/LeftSideBar";
import RightSideBar from "../../Components/RightSideBar/RightSideBar";
import classes from "./Notifications.module.scss";
import request from "../../../../utils/api";
import { User } from "../../../authentication/context/TypeInterfaces";
import Time from "../../Components/Time/Time";

enum NotificationType {
  LIKE ='LIKE',
  COMMENT = 'COMMENT',
}

interface Notification {
  id: string,
  actor: User,
  recipient: User,
  isRead: boolean,
  creationDateTime: string,
  notificationType: NotificationType,
  resourceId: string,
}

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[] | []>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    request<Notification[]>({
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
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <LeftSideBar />
      </div>
      <div className={classes.center}>
        {errorMessage && <span>{errorMessage}</span>}
        {
          notifications.map((notification) => (
            <button key={`notification-${notification.id}`} className={`${classes.notification} ${notification.isRead ? classes.isRead : ''}`}>
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
          ))
        }
      </div>
      <div className={classes.right}>
        <RightSideBar />
      </div>
    </div>
  );
}

export default Notifications;