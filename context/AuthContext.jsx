
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to fetch user data from the token
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setLoading(false);
                return;
            }
            
            // Set up axios with the token
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Fetch current user data
            const response = await axios.get('/api/auth/user/');
            setUser({ token, ...response.data });
        } catch (error) {
            // If fetching user data fails, clear the auth state
            console.error('Failed to fetch user data:', error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // On initial load, check if we have a token and fetch user data
        fetchUserData();
    }, []);


    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login/', { username: email, password });
            const { access, refresh, user } = response.data;
            
            // Store tokens
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            
            // Set user data with role
            setUser({ token: access, ...user });
            return { 
                success: true, 
                user: user,
                role: user.role 
            };
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const signup = async (userData) => {
        try {
            const response = await axios.post('/api/auth/register/', userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || 'Signup failed' };
        }
    };

    const isAuthenticated = () => {
        return !!localStorage.getItem('access_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
