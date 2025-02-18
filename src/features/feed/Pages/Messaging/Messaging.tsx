import { useEffect, useState } from "react";
import Input from "../../../authentication/components/Input/Input";
import RightSideBar from "../../Components/RightSideBar/RightSideBar";
import classes from "./Messaging.module.scss";
import request from "../../../../utils/api";
import { User } from "../../../authentication/context/TypeInterfaces";
import { useAuthentication } from "../../../authentication/context/AuthenticationContextProvider";

interface Message {
  id: number,
  sender: User,
  receiver: User,
  content: string,
  isRead: boolean,
  creationDateTime: string,
}

interface Convesation {
  id: number,
  author: User,
  recipient: User,
  messages: Message[],
  creationDateTime: string,
}

interface SelectedConversation {
  user: User,
  conversation?: Convesation,
}

function Messaging() {
  const [conversations, setConversations] = useState<Convesation[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newConversationsList, setNewConversationsList] = useState<User[]>([]);
  const [errorFetchingNewConversationList, setErrorFetchingNewConversationList] = useState<string>("");
  const [showStartNewConversation, setShowStartNewConversation] = useState<boolean>(false);
  const [selectedConversation, setSelectedConversation] = useState<SelectedConversation | null>(null);
  const { user } = useAuthentication() || {};

  useEffect(() => {
    const fetchConversations = async () => {
      await request<Convesation[]>({
        endPoint: "/api/v1/messaging/conversations",
        onSuccess: (data) => setConversations(data),
        onFailure: (error) => setErrorMessage(error),
      });
    };

    fetchConversations();
  }, []);

  const handleAddConversation = async () => {
    setShowStartNewConversation(true);
    setSelectedConversation(null);
    setIsLoading(true);
    await request<User[]>({
      endPoint: "/api/v1/authentication/users",
      onSuccess: (data) => setNewConversationsList(data),
      onFailure: (error) => setErrorFetchingNewConversationList(error),
    });
    setIsLoading(false);
  };

  const handleStartNewConversation = async (user: User) => {
    const existingConversationWithUser = conversations.find(conversation =>
      conversation.author.id === user.id || conversation.recipient.id === user.id);

    setShowStartNewConversation(false);

    if (existingConversationWithUser) {
      setSelectedConversation({
        user,
        conversation: existingConversationWithUser,
      });
    } else {
      setSelectedConversation({
        user,
      });
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.messagingContainer}>
        <div className={classes.messagingContainerLeft}>
          <div className={classes.top}>
            <h4>Messaging</h4>
            <button
              className={classes.addButton}
              onClick={handleAddConversation}
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                version="1.1"
              >
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g
                    id="Icon-Set"
                    transform="translate(-464.000000, -1087.000000)"
                    fill="#000000"
                  >
                    <path
                      d="M480,1117 C472.268,1117 466,1110.73 466,1103 C466,1095.27 472.268,1089 480,1089 C487.732,1089 494,1095.27 494,1103 C494,1110.73 487.732,1117 480,1117 L480,1117 Z M480,1087 C471.163,1087 464,1094.16 464,1103 C464,1111.84 471.163,1119 480,1119 C488.837,1119 496,1111.84 496,1103 C496,1094.16 488.837,1087 480,1087 L480,1087 Z M486,1102 L481,1102 L481,1097 C481,1096.45 480.553,1096 480,1096 C479.447,1096 479,1096.45 479,1097 L479,1102 L474,1102 C473.447,1102 473,1102.45 473,1103 C473,1103.55 473.447,1104 474,1104 L479,1104 L479,1109 C479,1109.55 479.447,1110 480,1110 C480.553,1110 481,1109.55 481,1109 L481,1104 L486,1104 C486.553,1104 487,1103.55 487,1103 C487,1102.45 486.553,1102 486,1102 L486,1102 Z"
                      id="plus-circle"
                    >
                    </path>
                  </g>
                </g>
              </svg>
            </button>
          </div>
          <div className={classes.messageList}>
            {!errorMessage && conversations.length <= 0 && <span>No conversation to display</span>}

            {errorMessage && <span className={classes.errorMessage} >{errorMessage}</span>}
            
            {conversations.length > 0 && <ul className={classes.conversationList}>
              {
                conversations.map((conversation) => {
                  const { author, recipient } = conversation;
                  const userToDisplay = user?.id === author.id ? recipient : author;

                  return (
                    <li>
                      <button
                        className={classes.conversation}
                        onClick={() => {
                          setShowStartNewConversation(false);
                          setSelectedConversation({
                            user: userToDisplay,
                            conversation,
                          });
                        }}
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
                          <div className={classes.conversationProfilePosition}>{
                            userToDisplay.position && userToDisplay.company ?
                              (`${userToDisplay.position} at ${userToDisplay.company}`)
                              : ""
                          }</div>
                        </div>
                      </button>
                    </li>
                  );
                })
              }
            </ul>}
          </div>
        </div>
        
        <div className={classes.messagingContainerRight}>
          {
            showStartNewConversation && <div className={classes.newConversationContainer}>
              <div>
                <span>Starting a new conversation</span>
                <Input placeholder="Type a name" inputSize="sm" />
              </div>

              {errorFetchingNewConversationList
                && <span className={classes.errorMessage} >{errorFetchingNewConversationList}</span>}

              {!errorFetchingNewConversationList && newConversationsList.length > 0
                && <ul className={classes.conversationList}>
                  {
                    newConversationsList.map((user) => {
                      return (
                        <li>
                          <button
                            className={classes.conversation}
                            onClick={() => handleStartNewConversation(user)}
                          >
                            <img
                              className={classes.conversationProfileImage}
                              src={user.profilePicture || "/public/avatar.png"}
                            />
                            <div className={classes.conversationProfileInfo}>
                              <div className={classes.conversationProfileName}>{
                                user.firstName && user.lastName ?
                                  (`${user.firstName} ${user.lastName}`)
                                  : ""
                              }</div>
                              <div className={classes.conversationProfilePosition}>{
                                user.position && user.company ?
                                  (`${user.position} at ${user.company}`)
                                  : ""
                              }</div>
                            </div>
                          </button>
                        </li>
                      );
                    })
                  }
                </ul>}
            </div>
          }

          {
            selectedConversation && (
              <div className={classes.selectedConversation}>
                {selectedConversation.user.firstName}
              </div>
            )
          }

          <div className={classes.messageInput}>
            <Input placeholder="Write a message.."  inputSize="md" />
            <button className={classes.sendButton} disabled >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
                  stroke="#000000"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={classes.connectionList}>
        <RightSideBar heading="Add to conversations" />
      </div>
    </div>
  );
}

export default Messaging;