import type { User } from '../types';

export const AUTH_USER_KEY = 'insurance_user';
export const AUTH_TOKEN_KEY = 'insurance_access_token';
export const AUTH_REFRESH_TOKEN_KEY = 'insurance_refresh_token';

export interface AuthSession {
    user: User;
    token: string;
    refreshToken?: string;
}

export const getStoredUser = (): User | null => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw) as User;
    } catch {
        localStorage.removeItem(AUTH_USER_KEY);
        return null;
    }
};

export const getAccessToken = (): string | null => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthSession = (session: AuthSession): void => {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
    localStorage.setItem(AUTH_TOKEN_KEY, session.token);
    if (session.refreshToken) {
        localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, session.refreshToken);
    }
};

export const clearAuthSession = (): void => {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
};
