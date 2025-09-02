import { createContext } from 'react'
import {
    SignInUseCase,
    CreateEventUseCase,
    CreateTalkUseCase,
    GetEventUseCase,
    UpdateEventUseCase,
    DeleteEventUseCase,
    AddSavedEventUseCase,
    RemoveSavedEventUseCase,
    UpdateUserProfileUseCase,
    GetUserAllEventsUseCase,
    CreateRoomUseCase,
    UpdateRoomUseCase,
    DeleteRoomUseCase,
    GetRoomsByEventUseCase
} from '@application'

export interface DependencyContext {
    signInUseCase: SignInUseCase
    createEventUseCase: CreateEventUseCase
    createTalkUseCase: CreateTalkUseCase
    getEventUseCase: GetEventUseCase
    updateEventUseCase: UpdateEventUseCase
    deleteEventUseCase: DeleteEventUseCase
    saveEventUseCase: AddSavedEventUseCase
    removeSavedEventUseCase: RemoveSavedEventUseCase
    updateUserProfileUseCase: UpdateUserProfileUseCase
    getUserAllEventsUseCase: GetUserAllEventsUseCase
    createRoomUseCase: CreateRoomUseCase
    updateRoomUseCase: UpdateRoomUseCase
    deleteRoomUseCase: DeleteRoomUseCase
    getRoomsByEventUseCase: GetRoomsByEventUseCase
}

export const Dependencies = createContext<DependencyContext | undefined>(undefined)
