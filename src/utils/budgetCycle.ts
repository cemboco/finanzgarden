import { Transaction } from '../types/finance';

export function isNewSalaryCycle(transactions: Transaction[]): boolean {
  const latestTransaction = transactions[0];
  if (!latestTransaction || latestTransaction.type !== 'income') return false;
  
  return latestTransaction.description.toLowerCase().includes('gehalt');
}

export function calculateBudgetDistribution(amount: number) {
  return {
    fixed: amount * 0.5,    // 50% for fixed costs
    needs: amount * 0.3,    // 30% for needs
    wants: amount * 0.1,    // 10% for wants
    savings: amount * 0.1   // 10% for savings
  };
}

export function getLastSalaryDate(transactions: Transaction[]): Date | null {
  const lastSalary = transactions.find(t => 
    t.type === 'income' && t.description.toLowerCase().includes('gehalt')
  );
  
  return lastSalary ? new Date(lastSalary.date) : null;
}