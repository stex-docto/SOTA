import React, {createContext, useContext, useEffect, useState} from 'react';
import {CredentialRepository, UserRepository} from '@domain';
import { FirebaseUserDatastore } from '@infrastructure/datastores/FirebaseUserDatastore';
import {Firebase} from "@infrastructure/firebase.ts";
import {LoadingScreen} from "@presentation/components/LoadingScreen.tsx";
import {LocalCredentialDataStore} from "@infrastructure/datastores/LocalCredentialDataStore.ts";

interface Dependencies {
  userRepository: UserRepository;
  credentialRepository: CredentialRepository;
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

async function initDependencies() {
  const firebase = Firebase.getInstance()
  const userRepository: UserRepository = new FirebaseUserDatastore(firebase.auth, firebase.firestore);

  return {
    userRepository,
    credentialRepository: new LocalCredentialDataStore()
  };
}

export function DependencyProvider({ children }: DependencyProviderProps) {
  const  [dependencies, setDependencies] = useState<Dependencies>();

  useEffect(() => {
    initDependencies().then(setDependencies)
  }, [])

  return dependencies ? <DependencyContext.Provider value={dependencies}>{children}</DependencyContext.Provider> : <LoadingScreen />
}