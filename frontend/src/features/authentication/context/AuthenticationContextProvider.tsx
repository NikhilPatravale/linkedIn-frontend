import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import { API, LOGIN_URL, POST, SIGNUP_URL, V1 } from "../constants/apiConstants";
import { LOGIN, REQUEST_PASSWORD_RESET, SIGNUP } from "../constants/routes";
import { AuthenticationContextType, User } from "./TypeInterfaces";
import fetchClient from "../../../utils/fetchClient";

const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export function useAuthentication() {
  return useContext(AuthenticationContext);
}

function AuthenticationContextProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const isAuthRoute =
        location.pathname === LOGIN ||
        location.pathname === SIGNUP ||
        location.pathname === REQUEST_PASSWORD_RESET;

  const login = useCallback(async (email: string, password: string) => {
    const resp = await fetchClient({
      url: import.meta.env.VITE_API_URL + API + V1 + LOGIN_URL,
      httpMethod: POST,
      body: JSON.stringify({email, password}),
    });

    if (resp.ok) {
      const { token } = await resp.json();
      localStorage.setItem("token", token);
    } else {
      const { message } = await resp.json();
      throw new Error(message);
    }
  }, []);
    
  const signup = useCallback(async (email: string, password: string) => {
    const resp = await fetchClient({
      url: import.meta.env.VITE_API_URL + API + V1 + SIGNUP_URL, 
      httpMethod: POST,
      body: JSON.stringify({ email, password }),
    });
    
    if (resp.ok) {
      const { token } = await resp.json();
      localStorage.setItem("token", token);
    } else {
      const { message } = await resp.json();
      throw new Error(message);
    }
  }, []);
    
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const resp = await fetchClient({
        url: import.meta.env.VITE_API_URL + "/api/v1/authentication/user", 
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }});
    
      if (!resp.ok) {
        throw new Error("Authentication failed");
      }
      const user = await resp.json();
      setUser(user);
    } catch(error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      return;
    }
    fetchUser();
  }, [user, location.pathname]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && !user && !isAuthRoute) {
    return <Navigate to="/login" />;
  }

  if (user && user.emailVerified && isAuthRoute) {
    return <Navigate to="/" />;
  }

  return (
    <AuthenticationContext.Provider value={{ user, login, signup, logout }}>
      {(user && !user.emailVerified) ? <Navigate to="/verify-email" /> : null}
      <Outlet />
    </AuthenticationContext.Provider>
  );
}

export default AuthenticationContextProvider;