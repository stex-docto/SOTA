import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { AuthenticationPort, AuthCredentials } from '@application/ports/AuthenticationPort';
import { UserEntity } from '@domain/entities/User';
import { UserId } from '@domain/value-objects/UserId';
import { UserRepository } from '@domain/repositories/UserRepository';

export class FirebaseAuthAdapter implements AuthenticationPort {
  private googleProvider = new GoogleAuthProvider();

  constructor(private readonly userRepository: UserRepository) {}

  async signUpWithEmail(credentials: AuthCredentials, displayName: string): Promise<UserEntity> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    const user = UserEntity.create(
      displayName,
      UserId.from(userCredential.user.uid)
    );

    await this.userRepository.save(user);
    return user;
  }

  async signInWithEmail(credentials: AuthCredentials): Promise<UserEntity> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    const user = await this.userRepository.findById(UserId.from(userCredential.user.uid));
    if (!user) {
      throw new Error('User not found in database');
    }

    return user;
  }

  async signInWithGoogle(): Promise<UserEntity> {
    const result = await signInWithPopup(auth, this.googleProvider);
    const firebaseUser = result.user;

    let user = await this.userRepository.findById(UserId.from(firebaseUser.uid));
    
    if (!user) {
      // Create new user
      user = UserEntity.create(
        firebaseUser.displayName || firebaseUser.email!.split('@')[0],
        UserId.from(firebaseUser.uid)
      );
      await this.userRepository.save(user);
    }

    return user;
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  async getCurrentUser(): Promise<UserEntity | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return null;
    }

    return await this.userRepository.findById(UserId.from(firebaseUser.uid));
  }

  onAuthStateChanged(callback: (user: UserEntity | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const user = await this.userRepository.findById(UserId.from(firebaseUser.uid));
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}