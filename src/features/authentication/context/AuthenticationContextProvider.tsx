import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import { POST } from "../constants/apiConstants";
import { LOGIN, PROFILE, REQUEST_PASSWORD_RESET, SIGNUP, VERIFY_EMAIL } from "../constants/routes";
import { AuthenticationContextType, AuthReponseType, User } from "./TypeInterfaces";
import request from "../../../utils/api";

const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export function useAuthentication(): AuthenticationContextType | null {
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
    await request<AuthReponseType>({
      endPoint: "/api/v1/authentication/login",
      httpMethod: POST,
      body: JSON.stringify({email, password}),
      onSuccess: ({ token }) => {
        localStorage.setItem("token", token);
      },
      onFailure: (error) => {
        console.log(error);
      }
    });
  }, []);
    
  const signup = useCallback(async (email: string, password: string) => {
    await request<AuthReponseType>({
      endPoint: "/api/v1/authentication/register",
      httpMethod: POST,
      body: JSON.stringify({ email, password }),
      onSuccess: ({ token }) => {
        localStorage.setItem("token", token);
      },
      onFailure: (error) => {
        console.log(error);
      }
    });
  }, []);
    
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    await request<User>({
      endPoint: "/api/v1/authentication/user",
      onSuccess: (data: User) => {
        setUser(data);
      },
      onFailure: (error: string) => {
        console.log(error);
      }
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      return;
    }
    fetchUser();
  }, [fetchUser, user, location.pathname]);

  if (isLoading) {
    return <Loader />;
  }

  if (!user && !isAuthRoute) {
    return <Navigate to={LOGIN} />;
  }

  if (user && !user.emailVerified && !location.pathname.includes(VERIFY_EMAIL)) {
    return <Navigate to={VERIFY_EMAIL} />;
  }

  if (user && user.emailVerified && !user.profileComplete && !location.pathname.includes(PROFILE)) {
    return <Navigate to={PROFILE} />;
  }

  if (user && user.emailVerified && user.profileComplete && isAuthRoute) {
    return <Navigate to="/" />;
  }

  return (
    <AuthenticationContext.Provider value={{ user, login, signup, logout, setUser }}>
      <Outlet />
    </AuthenticationContext.Provider>
  );
}

export default AuthenticationContextProvider;