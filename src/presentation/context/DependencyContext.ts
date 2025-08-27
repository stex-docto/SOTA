import {createContext} from 'react';
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

export interface DependencyContext {
    signInUseCase: SignInUseCase;
    createEventUseCase: CreateEventUseCase;
    createTalkUseCase: CreateTalkUseCase;
    getEventUseCase: GetEventUseCase;
    updateEventUseCase: UpdateEventUseCase;
    deleteEventUseCase: DeleteEventUseCase;
    saveEventUseCase: SaveEventUseCase;
    removeSavedEventUseCase: RemoveSavedEventUseCase;
    updateUserProfileUseCase: UpdateUserProfileUseCase;
    getUserAllEventsUseCase: GetUserAllEventsUseCase;
}

export const Dependencies = createContext<DependencyContext | undefined>(undefined);