import {EventEntity, EventId, EventRepository, UserId} from '@domain';
import {collection, deleteDoc, doc, Firestore, getDoc, onSnapshot, setDoc} from "firebase/firestore";

type FirebaseEventDocument = {
    id: string;
    title: string;
    description: string;
    talkRules: string;
    publicUrl: string;
    createdDate: string;
    startDate: string;
    endDate: string;
    location: string;
    status: 'active' | 'inactive';
    createdBy: string;
};

export class FirebaseEventDatastore implements EventRepository {
    constructor(private readonly firestore: Firestore) {}

    protected get collection() {
        return collection(this.firestore, 'events');
    }

    async save(event: EventEntity): Promise<void> {
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
            createdBy: event.createdBy.value
        };

        await setDoc(doc(this.collection, event.id.value), eventDoc);
    }

    async findById(id: EventId): Promise<EventEntity | null> {
        try {
            const docSnapshot = await getDoc(doc(this.collection, id.value));
            if (!docSnapshot.exists()) {
                return null;
            }

            const data = docSnapshot.data() as FirebaseEventDocument;
            return this.mapToEntity(data);
        } catch (_err) {
            return null;
        }
    }

    subscribe(id: EventId, callback: (event: EventEntity | null) => void): () => void {
        const documentRef = doc(this.collection, id.value);
        
        return onSnapshot(documentRef, (docSnapshot) => {
            if (!docSnapshot.exists()) {
                callback(null);
                return;
            }

            try {
                const data = docSnapshot.data() as FirebaseEventDocument;
                const event = this.mapToEntity(data);
                callback(event);
            } catch (error) {
                console.error('Error mapping event data:', error);
                callback(null);
            }
        }, (error) => {
            console.error('Error in event subscription:', error);
            callback(null);
        });
    }

    async delete(id: EventId): Promise<void> {
        await deleteDoc(doc(this.collection, id.value));
    }

    private mapToEntity(doc: FirebaseEventDocument): EventEntity {
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
            UserId.from(doc.createdBy)
        );
    }
}