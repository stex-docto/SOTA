import { useEffect, useMemo, useState } from 'react'
import { EventEntity, RoomEntity, TalkEntity } from '@domain'
import { useDependencies } from './useDependencies'
import { useMoment } from './useMoment'

export interface TalkWithRoom {
    talk: TalkEntity
    room?: RoomEntity
}

export interface TalksForEventHook {
    talks: TalkEntity[]
    upcomingTalks: TalkWithRoom[]
    pastTalks: TalkWithRoom[]
    currentTalks: TalkWithRoom[]
    loading: boolean
}

export function useTalksForEvent(event: EventEntity): TalksForEventHook {
    const { getTalksByEventUseCase } = useDependencies()
    const { now } = useMoment()
    const [talks, setTalks] = useState<TalkEntity[]>([])
    const [loading, setLoading] = useState(true)

    const rooms = event.getRooms()

    useEffect(() => {
        setLoading(true)

        const unsubscribe = getTalksByEventUseCase.subscribe({ eventId: event.id }, result => {
            setTalks(result.talks)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [event.id, getTalksByEventUseCase])

    const { upcomingTalks, pastTalks, currentTalks } = useMemo(() => {
        const nowDate = now.toDate()

        // Past talks: completely finished (after end time)
        const past = talks
            .filter(talk => talk.endDateTime <= nowDate)
            .map(talk => ({ talk, room: rooms.find(r => r.id.equals(talk.roomId)) }))
            .sort((a, b) => b.talk.startDateTime.getTime() - a.talk.startDateTime.getTime())

        // Current talks: started but not yet ended
        const current = talks
            .filter(talk => talk.startDateTime <= nowDate && talk.endDateTime > nowDate)
            .map(talk => ({ talk, room: rooms.find(r => r.id.equals(talk.roomId)) }))
            .sort((a, b) => a.talk.startDateTime.getTime() - b.talk.startDateTime.getTime())

        // Upcoming talks: not yet started
        const upcoming = talks
            .filter(talk => talk.startDateTime > nowDate)
            .map(talk => ({ talk, room: rooms.find(r => r.id.equals(talk.roomId)) }))
            .sort((a, b) => a.talk.startDateTime.getTime() - b.talk.startDateTime.getTime())

        return {
            pastTalks: past,
            currentTalks: current,
            upcomingTalks: upcoming
        }
    }, [talks, now, rooms])

    return {
        talks,
        upcomingTalks,
        pastTalks,
        currentTalks,
        loading
    }
}
