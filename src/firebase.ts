import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDFo_mpXhY6akczrN6UxYpcZVfjuiM5oYA",
  authDomain: "gymapp-a05aa.firebaseapp.com",
  projectId: "gymapp-a05aa",
  storageBucket: "gymapp-a05aa.firebasestorage.app",
  messagingSenderId: "348279750657",
  appId: "1:348279750657:web:68eb1e08d6f3550433c000"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { app, db, auth }