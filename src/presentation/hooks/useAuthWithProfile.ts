import {useEffect, useState} from 'react';
import {UserEntity} from '@domain';
import {useDependencies} from '../context/DependencyContext';

export interface AuthWithProfile {
    currentUser: UserEntity | null;
    loading: boolean;
}

export function useAuthWithProfile(): AuthWithProfile {
    const {userRepository} = useDependencies();
    const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to current user changes
        return userRepository.subscribeToCurrentUser(
            async (user) => {
                setCurrentUser(user);
                setLoading(false);
            });
    }, [userRepository]);

    return {
        currentUser,
        loading
    };
}