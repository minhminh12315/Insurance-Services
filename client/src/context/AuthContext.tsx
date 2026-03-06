import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';
import type { AuthSession } from '../services/authStorage';
import { clearAuthSession, getAccessToken, getStoredUser, setAuthSession } from '../services/authStorage';

interface AuthContextType {
    user: User | null;
    login: (session: AuthSession) => void;
    logout: () => void;
    updateUser: (user: User) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => getStoredUser());

    const login = (session: AuthSession) => {
        setUser(session.user);
        setAuthSession(session);
    };

    const logout = () => {
        setUser(null);
        clearAuthSession();
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        const stored = getAccessToken();
        if (stored) {
            setAuthSession({ user: updatedUser, token: stored });
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
