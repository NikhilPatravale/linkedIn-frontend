export interface User {
    id: string,
    email: string,
    emailVerified: boolean,
    profilePicture?: string,
    firstName?: string,
    lastName?: string,
    company?: string,
    position?: string,
    profileComplete: boolean,
}

export interface AuthenticationContextType {
    user: User | null,
    login: (email: string, password: string) => Promise<void>,
    signup: (email: string, password: string) => Promise<void>,
    logout: () => void,
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}