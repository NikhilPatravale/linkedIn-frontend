import { useNavigate, useParams } from "react-router-dom";
import { IConversation } from "../../pages/Messaging/Messaging";
import classes from "./Conversation.module.scss";
import { useAuthentication } from "../../../authentication/context/AuthenticationContextProvider";
import { useEffect, useState } from "react";
import { StompSubscription } from "@stomp/stompjs";
import { useWebSocketContext } from "../../../ws/WebSocketContextProvider";

function Conversation({ conversation }: { conversation: IConversation }) {
  const { user } = useAuthentication() || {};
  const navigate = useNavigate();
  const webSocketClient = useWebSocketContext();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const { conversationId } = useParams();
  const [updatedConversation, setUpdatedConversation] = useState<IConversation>(conversation);
  const { author, recipient, id } = updatedConversation;
  const userToDisplay = user?.id === author.id ? recipient : author;

  useEffect(() => {
    setUnreadMessagesCount(updatedConversation?.messages?.filter(
      (message) => message.receiver.id === user?.id && !message.isRead).length
    );
  }, [updatedConversation, user]);

  useEffect(() => {
    let messageSubscription: StompSubscription | undefined;
    if (updatedConversation?.id) {
      messageSubscription = webSocketClient?.subscribe(`/topic/notifications/conversations/${updatedConversation.id}/message`, (message) => {
        if (message.body) {
          const receivedConversation = JSON.parse(message.body);
          setUpdatedConversation(receivedConversation);
        }
      });
    }
  
    return () => {
      if (messageSubscription) {
        messageSubscription.unsubscribe();
      }
    };
  }, [webSocketClient, updatedConversation?.id, user?.id]);

  useEffect(() => setUpdatedConversation(conversation), [conversation]);

  return (
    <div className={`${classes.root} ${conversationId && Number(conversationId) === updatedConversation.id ? classes.active : ''}`}>
      <button
        className={classes.conversation}
        onClick={() => navigate(`/messaging/conversations/${id}`)}
      >
        <img
          className={classes.conversationProfileImage}
          src={userToDisplay.profilePicture || "/public/avatar.png"}
        />
        <div className={classes.conversationProfileInfo}>
          <div className={classes.conversationProfileName}>{
            userToDisplay.firstName && userToDisplay.lastName ?
              (`${userToDisplay.firstName} ${userToDisplay.lastName}`)
              : ""
          }</div>

          {unreadMessagesCount > 0 ? <div className={classes.unreadMessages}>{unreadMessagesCount}</div> : null}

          <div className={classes.lastMessage}>
            {updatedConversation.messages ? updatedConversation.messages[updatedConversation.messages.length - 1].content : ''}
          </div>
        </div>
      </button>

    </div>
  );
}

export default Conversation;