import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";
import { type Expense } from "../types";

const COLLECTION_NAME = "expenses";

type ExpenseFormData = Omit<Expense, "id" | "createdAt">;

export const saveExpense = async (expense: ExpenseFormData) => {
  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      ...expense,
      createdAt: Date.now(),
    });
  } catch (error) {
    console.error("Error saving the expense:", error);
    throw error;
  }
};

export const subscribeToExpenses = (
  userId: string,
  callback: (expenses: Expense[]) => void,
) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Expense[];
    callback(expenses);
  });
};

export const deleteExpense = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting:", error);
    throw error;
  }
};
