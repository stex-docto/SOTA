import { createContext } from 'react'
import {
    AddSavedEventUseCase,
    CreateEventUseCase,
    CreateRoomUseCase,
    CreateTalkUseCase,
    DeleteEventUseCase,
    DeleteRoomUseCase,
    GetEventUseCase,
    GetRoomsByEventUseCase,
    GetTalksByEventUseCase,
    GetUserAllEventsUseCase,
    GetUserUseCase,
    RemoveSavedEventUseCase,
    SignInUseCase,
    UpdateEventUseCase,
    UpdateRoomUseCase,
    UpdateTalkUseCase,
    UpdateUserProfileUseCase
} from '@application'

export interface DependencyContext {
    signInUseCase: SignInUseCase
    createEventUseCase: CreateEventUseCase
    createTalkUseCase: CreateTalkUseCase
    updateTalkUseCase: UpdateTalkUseCase
    getEventUseCase: GetEventUseCase
    getTalksByEventUseCase: GetTalksByEventUseCase
    getUserUseCase: GetUserUseCase
    updateEventUseCase: UpdateEventUseCase
    deleteEventUseCase: DeleteEventUseCase
    addSavedEventUseCase: AddSavedEventUseCase
    removeSavedEventUseCase: RemoveSavedEventUseCase
    updateUserProfileUseCase: UpdateUserProfileUseCase
    getUserAllEventsUseCase: GetUserAllEventsUseCase
    createRoomUseCase: CreateRoomUseCase
    updateRoomUseCase: UpdateRoomUseCase
    deleteRoomUseCase: DeleteRoomUseCase
    getRoomsByEventUseCase: GetRoomsByEventUseCase
}

export const Dependencies = createContext<DependencyContext | undefined>(undefined)
