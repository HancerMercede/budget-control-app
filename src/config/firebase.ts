import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { type UserBudgetData } from "../types";

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

export const getRemoteBudget = async (
  userId: string,
): Promise<UserBudgetData> => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    // Migración: Si existe monthlyBudget antiguo, migrar al nuevo formato
    if (data.monthlyBudget && !data.baseBudget) {
      const newData: UserBudgetData = {
        baseBudget: data.monthlyBudget,
        currentBudget: data.monthlyBudget,
        currentMonth: getCurrentMonth(),
      };
      await setDoc(docRef, newData, { merge: true });
      return newData;
    }

    return {
      baseBudget: data.baseBudget || 0,
      currentBudget: data.currentBudget || 0,
      currentMonth: data.currentMonth || getCurrentMonth(),
    };
  }

  return {
    baseBudget: 0,
    currentBudget: 0,
    currentMonth: getCurrentMonth(),
  };
};

export const updateBaseBudget = async (userId: string, amount: number) => {
  const userRef = doc(db, "users", userId);
  const currentData = await getRemoteBudget(userId);

  await setDoc(
    userRef,
    {
      baseBudget: amount,
      currentBudget: amount,
      currentMonth: currentData.currentMonth,
    },
    { merge: true },
  );
};

export const updateCurrentBudget = async (
  userId: string,
  budgetData: UserBudgetData,
) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, budgetData, { merge: true });
};

export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export const getPreviousMonth = (): string => {
  const now = new Date();
  now.setMonth(now.getMonth() - 1);
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};
