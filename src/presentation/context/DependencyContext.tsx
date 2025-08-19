import React, { createContext, useContext } from 'react';
import { AuthenticationPort } from '@application/ports/AuthenticationPort';
import { FirebaseAuthAdapter } from '@infrastructure/auth/FirebaseAuthAdapter';
import { UserRepository } from '@domain/repositories/UserRepository';
import { FirebaseUserDatastore } from '@infrastructure/datastores/FirebaseUserDatastore';

interface Dependencies {
  authService: AuthenticationPort;
  userRepository: UserRepository;
}

const DependencyContext = createContext<Dependencies | undefined>(undefined);

export function useDependencies() {
  const context = useContext(DependencyContext);
  if (context === undefined) {
    throw new Error('useDependencies must be used within a DependencyProvider');
  }
  return context;
}

interface DependencyProviderProps {
  children: React.ReactNode;
}

export function DependencyProvider({ children }: DependencyProviderProps) {
  const userRepository: UserRepository = new FirebaseUserDatastore();
  const authService = new FirebaseAuthAdapter(userRepository);

  const dependencies: Dependencies = {
    authService,
    userRepository
  };

  return (
    <DependencyContext.Provider value={dependencies}>
      {children}
    </DependencyContext.Provider>
  );
}