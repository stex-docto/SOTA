import {useEffect, useState} from 'react';
import {UserEntity} from '@domain';
import {useDependencies} from '../context/DependencyContext';

export interface AuthWithProfile {
    currentUser: UserEntity | null;
}

export function useAuthWithProfile(): AuthWithProfile {
    const {userRepository} = useDependencies();
    const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
    useEffect(() => {
        userRepository.getCurrentUser().then(setCurrentUser)
        // Subscribe to current user changes
        return userRepository.subscribeToCurrentUser(
            async (user) => {
                setCurrentUser(user);
            });
    }, [userRepository]);

    return {
        currentUser
    };
}