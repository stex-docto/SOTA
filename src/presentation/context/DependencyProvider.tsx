import React, {useEffect, useState} from 'react';
import {EventRepository, UserRepository} from '@domain';
import {FirebaseUserDatastore} from '@infrastructure/datastores/FirebaseUserDatastore';
import {FirebaseEventDatastore} from '@infrastructure/datastores/FirebaseEventDatastore';
import {Firebase} from "@infrastructure/firebase.ts";
import {LoadingScreen} from "@presentation/components/LoadingScreen.tsx";
import {LocalCredentialDataStore} from "@infrastructure/datastores/LocalCredentialDataStore.ts";
import {Dependencies, DependencyContext} from './DependencyContext.ts';

interface DependencyProviderProps {
    children: React.ReactNode;
}

async function initDependencies() {
    const firebase = Firebase.getInstance()
    const userRepository: UserRepository = new FirebaseUserDatastore(firebase.auth, firebase.firestore);
    const eventRepository: EventRepository = new FirebaseEventDatastore(firebase.firestore);

    return {
        userRepository,
        credentialRepository: new LocalCredentialDataStore(),
        eventRepository
    };
}

export function DependencyProvider({children}: DependencyProviderProps) {
    const [dependencies, setDependencies] = useState<DependencyContext>();

    useEffect(() => {
        initDependencies().then(setDependencies)
    }, [])

    return dependencies ? <Dependencies.Provider value={dependencies}>{children}</Dependencies.Provider> :
        <LoadingScreen/>
}