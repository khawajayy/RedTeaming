import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase credentials are fully provided or using default placeholder
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your_api_key_here' &&
    firebaseConfig.apiKey !== 'AIzaSyExampleKeyReplaceWithYourOwn' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== 'your_project_id'
  );
};

// Initialize Firebase safely without throwing on missing env variables
let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization skipped or failed:', err);
  }
}

export { app, auth, db };
export default app;
