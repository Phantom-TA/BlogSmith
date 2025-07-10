import { useContext, createContext, useState, useEffect } from "react";
import apiClient from "../../service/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const res = await apiClient.getCurrentUser();
            if (res.success) setUser(res.data.user);
            else setUser(null);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = (userData) => setUser(userData);
    const logout = async () => {
        await apiClient.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
