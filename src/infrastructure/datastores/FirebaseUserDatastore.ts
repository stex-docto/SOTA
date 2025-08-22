import {Credential, UserEntity, UserId, UserRepository, EventId, EventIdSet} from '@domain';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User} from 'firebase/auth';
import {collection, deleteDoc, doc, Firestore, getDoc, onSnapshot, setDoc} from "firebase/firestore";
import {FirebaseError} from 'firebase/app';

type FirebaseCredential = { email: string; password: string }

type FirebasePublicUser = {
    id: string;
    displayName: string;
}

type FirebasePrivateUser = {
    id: string;
    savedEventIds: string[];
}

function mapCredential(credential: Credential): FirebaseCredential {
    return {
        email: `${credential.codes[0]}-${credential.codes[1]}@sota.example`,
        password: `${credential.codes[2]}${credential.codes[3]}`,
    }
}

type UserListener = (user: UserEntity | null) => Promise<void>;

export class FirebaseUserDatastore implements UserRepository {
    protected listeners = new Set<UserListener>()
    private currentUserUnsubscribe: (() => void) | null = null

    constructor(
        private readonly auth: Auth,
        private readonly firestore: Firestore
    ) {
        this.initListener();
    }

    protected get collection() {
        return collection(this.firestore, 'users')
    }

    async getCurrentUser(): Promise<UserEntity | null> {
        const currentUser = this.auth.currentUser;
        if (!currentUser) return null;
        let user = await this.getUser(UserId.from(currentUser.uid))
        if (!user) {
            user = await this.saveUser(new UserEntity(UserId.from(currentUser.uid)))
        }
        return user;
    }

    async getUser(uid: UserId): Promise<UserEntity | null> {
        try {
            const userPublicData = (await getDoc(this.getPublicUserRef(uid))).data() as FirebasePublicUser;
            let userPrivateData: Partial<FirebasePrivateUser> = {}
            if (this.auth.currentUser?.uid === uid.value) {
                userPrivateData = (await getDoc(this.getPrivateUserRef(uid))).data() as FirebasePrivateUser;
            }
            return this.mapFromFirebase(uid, userPublicData, userPrivateData);
        } catch (_err) {
            return null;
        }
    }

    private mapFromFirebase(uid: UserId, publicData: FirebasePublicUser, privateData: Partial<FirebasePrivateUser> = {}): UserEntity {
        // Convert string array from Firebase to EventIdSet
        const eventIds = (privateData?.savedEventIds || []).map(id => EventId.from(id));
        const savedEventIds = new EventIdSet(eventIds);
        return new UserEntity(
            uid,
            savedEventIds,
            publicData.displayName
        );
    }

    private mapToFirebase(user: UserEntity): { publicData: FirebasePublicUser, privateData: FirebasePrivateUser } {
        return {
            publicData: {
                id: user.id.value,
                displayName: user.displayName
            },
            privateData: {
                id: user.id.value,
                savedEventIds: user.savedEventIds.toArray().map(eventId => eventId.value)
            }
        };
    }

    async saveUser(user: UserEntity): Promise<UserEntity> {
        const currentUser = this.auth.currentUser;
        if (!currentUser) throw new Error('No authenticated user');
        if (currentUser.uid !== user.id.value) throw new Error('Can only save current user data');

        const { publicData, privateData } = this.mapToFirebase(user);
        
        await setDoc(this.getPrivateUserRef(user.id), privateData);
        await setDoc(this.getPublicUserRef(user.id), publicData);

        return user;
    }

    triggerListeners(user: UserEntity | null) {
        this.listeners.forEach((listener) => listener(user));
    }

    initListener() {
        this.auth.onAuthStateChanged((async (firebaseUser) => {
            this.triggerListeners(firebaseUser ? await this.getCurrentUser() : null);
            this.subscribeToUserDoc(firebaseUser)
        }))
    }

    subscribeToCurrentUser(callback: UserListener): () => void {
        this.listeners.add(callback)
        return () => this.listeners.delete(callback)
    }

    async deleteCurrentUser(credential: Credential): Promise<void> {
        const currentUser = this.auth.currentUser;
        if (!currentUser) throw new Error('No authenticated user');

        // Recent sign-in is required for account deletion
        await this.signIn(credential)
        await deleteDoc(this.getPrivateUserRef(UserId.from(currentUser.uid)));
        await deleteDoc(this.getPublicUserRef(UserId.from(currentUser.uid)));
        this.auth.currentUser?.delete()
    }

    async signOut(): Promise<void> {
        await this.auth.signOut()
    }

    async signIn(credential: Credential, signUpIfNotExist: boolean = false): Promise<void> {
        const {email, password} = mapCredential(credential)
        try {
            await signInWithEmailAndPassword(this.auth, email, password)
        } catch (error) {
            if ((error as FirebaseError).code === 'auth/invalid-credential' && signUpIfNotExist) {
                await createUserWithEmailAndPassword(this.auth, email, password)
            } else {
                throw error
            }
        }
        console.log(`User ${this.auth.currentUser?.uid} connected`)
    }

    protected subscribeToUserDoc(user: User | null) {
        this.currentUserUnsubscribe?.()
        this.currentUserUnsubscribe = null
        if (user) {
            const publicUnsubScribe = onSnapshot(
                this.getPublicUserRef(UserId.from(user.uid)),
                async () => this.triggerListeners(await this.getCurrentUser())
            )
            const privateUnsubScribe = onSnapshot(
                this.getPrivateUserRef(UserId.from(user.uid)),
                async () => this.triggerListeners(await this.getCurrentUser())
            )
            this.currentUserUnsubscribe = () => {
                publicUnsubScribe()
                privateUnsubScribe()
            }
        }
    }

    private getPublicUserRef(uid: UserId) {
        return doc(this.collection, uid.value)
    }

    private getPrivateUserRef(uid: UserId) {
        return doc(this.collection, uid.value, "private", "user")
    }

}

