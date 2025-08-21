import { createContext } from 'react';
import { CredentialRepository, UserRepository } from '@domain';

export interface DependencyContext {
  userRepository: UserRepository;
  credentialRepository: CredentialRepository;
}

export const Dependencies = createContext<DependencyContext | undefined>(undefined);