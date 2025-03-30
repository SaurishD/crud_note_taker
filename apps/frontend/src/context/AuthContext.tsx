"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import { useRouter } from 'next/navigation';


type User = {
  userId: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  login: () => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const isAuthenticated = !!user;

  useEffect(() => {
    const checkAuthStatus = async (): Promise<void> => {
        try {
          const response = await fetch('/auth/me', {
            credentials: 'include' // Important: this sends cookies with the request
          });
          
          if (response.ok) {
            const userData: User = await response.json();
            setUser(userData);
          } else {
            // Not authenticated
            setUser(null);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          setUser(null);
        } 
      };
    
    checkAuthStatus();
  }, []);

  const login = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const logout = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      withCredentials: true,
    });
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);