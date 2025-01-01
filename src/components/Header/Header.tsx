import { NavLink } from 'react-router-dom';
import Input from '../../features/authentication/components/Input/Input';
import classes from './Header.module.scss';
import Profile from './Components/Profile';
import { useEffect, useState } from 'react';
import { useAuthentication } from '../../features/authentication/context/AuthenticationContextProvider';

function Header() {
  const [showNavMenu, setShowNavMenu] = useState(
    window.innerWidth > 1080 ? true : false
  );
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user } = useAuthentication() || { user: {} };
  
  useEffect(() => {
    const handleResize = () => {
      setShowNavMenu(window.innerWidth > 1080);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.left}>
          <NavLink to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={classes.logo}
            >
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
            </svg>
          </NavLink>
          <Input placeholder="Search" inputSize="sm" />
        </div>
        <div className={classes.right}>
          <button
            className={classes.toggle}
            onClick={() => {
              setShowNavMenu((prev) => !prev);
              setShowProfileMenu(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              className={classes.menu}
            >
              <path d="M48,6.5C48,5.7,47.3,5,46.5,5h-41C4.7,5,4,5.7,4,6.5v3C4,10.3,4.7,11,5.5,11h41c0.8,0,1.5-0.7,1.5-1.5V6.5z"/>
              <path d="M48,18.5c0-0.8-0.7-1.5-1.5-1.5h-41C4.7,17,4,17.7,4,18.5v3C4,22.3,4.7,23,5.5,23h41c0.8,0,1.5-0.7,1.5-1.5  V18.5z"/>
              <path d="M48,42.5c0-0.8-0.7-1.5-1.5-1.5h-41C4.7,41,4,41.7,4,42.5v3C4,46.3,4.7,47,5.5,47h41c0.8,0,1.5-0.7,1.5-1.5  V42.5z"/>
              <path d="M48,30.5c0-0.8-0.7-1.5-1.5-1.5h-41C4.7,29,4,29.7,4,30.5v3C4,34.3,4.7,35,5.5,35h41c0.8,0,1.5-0.7,1.5-1.5  V30.5z"/>
            </svg>
            <span>Menu</span>
          </button>
          {showNavMenu ? (
            <ul>
              <li>
                <NavLink
                  to="/"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavMenu(false);
                    }
                  }}
                  className={({isActive}) => (isActive ? classes.active : "")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"></path>
                  </svg>
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/network"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavMenu(false);
                    }
                  }}
                  className={({isActive}) => (isActive ? classes.active : "")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
                  </svg>
                  <span>Network</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/jobs"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavMenu(false);
                    }
                  }}
                  className={({isActive}) => (isActive ? classes.active : "")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17 6V5a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H2v4a3 3 0 003 3h14a3 3 0 003-3V6zM9 5a1 1 0 011-1h4a1 1 0 011 1v1H9zm10 9a4 4 0 003-1.38V17a3 3 0 01-3 3H5a3 3 0 01-3-3v-4.38A4 4 0 005 14z"></path>
                  </svg>
                  <span>Jobs</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/messaging"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavMenu(false);
                    }
                  }}
                  className={({isActive}) => (isActive ? classes.active : "")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
                  </svg>
                  <span>Messaging</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/notifications"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.innerWidth <= 1080) {
                      setShowNavMenu(false);
                    }
                  }}
                  className={({isActive}) => (isActive ? classes.active : "")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z"></path>
                  </svg>
                  <span>Notifications</span>
                </NavLink>
              </li>
            </ul>
          ) : null}
          {user && <Profile
            setShowNavMenu={setShowNavMenu}
            setShowProfileMenu={setShowProfileMenu}
            showProfileMenu={showProfileMenu}
          />}
        </div>
      </div>
    </div>
  );
}

export default Header;