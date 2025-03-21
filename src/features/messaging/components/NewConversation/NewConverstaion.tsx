import { useEffect, useState } from "react";
import Input from "../../../authentication/components/Input/Input";
import classes from "./NewConverstaion.module.scss";
import { User } from "../../../authentication/context/TypeInterfaces";
import request from "../../../../utils/api";
import { useNavigate } from "react-router-dom";

function NewConverstaion() {
  const [userList, setUserList] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserList = async () => {
      await request<User[]>({
        endPoint: '/api/v1/authentication/users',
        onSuccess: (data) => {
          setUserList(data);
          setErrorMessage("");
        },
        onFailure: (message) => setErrorMessage(message),
      });
    };

    fetchUserList();
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <span>Starting a new conversation</span>
        <button
          className={classes.closeButton}
          onClick={() => navigate("/messaging")}
        >
          X
        </button>
      </div>
      <Input className={classes.inputStyle} inputSize="md" placeholder="Type a name" />
      <div className={classes.userList}>
        {
          userList.map((user) => (
            <button key={`user-${user.id}`} className={classes.userContainer}>
              <img className={classes.userProfilePicture} alt="" src={user.profilePicture ? user.profilePicture : "/avatar.png"} />
              <div className={classes.userInfo}>
                <span>{`${user.firstName} ${user.lastName}`}</span>
                <span className={classes.companyInfo}>{`${user.position} at ${user.company}`}</span>
              </div>
            </button>
          ))
        }
      </div>
    </div>
  );
}

export default NewConverstaion;