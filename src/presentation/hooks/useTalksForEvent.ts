import { useEffect, useState, useMemo } from 'react'
import { EventEntity, RoomEntity, TalkEntity, TalkId } from '@domain'
import { useDependencies } from './useDependencies'
import { useMoment } from './useMoment'

export interface TalkWithRoom {
    talk: TalkEntity
    room?: RoomEntity
}

export interface TalksForEventHook {
    talksMap: Map<TalkId, TalkWithRoom>
    talks: TalkEntity[]
    upcomingTalks: TalkEntity[]
    pastTalks: TalkEntity[]
    currentTalks: TalkEntity[]
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

    const talksMap = useMemo(() => {
        const map = new Map<TalkId, TalkWithRoom>()

        talks.forEach(talk => {
            const room = rooms.find(r => r.id.equals(talk.roomId))
            map.set(talk.id, {
                talk,
                room
            })
        })

        return map
    }, [talks, rooms])

    const { upcomingTalks, pastTalks, currentTalks } = useMemo(() => {
        const nowDate = now.toDate()

        // Past talks: completely finished (after end time)
        const past = talks
            .filter(talk => talk.endDateTime <= nowDate)
            .sort((a, b) => b.startDateTime.getTime() - a.startDateTime.getTime())

        // Current talks: started but not yet ended
        const current = talks
            .filter(talk => talk.startDateTime <= nowDate && talk.endDateTime > nowDate)
            .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())

        // Upcoming talks: not yet started
        const upcoming = talks
            .filter(talk => talk.startDateTime > nowDate)
            .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())

        return {
            pastTalks: past,
            currentTalks: current,
            upcomingTalks: upcoming
        }
    }, [talks, now])

    return {
        talksMap,
        talks,
        upcomingTalks,
        pastTalks,
        currentTalks,
        loading
    }
}
