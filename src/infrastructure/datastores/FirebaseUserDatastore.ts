import { UserRepository } from '@domain/repositories/UserRepository';
import { UserEntity } from '@domain/entities/User';
import { UserId } from '@domain/value-objects/UserId';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, deleteDoc, onSnapshot, DocumentSnapshot, collection, query, where, documentId, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export class FirebaseUserDatastore implements UserRepository {
  private readonly collection = 'users';

  async save(user: UserEntity): Promise<void> {
    const userDoc = doc(db, this.collection, user.id.value);
    await setDoc(userDoc, {
      savedEventUrls: user.savedEventUrls
    });
  }

  async findById(id: UserId): Promise<UserEntity | null> {
    const userDoc = doc(db, this.collection, id.value);
    const docSnap = await getDoc(userDoc);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return new UserEntity(id, data.savedEventUrls || []);
  }

  subscribeToUser(id: UserId, callback: (user: UserEntity | null) => void): () => void {
    const userDoc = doc(db, this.collection, id.value);
    
    return onSnapshot(userDoc, (doc: DocumentSnapshot) => {
      if (!doc.exists()) {
        callback(null);
        return;
      }

      const data = doc.data();
      const user = new UserEntity(id, data?.savedEventUrls || []);
      callback(user);
    });
  }


  async addSavedEventUrl(userId: UserId, eventUrl: string): Promise<void> {
    const userDoc = doc(db, this.collection, userId.value);
    await updateDoc(userDoc, {
      savedEventUrls: arrayUnion(eventUrl)
    });
  }

  async removeSavedEventUrl(userId: UserId, eventUrl: string): Promise<void> {
    const userDoc = doc(db, this.collection, userId.value);
    await updateDoc(userDoc, {
      savedEventUrls: arrayRemove(eventUrl)
    });
  }

  async delete(id: UserId): Promise<void> {
    const userDoc = doc(db, this.collection, id.value);
    await deleteDoc(userDoc);
  }
}