import type { User } from "firebase/auth";

export interface Expense {
  id?: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  userId: string;
  createdAt: number;
}

export type Category =
  | "Alimento"
  | "Salud"
  | "Transporte"
  | "Ocio"
  | "Gastos Fijos"
  | "Antojos";

export interface MonthFilterProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
}

export interface DashboardStats {
  consumed: number;
  budget: number;
  remaining: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export type currentUser = User | null;

export interface userProviderProps {
  children: React.ReactNode;
}

export interface PaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  onDataChange: (paginatedData: T[]) => void;
}
