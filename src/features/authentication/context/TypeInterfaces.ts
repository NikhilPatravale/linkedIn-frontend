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