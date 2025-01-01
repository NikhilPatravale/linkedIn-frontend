import { Dispatch, SetStateAction } from 'react';
import classes from './Profile.module.scss';
import { useAuthentication } from '../../../features/authentication/context/AuthenticationContextProvider';
import Button from '../../../features/authentication/components/Button/Button';
import { NavLink, useNavigate } from 'react-router-dom';

interface ProfileProps {
  setShowNavMenu: Dispatch<SetStateAction<boolean>>,
  setShowProfileMenu: Dispatch<SetStateAction<boolean>>,
  showProfileMenu: boolean
}

function Profile({setShowNavMenu, showProfileMenu, setShowProfileMenu}: ProfileProps) {
  const { user } = useAuthentication() || {
    user: {
      firstName: "",
      lastName: "",
      company: "",
      position: "",
      profilePicture: ""
    }
  };
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <button
        className={classes.profile}
        onClick={() => {
          setShowProfileMenu((prev) => !prev);
          if (window.innerWidth <= 1080) {
            setShowNavMenu(false);
          }
        }}
      >
        <img className={classes.avatar} src={user!.profilePicture || '/avatar.png'} />
        <div>{user?.firstName + " " + user?.lastName?.charAt(0) + "."}</div>
      </button>
      {showProfileMenu ? <div className={classes.menu}>
        <div className={classes.menuProfile}>
          <img className={classes.avatar} src={user!.profilePicture || '/avatar.png'} />
          <div>{user?.position + " at " + user?.company}</div>
        </div>
        <div className={classes.links}>
          <Button
            type="button"
            size="sm"
            outline
            onClick={() => {
              navigate("/view-profile");
              setShowProfileMenu((prev) => !prev);
              if (window.innerWidth <= 1080) {
                setShowNavMenu(false);
              }
            }}
          >
            View Profile
          </Button>
          <NavLink
            to="/settings-privacy"
            onClick={(e) => {
              e.preventDefault();
              setShowProfileMenu((prev) => !prev);
              if (window.innerWidth <= 1080) {
                setShowNavMenu(false);
              }
            }}
          >
            Settings & Privacy
          </NavLink>
          <NavLink
            to="/login"
            onClick={(e) => {
              e.preventDefault();
              setShowProfileMenu((prev) => !prev);
              if (window.innerWidth <= 1080) {
                setShowNavMenu(false);
              }
            }}
          >
            Signout
          </NavLink>
        </div>
      </div> : null}
    </div>
  );
}

export default Profile;