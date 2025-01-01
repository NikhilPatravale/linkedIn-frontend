import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Feed } from './features/feed/Pages/Feed/Feed';
import Login from './features/authentication/pages/Login/Login';
import Signup from './features/authentication/pages/Signup/Signup';
import VerifyEmail from './features/authentication/pages/VerifyEmail/VerifyEmail';
import ResetPassword from './features/authentication/pages/ResetPassword/ResetPassword';
import AuthenticationContextProvider from './features/authentication/context/AuthenticationContextProvider';
import AuthenticationLayout from './features/authentication/components/AuthenticationLayout/AuthenticationLayout';
import ApplicationLayout from './components/ApplicationLayout/ApplicationLayout';

const router = createBrowserRouter([
  {
    element: <AuthenticationContextProvider />,
    children: [
      {
        path: "/",
        element: <ApplicationLayout />,
        children: [
          {
            path: "/",
            element: <Feed />
          },
          {
            path: "/network",
            element: <div>Network</div>
          },
          {
            path: "/jobs",
            element: <div>Jobs</div>
          },
          {
            path: "/messaging",
            element: <div>Messaging</div>
          },
          {
            path: "/notifications",
            element: <div>Notifications</div>
          },
          {
            path: "/view-profile",
            element: <div>View Profile</div>
          }
        ]
      },
      {
        path: "/authentication",
        element: <AuthenticationLayout />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "signup",
            element: <Signup />,
          },
          {
            path: "verify-email",
            element: <VerifyEmail />,
          },
          {
            path: "request-password-reset",
            element: <ResetPassword />,
          },
        ]
      }
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
