import {createContext, useState, useEffect, type ReactNode} from 'react';
import {type ILoginPayload, type IRegisterPayload, loginUser, registerUser} from "../services/auth.service.ts";

interface IUser {
    id: string;
    email: string;
}

interface IApiResponseData {
    token: string;
    user: IUser;
}

interface IAuthContext {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (payload: ILoginPayload) => Promise<boolean>;
    register: (payload: IRegisterPayload) => Promise<boolean>;
    logout: () => void;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Gagal mem-parsing user dari localStorage", error);
            localStorage.clear();
        } finally {
            setIsLoading(false);
        }
    }, []);

    const setAuthData = (data: IApiResponseData) => {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    const login = async (payload: ILoginPayload) => {
       console.log("Login payload:", payload);
        try {
            const response = await loginUser(payload);
            if (response.responseCode === "SUCCESS") {
                setAuthData(response.responseData);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login gagal:", error);
            return false;
        }
    };

    const register = async (payload: IRegisterPayload) => {
        try {
            const response = await registerUser(payload);
            if (response.responseCode === "CREATED") {
                setAuthData(response.responseData);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Registrasi gagal:", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const authValues = {
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={authValues}>
            {children}
        </AuthContext.Provider>
    );
};