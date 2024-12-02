import { Transaction } from '../types/finance';

export function calculateSpentAmounts(transactions: Transaction[]) {
  const currentCycle = getCurrentCycle(transactions);
  
  const spentAmounts = {
    fixed: 0,
    needs: 0,
    wants: 0,
    savings: 0
  };

  currentCycle.forEach(transaction => {
    if (transaction.type === 'expense' && transaction.category) {
      spentAmounts[transaction.category.type] += transaction.amount;
    }
  });

  return spentAmounts;
}

export function getCurrentCycle(transactions: Transaction[]) {
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const lastSalaryIndex = sortedTransactions.findIndex(t => 
    t.type === 'income' && t.description.toLowerCase().includes('gehalt')
  );

  if (lastSalaryIndex === -1) {
    return sortedTransactions;
  }

  return sortedTransactions.slice(0, lastSalaryIndex + 1);
}

export function getLastSalaryDate(transactions: Transaction[]): Date | null {
  const lastSalary = transactions.find(t => 
    t.type === 'income' && t.description.toLowerCase().includes('gehalt')
  );
  
  return lastSalary ? new Date(lastSalary.date) : null;
}