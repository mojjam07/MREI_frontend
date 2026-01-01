import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import { API_ENDPOINTS } from "../config";

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
            
            // Set up apiClient with the token (handled by interceptor)
            // Fetch current user data - using proper endpoint from config
            const userResponse = await apiClient.get(API_ENDPOINTS.AUTH.USER);
            console.log('Fetched user data:', userResponse.data);
            
            // Safely extract user data with fallbacks
            const userData = userResponse.data?.user || userResponse.data || {};
            setUser({ token, ...userData });
        } catch (error) {
            // If fetching user data fails, clear the auth state
            console.error('Failed to fetch user data:', error);
            
            // Clear tokens on auth failure
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }
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
            console.log('Attempting login with:', { email, password });
            const loginResponse = await apiClient.post('/auth/login', { email, password });
            console.log('Login response:', loginResponse.data);
            
            // Handle different response formats
            const responseData = loginResponse.data?.data || loginResponse.data;
            const { access, accessToken, refresh, refreshToken, user } = responseData;
            
            // Get tokens - handle both formats
            const accessTokenVal = access || accessToken;
            const refreshTokenVal = refresh || refreshToken;

            // Store tokens
            localStorage.setItem('access_token', accessTokenVal);
            localStorage.setItem('refresh_token', refreshTokenVal);

            // Get user data - handle different response structures
            const userData = user || responseData.user || responseData;
            
            // Ensure user has a role
            if (!userData.role) {
                console.warn('Login response missing role:', userData);
            }

            // Set user data with token directly from login response
            // Don't rely on fetchUserData immediately as it might fail
            const authUser = { token: accessTokenVal, ...userData };
            setUser(authUser);
            
            console.log('Login successful, user set:', authUser);
            
            return {
                success: true,
                user: authUser,
                role: userData.role || userData.role
            };
        } catch (error) {
            console.error('Login error:', error);
            
            // Clear any existing tokens on login failure
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
            
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed';
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Authorization header is handled by apiClient interceptor
        setUser(null);
    };

    const signup = async (userData) => {
        try {
            await apiClient.post('/auth/register', userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.response?.data?.detail || 'Signup failed' };
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


// import { createContext, useContext, useState, useEffect } from "react";
// import apiClient from "../services/apiClient";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // Function to fetch user data from the token
//     const fetchUserData = async () => {
//         try {
//             const token = localStorage.getItem('access_token');
//             if (!token) {
//                 setLoading(false);
//                 return;
//             }
            
//             // Set up apiClient with the token (handled by interceptor)
//             // Fetch current user data
//             const userResponse = await apiClient.get('/auth/user');
//             console.log('Fetched user data:', userResponse.data);
//             setUser({ token, ...userResponse.data.user });
//         } catch (error) {
//             // If fetching user data fails, clear the auth state
//             console.error('Failed to fetch user data:', error);
//             localStorage.removeItem('access_token');
//             localStorage.removeItem('refresh_token');
//             setUser(null);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         // On initial load, check if we have a token and fetch user data
//         fetchUserData();
//     }, []);


//     const login = async (email, password) => {
//         try {
//             console.log('Attempting login with:', { email, password });
//             const loginResponse = await apiClient.post('/auth/login', { email, password });
//             console.log('Login response:', loginResponse.data);
            
//             const { access, refresh, user } = loginResponse.data;

//             // Store tokens
//             localStorage.setItem('access_token', access);
//             localStorage.setItem('refresh_token', refresh);

//             // Set user data with role
//             setUser({ token: access, ...user });
//             return {
//                 success: true,
//                 user: user,
//                 role: user.role
//             };
//         } catch (error) {
//             console.error('Login error:', error);
//             const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed';
//             return { success: false, error: errorMessage };
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         // Authorization header is handled by apiClient interceptor
//         setUser(null);
//     };

//     const signup = async (userData) => {
//         try {
//             const response = await apiClient.post('/auth/register', userData);
//             return { success: true };
//         } catch (error) {
//             return { success: false, error: error.response?.data?.message || error.response?.data?.detail || 'Signup failed' };
//         }
//     };

//     const isAuthenticated = () => {
//         return !!localStorage.getItem('access_token');
//     };

//     return (
//         <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);
