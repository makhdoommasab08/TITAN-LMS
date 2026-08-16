import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDGYqzVUnieRhmizxCVb33SEFFGezME3qU",
  authDomain: "ninth-legend-fxctm.firebaseapp.com",
  projectId: "ninth-legend-fxctm",
  storageBucket: "ninth-legend-fxctm.firebasestorage.app",
  messagingSenderId: "924450020844",
  appId: "1:924450020844:web:f6599ccb131987a1a0b4c9"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-tajinstituteofte-2246c126-39f0-468a-a960-0efaad470851");
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
