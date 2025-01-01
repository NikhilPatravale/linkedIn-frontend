import { useAuthentication } from "../../../authentication/context/AuthenticationContextProvider";
import classes from "./LeftSideBar.module.scss";

function LeftSideBar() {
  const context = useAuthentication();
  const { user } = context || {};

  return (
    <div className={classes.root}>
      <div className={classes.coverPicture}>
        <img src="./full-stack-dev.png" alt="" />
      </div>
      <div className={classes.avatar}>
        <img src={user ? user.profilePicture : "./avatar.png"} alt="" />
      </div>
      <div className={classes.name}>{user?.firstName + " " + user?.lastName}</div>
      <div className={classes.companyInfo}>{user?.position + " at " + user?.company}</div>
      <div className={classes.infoItems}>
        <div className={classes.infoItem}>
          <div>Profile Views</div>
          <div>105000</div>
        </div>
        <div className={classes.infoItem}>
          <div>Profile Views</div>
          <div>105000</div>
        </div>
      </div>
    </div>
  );
}

export default LeftSideBar;