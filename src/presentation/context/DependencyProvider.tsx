import React, {useEffect, useState} from 'react';
import {EventRepository, UserRepository, TalkRepository} from '@domain';
import {
    SignInUseCase,
    CreateEventUseCase,
    CreateTalkUseCase,
    GetEventUseCase,
    UpdateEventUseCase,
    DeleteEventUseCase,
    SaveEventUseCase,
    RemoveSavedEventUseCase,
    UpdateUserProfileUseCase,
    GetUserAllEventsUseCase
} from '@application';
import {FirebaseUserDatastore} from '@infrastructure/datastores/FirebaseUserDatastore';
import {FirebaseEventDatastore} from '@infrastructure/datastores/FirebaseEventDatastore';
import {FirebaseTalkDatastore} from '@infrastructure/datastores/FirebaseTalkDatastore';
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
    const eventRepository: EventRepository = new FirebaseEventDatastore(firebase.firestore, userRepository);
    const talkRepository: TalkRepository = new FirebaseTalkDatastore(firebase.firestore);
    const credentialRepository = new LocalCredentialDataStore();
    
    // Initialize use cases
    const signInUseCase = new SignInUseCase(userRepository, credentialRepository);
    const createEventUseCase = new CreateEventUseCase(eventRepository, userRepository);
    const createTalkUseCase = new CreateTalkUseCase(talkRepository, signInUseCase);
    const getEventUseCase = new GetEventUseCase(eventRepository);
    const updateEventUseCase = new UpdateEventUseCase(eventRepository, userRepository);
    const deleteEventUseCase = new DeleteEventUseCase(eventRepository, userRepository);
    const saveEventUseCase = new SaveEventUseCase(userRepository, signInUseCase);
    const removeSavedEventUseCase = new RemoveSavedEventUseCase(userRepository);
    const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);
    const getUserAllEventsUseCase = new GetUserAllEventsUseCase(eventRepository, userRepository);

    return {
        signInUseCase,
        createEventUseCase,
        createTalkUseCase,
        getEventUseCase,
        updateEventUseCase,
        deleteEventUseCase,
        saveEventUseCase,
        removeSavedEventUseCase,
        updateUserProfileUseCase,
        getUserAllEventsUseCase
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