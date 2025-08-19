import React, {createContext, useContext, useEffect, useState} from 'react';
import {UserEntity} from '@domain/entities/User';
import {AuthCredentials} from '@application/ports/AuthenticationPort';
import {useDependencies} from './DependencyContext';

interface AuthContextType {
  currentUser: UserEntity | null;
  loading: boolean;
  signUp: (credentials: AuthCredentials, displayName: string) => Promise<UserEntity>;
  signInWithEmail: (credentials: AuthCredentials) => Promise<UserEntity>;
  signInWithGoogle: () => Promise<UserEntity>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const { authService } = useDependencies();

  useEffect(() => {
    return authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, [authService]);

  const signUp = async (credentials: AuthCredentials, displayName: string): Promise<UserEntity> => {
    return await authService.signUpWithEmail(credentials, displayName);
  };

  const signInWithEmail = async (credentials: AuthCredentials): Promise<UserEntity> => {
    return await authService.signInWithEmail(credentials);
  };

  const signInWithGoogle = async (): Promise<UserEntity> => {
    return await authService.signInWithGoogle();
  };

  const signOut = async (): Promise<void> => {
    await authService.signOut();
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signUp,
    signInWithEmail,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}