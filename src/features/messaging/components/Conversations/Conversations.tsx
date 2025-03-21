import { useLocation, useNavigate, useParams } from "react-router-dom";
import Input from "../../../authentication/components/Input/Input";
import classes from "./Conversations.module.scss";
import { FormEvent, useEffect, useRef, useState } from "react";
import request from "../../../../utils/api";
import { IConversation, Message } from "../../pages/Messaging/Messaging";
import { useAuthentication } from "../../../authentication/context/AuthenticationContextProvider";
import { POST, PUT } from "../../../authentication/constants/apiConstants";
import { StompSubscription } from "@stomp/stompjs";
import { useWebSocketContext } from "../../../ws/WebSocketContextProvider";
import { User } from "../../../authentication/context/TypeInterfaces";

function Conversations() {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState<string>("");
  const [disableSendMessage, setDisableSendMessage] = useState<boolean>(false);
  const { user } = useAuthentication() || {}; 
  const navigate = useNavigate();
  const scrollToDivRef = useRef<HTMLDivElement>(null);
  const webSocketClient = useWebSocketContext();
  const authContext = useAuthentication();
  const location = useLocation();
  const isNewConversation = location.pathname.includes("new-conversation");
  const existingConversationUserToDisplay = conversation?.author.id === authContext?.user?.id
    ? conversation?.recipient : conversation?.author;

  useEffect(() => {
    const fetchConversation = async () => {
      setIsLoading(true);
      await request<IConversation>({
        endPoint: `/api/v1/messaging/conversations/${conversationId}`,
        onSuccess: (data) => {
          setConversation(data);
          setUnreadMessages(data.messages.filter(({ isRead, receiver }) => receiver.id === user?.id && !isRead));
        },
        onFailure: () => navigate("/messaging"),
      });
      setIsLoading(false);
    };

    fetchConversation();
  }, [conversationId, navigate, user]);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newMessageContent) {
      return;
    }
    setDisableSendMessage(true);

    await request<IConversation>({
      endPoint: `/api/v1/messaging/conversations/${conversation?.id}/messaging`,
      httpMethod: POST,
      body: JSON.stringify({
        content: newMessageContent,
      }),
      onSuccess: (data) => {
        setNewMessageContent("");
        setConversation(data);
      },
    });

    setDisableSendMessage(false);
  };

  useEffect(() => scrollToDivRef.current?.scrollIntoView({ behavior: "smooth" }));

  useEffect(() => {
    let messageSubscription: StompSubscription | undefined;
    if (conversation?.id) {
      messageSubscription = webSocketClient?.subscribe(`/topic/notifications/conversations/${conversation.id}/message`, (message) => {
        if (message.body) {
          const receivedConversation = JSON.parse(message.body);
          setConversation(receivedConversation);
          setUnreadMessages(receivedConversation.messages.filter(({ isRead, receiver }: { isRead: boolean, receiver: User }) => receiver.id === user?.id && !isRead));
        }
      });
    }
    
    return () => {
      if (messageSubscription) {
        messageSubscription.unsubscribe();
      }
    };
  }, [webSocketClient, conversation?.id, user]);

  useEffect(() => {
    const markMessagesRead = async () => {
      await Promise.all(unreadMessages.map(async (message) => await request({
        endPoint: `/api/v1/messaging/conversations/messages/${message.id}`,
        httpMethod: PUT,
      })));
    };

    if (unreadMessages.length > 0) {
      markMessagesRead();
    }
  }, [unreadMessages]);

  return (
    <div className={classes.root}>
      {
        isLoading
          ? <div>Loading...</div>
          : <>
            <div className={classes.conversationTop}>
              <button className={classes.profileInfo}>
                <img
                  src={existingConversationUserToDisplay?.profilePicture || "/public/avatar.png"}
                />
                <div className={classes.profileDetails}>
                  <span>{`${existingConversationUserToDisplay?.firstName} ${existingConversationUserToDisplay?.lastName}`}</span>
                  <span className={classes.companyDetails}>{`${existingConversationUserToDisplay?.position} at ${existingConversationUserToDisplay?.company}`}</span>
                </div>
              </button>
              <button
                className={classes.closeButton}
                onClick={() => navigate("/messaging")}
              >
                    X
              </button>
            </div>
            <div className={classes.messages}>
              {
                conversation?.messages.map((message) => {
                  const sentMessage = message.sender.id === user?.id;
                  return (
                    <div
                      key={`message-${message.id}`}
                      className={`${sentMessage ? classes.sentMessage : classes.receivedMessage}`}
                    >
                      <div
                        key={message.id}
                        className={sentMessage ? classes.sentMessageStyle : classes.receivedMessageStyle}
                      >
                        {message.content}
                      </div>
                      {sentMessage ? <div className={classes.readInfo}>
                        {message.isRead ?
                          <svg viewBox="3 0 28 28" fill="none">
                            <path
                              d="M5.03033 11.4697C4.73744 11.1768 4.26256 11.1768 3.96967 11.4697C3.67678 11.7626 3.67678 12.2374 3.96967 12.5303L5.03033 11.4697ZM8.5 16L7.96967 16.5303C8.26256 16.8232 8.73744 16.8232 9.03033 16.5303L8.5 16ZM17.0303 8.53033C17.3232 8.23744 17.3232 7.76256 17.0303 7.46967C16.7374 7.17678 16.2626 7.17678 15.9697 7.46967L17.0303 8.53033ZM9.03033 11.4697C8.73744 11.1768 8.26256 11.1768 7.96967 11.4697C7.67678 11.7626 7.67678 12.2374 7.96967 12.5303L9.03033 11.4697ZM12.5 16L11.9697 16.5303C12.2626 16.8232 12.7374 16.8232 13.0303 16.5303L12.5 16ZM21.0303 8.53033C21.3232 8.23744 21.3232 7.76256 21.0303 7.46967C20.7374 7.17678 20.2626 7.17678 19.9697 7.46967L21.0303 8.53033ZM3.96967 12.5303L7.96967 16.5303L9.03033 15.4697L5.03033 11.4697L3.96967 12.5303ZM9.03033 16.5303L17.0303 8.53033L15.9697 7.46967L7.96967 15.4697L9.03033 16.5303ZM7.96967 12.5303L11.9697 16.5303L13.0303 15.4697L9.03033 11.4697L7.96967 12.5303ZM13.0303 16.5303L21.0303 8.53033L19.9697 7.46967L11.9697 15.4697L13.0303 16.5303Z"
                              fill="#000000"
                            />
                          </svg> :
                          <svg viewBox="0 0 80 80" version="1" enable-background="new 0 0 48 48">
                            <polygon fill="black" points="40.6,12.1 17,35.7 7.4,26.1 4.6,29 17,41.3 43.4,14.9" />
                          </svg>}
                      </div> : null}
                    </div>
                  );
                })
              }
              <div
                style={{ float: "left", clear: "both" }}
                ref={scrollToDivRef}
              />
            </div>
            <form className={classes.messageInput} onSubmit={sendMessage}>
              <Input
                name="messageInput"
                placeholder="Write a message.."
                inputSize="md"
                value={newMessageContent}
                onChange={(e) => setNewMessageContent(e.target.value)}
              />
              <button
                className={`${classes.sendButton} ${newMessageContent.length == 0 || disableSendMessage ? '' : classes.enabled}`}
                disabled={newMessageContent.length == 0 || disableSendMessage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
                    stroke="inherit"
                  />
                </svg>
              </button>
            </form>
          </>
            
      }
    </div>
  );
}

export default Conversations;