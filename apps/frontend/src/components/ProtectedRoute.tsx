'use client'
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("user:", user)
    if (!isAuthenticated) {
      "router.push('/login');"
    }
  }, [isAuthenticated, router]);

  return <>{isAuthenticated ? children : null}</>;
};