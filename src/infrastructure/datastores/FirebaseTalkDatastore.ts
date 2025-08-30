import { TalkEntity, TalkId, TalkRepository, EventId, UserId, RoomId } from '@domain'
import { collection, deleteDoc, doc, Firestore, getDoc, getDocs, setDoc } from 'firebase/firestore'

type FirebaseTalkDocument = {
    id: string
    eventId: string
    createdBy: string
    name: string
    pitch: string
    startDateTime: string
    endDateTime: string
    roomId: string
}

export class FirebaseTalkDatastore implements TalkRepository {
    constructor(private readonly firestore: Firestore) {}

    private getTalkCollection(eventId: EventId) {
        return collection(this.firestore, 'events', eventId.value, 'talk')
    }

    async save(talk: TalkEntity): Promise<void> {
        const talkDoc: FirebaseTalkDocument = {
            id: talk.id.value,
            eventId: talk.id.eventId.value,
            createdBy: talk.createdBy.value,
            name: talk.name,
            pitch: talk.pitch,
            startDateTime: talk.startDateTime.toISOString(),
            endDateTime: talk.endDateTime.toISOString(),
            roomId: talk.roomId.value
        }

        const talkCollection = this.getTalkCollection(talk.id.eventId)
        await setDoc(doc(talkCollection, talk.id.value), talkDoc)
    }

    async findById(id: TalkId): Promise<TalkEntity | null> {
        try {
            const talkCollection = this.getTalkCollection(id.eventId)
            const docSnapshot = await getDoc(doc(talkCollection, id.value))
            if (!docSnapshot.exists()) {
                return null
            }
            return this.documentToEntity(docSnapshot.data() as FirebaseTalkDocument)
        } catch (error) {
            console.error('Error finding talk by id:', error)
            return null
        }
    }

    async findByEventId(eventId: EventId): Promise<TalkEntity[]> {
        try {
            const talkCollection = this.getTalkCollection(eventId)
            const querySnapshot = await getDocs(talkCollection)
            return querySnapshot.docs.map(doc =>
                this.documentToEntity(doc.data() as FirebaseTalkDocument)
            )
        } catch (error) {
            console.error('Error finding talks by event id:', error)
            return []
        }
    }

    async delete(id: TalkId): Promise<void> {
        try {
            const talkCollection = this.getTalkCollection(id.eventId)
            await deleteDoc(doc(talkCollection, id.value))
        } catch (error) {
            console.error('Error deleting talk:', error)
            throw error
        }
    }

    private documentToEntity(doc: FirebaseTalkDocument): TalkEntity {
        return new TalkEntity(
            TalkId.from(EventId.from(doc.eventId), doc.id),
            UserId.from(doc.createdBy),
            doc.name,
            doc.pitch,
            new Date(doc.startDateTime),
            new Date(doc.endDateTime),
            RoomId.from(doc.roomId)
        )
    }
}
