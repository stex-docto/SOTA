import { UserId } from '@domain/value-objects/UserId';
import { UserEntity } from '@domain/entities/User';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface GoogleAuthResult {
  email: string;
  displayName: string;
  uid: string;
}

export interface AuthenticationPort {
  signUpWithEmail(credentials: AuthCredentials, displayName: string): Promise<UserEntity>;
  signInWithEmail(credentials: AuthCredentials): Promise<UserEntity>;
  signInWithGoogle(): Promise<UserEntity>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<UserEntity | null>;
  onAuthStateChanged(callback: (user: UserEntity | null) => void): () => void;
}