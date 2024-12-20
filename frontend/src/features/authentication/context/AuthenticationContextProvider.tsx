import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";

export interface User {
    id: string,
    email: string,
    emailVerified: boolean,
}

export interface AuthenticationContextType {
    user: User | null,
    login: (email: string, password: string) => Promise<void>,
    signup: (email: string, password: string) => Promise<void>,
    logout: () => void,
}

const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export function useAuthentication() {
    return useContext(AuthenticationContext);
}

function AuthenticationContextProvider() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    const isAuthRoute =
        location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname === "/request-password-reset";

    const login = async (email: string, password: string) => {
        const resp = await fetch(import.meta.env.VITE_API_URL + "/api/v1/authentication/login", {
            method: "POST",
            headers: {
                'Content-type': "application/json",
            },
            body: JSON.stringify({email, password}),
        });
        if (resp.ok) {
            const { token } = await resp.json();
            localStorage.setItem("token", token);
        } else {
            const { message } = await resp.json();
            throw new Error(message);
        }
    }
    
    const signup = async (email: string, password: string) => {
        const resp = await fetch(import.meta.env.VITE_API_URL + "/api/v1/authentication/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
    
        if (resp.ok) {
            const { token } = await resp.json();
            localStorage.setItem("token", token);
        } else {
            const { message } = await resp.json();
            throw new Error(message);
        }
    }
    
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    const fetchUser = async () => {
        try {
            const resp = await fetch(import.meta.env.VITE_API_URL + "/api/v1/authentication/user", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            })
    
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
    }

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
        return <Navigate to="/login" />
    }

    if (user && user.emailVerified && isAuthRoute) {
        return <Navigate to="/" />
    }

    return (
        <AuthenticationContext.Provider value={{ user, login, signup, logout }}>
            {(user && !user.emailVerified) ? <Navigate to="/verify-email" /> : null}
            <Outlet />
        </AuthenticationContext.Provider>
    );
}

export default AuthenticationContextProvider;