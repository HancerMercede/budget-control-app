import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const onAuthStateChangeListener = (
  callback: (user: User | null) => void,
) => onAuthStateChanged(auth, callback);

export const getRemoteBudget = async (userId: string): Promise<number> => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().monthlyBudget || 0;
  }
  return 0;
};

export const updateRemoteBudget = async (userId: string, amount: number) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { monthlyBudget: amount }, { merge: true });
};
