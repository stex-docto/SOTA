import {
    EventEntity,
    EventId,
    EventRepository,
    RoomEntity,
    RoomId,
    RoomSet,
    UserId,
    UserRepository
} from '@domain'
import {
    collection,
    deleteDoc,
    doc,
    Firestore,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    setDoc,
    where
} from 'firebase/firestore'

type FirebaseRoomDocument = {
    id: string
    name: string
    description: string
}

type FirebaseEventDocument = {
    id: string
    title: string
    description: string
    talkRules: string
    publicUrl: string
    createdDate: string
    startDate: string
    endDate: string
    location: string
    status: 'active' | 'inactive'
    createdBy: string
    rooms: { [roomId: string]: FirebaseRoomDocument }
}

export class FirebaseEventDatastore implements EventRepository {
    constructor(
        private readonly firestore: Firestore,
        private readonly userRepository: UserRepository
    ) {}

    protected get collection() {
        return collection(this.firestore, 'events')
    }

    async save(event: EventEntity): Promise<void> {
        const rooms: { [roomId: string]: FirebaseRoomDocument } = {}
        event.rooms.forEach((room, roomId) => {
            rooms[roomId.value] = {
                id: room.id.value,
                name: room.name,
                description: room.description
            }
        })

        const eventDoc: FirebaseEventDocument = {
            id: event.id.value,
            title: event.title,
            description: event.description,
            talkRules: event.talkRules,
            publicUrl: event.publicUrl,
            createdDate: event.createdDate.toISOString(),
            startDate: event.startDate.toISOString(),
            endDate: event.endDate.toISOString(),
            location: event.location,
            status: event.status,
            createdBy: event.createdBy.value,
            rooms: rooms
        }

        await setDoc(doc(this.collection, event.id.value), eventDoc)
    }

    async findById(id: EventId): Promise<EventEntity | null> {
        try {
            const docSnapshot = await getDoc(doc(this.collection, id.value))
            if (!docSnapshot.exists()) {
                return null
            }

            const data = docSnapshot.data() as FirebaseEventDocument
            return this.mapToEntity(data)
        } catch (_err) {
            return null
        }
    }

    async findByCurrentUser(): Promise<EventEntity[]> {
        try {
            const currentUser = await this.userRepository.getCurrentUser()
            if (!currentUser) {
                return []
            }

            // Must use where clause to satisfy Firebase security rules
            const q = query(this.collection, where('createdBy', '==', currentUser.id.value))
            const querySnapshot = await getDocs(q)

            const events: EventEntity[] = []
            querySnapshot.forEach(doc => {
                const data = doc.data() as FirebaseEventDocument
                events.push(this.mapToEntity(data))
            })

            // Sort by creation date, most recent first
            return events.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime())
        } catch (_err) {
            return []
        }
    }

    subscribe(id: EventId, callback: (event: EventEntity | null) => void): () => void {
        const documentRef = doc(this.collection, id.value)

        return onSnapshot(
            documentRef,
            docSnapshot => {
                if (!docSnapshot.exists()) {
                    callback(null)
                    return
                }

                try {
                    const data = docSnapshot.data() as FirebaseEventDocument
                    const event = this.mapToEntity(data)
                    callback(event)
                } catch (error) {
                    console.error('Error mapping event data:', error)
                    callback(null)
                }
            },
            error => {
                console.error('Error in event subscription:', error)
                callback(null)
            }
        )
    }

    async delete(id: EventId): Promise<void> {
        await deleteDoc(doc(this.collection, id.value))
    }

    private mapToEntity(doc: FirebaseEventDocument): EventEntity {
        const roomEntities: RoomEntity[] = []
        if (doc.rooms) {
            Object.entries(doc.rooms).forEach(([_roomIdString, roomDoc]) => {
                const room = new RoomEntity(
                    RoomId.from(roomDoc.id),
                    roomDoc.name,
                    roomDoc.description
                )
                roomEntities.push(room)
            })
        }
        const rooms = new RoomSet(roomEntities)

        return new EventEntity(
            EventId.from(doc.id),
            doc.title,
            doc.description,
            doc.talkRules,
            doc.publicUrl,
            new Date(doc.createdDate),
            new Date(doc.startDate),
            new Date(doc.endDate),
            doc.location,
            doc.status,
            UserId.from(doc.createdBy),
            rooms
        )
    }
}
