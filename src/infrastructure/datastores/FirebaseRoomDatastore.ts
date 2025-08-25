import {
    collection,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    Timestamp
} from 'firebase/firestore';
import {Firebase} from '../firebase';
import {EventId, RoomEntity, RoomId, RoomRepository, UserId} from '@domain';

export class FirebaseRoomDatastore implements RoomRepository {
    private readonly collectionName = 'rooms';
    private readonly db = Firebase.getInstance().firestore;

    async save(room: RoomEntity): Promise<void> {
        const roomDoc = doc(this.db, this.collectionName, room.id.value);
        
        await setDoc(roomDoc, {
            id: room.id.value,
            eventId: room.eventId.value,
            name: room.name,
            description: room.description,
            createdBy: room.createdBy.value,
            createdDate: Timestamp.fromDate(room.createdDate)
        });
    }

    async findById(id: RoomId): Promise<RoomEntity | null> {
        const roomDoc = doc(this.db, this.collectionName, id.value);
        const roomSnap = await getDoc(roomDoc);

        if (!roomSnap.exists()) {
            return null;
        }

        const data = roomSnap.data();
        return new RoomEntity(
            RoomId.from(data.id),
            EventId.from(data.eventId),
            data.name,
            data.description,
            UserId.from(data.createdBy),
            data.createdDate.toDate()
        );
    }

    async findByEventId(eventId: EventId): Promise<RoomEntity[]> {
        const roomsQuery = query(
            collection(this.db, this.collectionName),
            where('eventId', '==', eventId.value)
        );

        const roomsSnap = await getDocs(roomsQuery);
        const rooms: RoomEntity[] = [];

        roomsSnap.forEach((doc) => {
            const data = doc.data();
            rooms.push(new RoomEntity(
                RoomId.from(data.id),
                EventId.from(data.eventId),
                data.name,
                data.description,
                UserId.from(data.createdBy),
                data.createdDate.toDate()
            ));
        });

        return rooms;
    }

    async delete(id: RoomId): Promise<void> {
        const roomDoc = doc(this.db, this.collectionName, id.value);
        await deleteDoc(roomDoc);
    }
}