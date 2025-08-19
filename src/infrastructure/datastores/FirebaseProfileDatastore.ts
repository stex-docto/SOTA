import { ProfileRepository } from '@domain/repositories/ProfileRepository';
import { ProfileEntity } from '@domain/entities/Profile';
import { UserId } from '@domain/value-objects/UserId';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, deleteDoc, onSnapshot, DocumentSnapshot, collection, query, where, documentId } from 'firebase/firestore';

export class FirebaseProfileDatastore implements ProfileRepository {
  private readonly collection = 'profiles';

  async save(profile: ProfileEntity): Promise<void> {
    const profileDoc = doc(db, this.collection, profile.id.value);
    await setDoc(profileDoc, {
      displayName: profile.displayName
    });
  }

  async findById(id: UserId): Promise<ProfileEntity | null> {
    const profileDoc = doc(db, this.collection, id.value);
    const docSnap = await getDoc(profileDoc);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return new ProfileEntity(id, data.displayName);
  }

  subscribeToProfile(id: UserId, callback: (profile: ProfileEntity | null) => void): () => void {
    const profileDoc = doc(db, this.collection, id.value);
    
    return onSnapshot(profileDoc, (doc: DocumentSnapshot) => {
      if (!doc.exists()) {
        callback(null);
        return;
      }

      const data = doc.data();
      const profile = new ProfileEntity(id, data?.displayName);
      callback(profile);
    });
  }

  subscribeToProfiles(userIds: UserId[], callback: (profiles: ProfileEntity[]) => void): () => void {
    if (userIds.length === 0) {
      callback([]);
      return () => {};
    }

    const profilesQuery = query(
      collection(db, this.collection),
      where(documentId(), 'in', userIds.map(id => id.value))
    );

    return onSnapshot(profilesQuery, (snapshot) => {
      const profiles = snapshot.docs.map(doc => {
        const userId = new UserId(doc.id);
        const data = doc.data();
        return new ProfileEntity(userId, data.displayName);
      });
      callback(profiles);
    });
  }

  async delete(id: UserId): Promise<void> {
    const profileDoc = doc(db, this.collection, id.value);
    await deleteDoc(profileDoc);
  }
}