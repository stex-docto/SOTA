import {createContext} from 'react';
import {CredentialRepository, EventRepository, UserRepository} from '@domain';

export interface DependencyContext {
    userRepository: UserRepository;
    credentialRepository: CredentialRepository;
    eventRepository: EventRepository;
}

export const Dependencies = createContext<DependencyContext | undefined>(undefined);