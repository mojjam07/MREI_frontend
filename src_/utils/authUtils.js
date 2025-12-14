import apiClient from '../services/apiClient';
import { API_ENDPOINTS } from '../config';

/**
 * Authentication utility functions
 * These are separated to avoid Fast Refresh issues in AuthContext
 */

// Function to fetch current user data
export const fetchUserData = async () => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            return null;
        }
        
        const response = await apiClient.get(API_ENDPOINTS.AUTH.USER);
        const userData = response.data;
        
        const userWithRole = {
            ...userData,
            role: userData.role || userData.user?.role
        };
        
        return userWithRole;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null;
    }
};

// Function to refresh access token
export const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
            refresh: refreshToken
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);
        return access;
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
    }
};

// Function to handle logout
export const handleLogout = async () => {
    try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};

// Function to handle login
export const handleLogin = async (email, password) => {
    try {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { 
            username: email, 
            password 
        });
        
        const { access, refresh, user: userData } = response.data;
        
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        
        const userWithRole = {
            ...userData,
            role: userData.role
        };
        
        return { 
            success: true, 
            user: userWithRole,
            role: userWithRole.role 
        };
    } catch (error) {
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.non_field_errors?.[0] || 
                           'Login failed';
        return { success: false, error: errorMessage };
    }
};

// Function to handle signup
export const handleSignup = async (userData) => {
    try {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        
        return { 
            success: true, 
            message: 'Registration successful! Please check your email for verification.',
            data: response.data 
        };
    } catch (error) {
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.email?.[0] ||
                           error.response?.data?.username?.[0] ||
                           'Registration failed';
        return { success: false, error: errorMessage };
    }
};

// Authentication helper functions
export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
};

export const getUserRole = (user) => {
    return user?.role || null;
};

export const hasRole = (user, role) => {
    return user?.role === role;
};

export const hasAnyRole = (user, roles) => {
    return user?.role && roles.includes(user.role);
};
