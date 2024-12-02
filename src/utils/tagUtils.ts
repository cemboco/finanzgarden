import { Transaction } from '../types/finance';

export function getUniqueTags(transactions: Transaction[]): string[] {
  const tags = new Set<string>();
  
  transactions.forEach(transaction => {
    transaction.tags?.forEach(tag => {
      tags.add(tag);
    });
  });
  
  return Array.from(tags).sort();
}

export function getTransactionsByTag(transactions: Transaction[], tag: string): Transaction[] {
  return transactions.filter(transaction => 
    transaction.tags?.includes(tag)
  );
}