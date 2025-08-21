import {FirebaseApp, getApps, initializeApp} from 'firebase/app'
import {Auth, getAuth} from 'firebase/auth'
import {
    Firestore,
    getFirestore,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export class Firebase {
    private static instance: Firebase;
    app: FirebaseApp
    auth: Auth
    firestore: Firestore

    private constructor() {
        // Check if Firebase app already exists
        const existingApps = getApps();
        const existingApp = existingApps.find(app => app.name === 'sota');

        if (existingApp) {
            this.app = existingApp;
            this.auth = getAuth(this.app);
            this.firestore = getFirestore(this.app);
        } else {
            this.app = initializeApp(firebaseConfig, 'sota');
            this.auth = getAuth(this.app);
            this.firestore = initializeFirestore(this.app, {
                localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()}),
            });
        }
    }

    public static getInstance(): Firebase {
        if (!Firebase.instance) {
            Firebase.instance = new Firebase();
        }
        return Firebase.instance;
    }
}
