import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { get_auth, login } from "../api/endpoints.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    const toast = useToast();
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    //check if user is logged in
    const check_auth = async () => {
        try {
            await get_auth();
            setAuth(true);
        } catch (error) {
            setAuth(false);
        } finally {
            setAuthLoading(false);
        }
    };

    //login
    const auth_login = async (username, password) => {
        try {
            const data = await login(username, password);
            if (data.success) {
                setAuth(true);
                const userData = {
                    "username": data.username,
                    "bio": data.bio,
                    "email": data.email,
                    "first_name": data.first_name,
                    "last_name": data.last_name
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                toast({
                    title: 'Login Successful',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
                navigate(`/${username}`);
            } else {
                toast({
                    title: 'Invalid credentials',
                    description: 'Please check your username and password.',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            }
        } catch (error) {
            if (error.message === 'Network Error') {
                toast({
                    title: 'Backend Offline',
                    description: 'The server is currently offline. Please try again later.',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error Logging In',
                    description: error.response?.data?.message || 'An error occurred during login.',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            }
        }
    };

    //run check_auth on every '/' path changed
    useEffect(() => {
        check_auth();
    }, [window.location.pathname]);

    return (
        <AuthContext.Provider value={{ auth, authLoading, auth_login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
