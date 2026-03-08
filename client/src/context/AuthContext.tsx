import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import type { AuthSession } from '../services/authStorage';
import { clearAuthSession, getStoredUser, setAuthSession } from '../services/authStorage';

interface AuthContextType {
    user: User | null;
    login: (session: AuthSession) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = getStoredUser();
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const login = (session: AuthSession) => {
        setUser(session.user);
        setAuthSession(session);
    };

    const logout = () => {
        setUser(null);
        clearAuthSession();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
