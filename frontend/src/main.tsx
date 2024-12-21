import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Feed } from './features/feed/Feed';
import Login from './features/authentication/pages/Login/Login';
import Signup from './features/authentication/pages/Signup/Signup';
import VerifyEmail from './features/authentication/pages/VerifyEmail/VerifyEmail';
import ResetPassword from './features/authentication/pages/ResetPassword/ResetPassword';
import AuthenticationContextProvider from './features/authentication/context/AuthenticationContextProvider';

const router = createBrowserRouter([
  {
    element: <AuthenticationContextProvider />,
    children: [
      {
        path: "/",
        element: <Feed />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/request-password-reset",
        element: <ResetPassword />,
      },
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
