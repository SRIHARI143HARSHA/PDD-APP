import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "DUMMY_FIREBASE_API_KEY",
  authDomain: "disaster-safety-app-8e105.firebaseapp.com",
  projectId: "disaster-safety-app-8e105",
  storageBucket: "disaster-safety-app-8e105.firebasestorage.app",
  messagingSenderId: "188215238421",
  appId: "1:188215238421:web:75d061e6b6488f5f06d31c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app;