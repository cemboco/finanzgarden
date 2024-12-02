export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  description: string;
  category?: Category;
  tags?: string[];
  isRecurring?: boolean;
  recurrence?: 'weekly' | 'monthly' | 'yearly';
  nextDueDate?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'fixed' | 'needs' | 'wants' | 'savings';
  budget: number;
  spent: number;
  color?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  color: string;
}

export interface Profile {
  currentBalance: number;
  budgetDistribution: {
    fixed: number;
    needs: number;
    wants: number;
    savings: number;
  };
  categories: Category[];
  savingsGoals: SavingsGoal[];
  lastSalaryDate?: string;
  settings: {
    hideAmounts: boolean;
  };
}