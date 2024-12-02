import React, { useMemo, useState } from 'react';
import { Tag, X } from 'lucide-react';
import { Transaction } from '../types/finance';
import { TransactionList } from './TransactionList';
import { useLanguage } from '../contexts/LanguageContext';

interface TagListProps {
  transactions: Transaction[];
  onTagClick: (tag: string) => void;
  onDelete: (id: string) => void;
}

export function TagList({ transactions, onTagClick, onDelete }: TagListProps) {
  const { t } = useLanguage();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const tagStats = useMemo(() => {
    const stats = new Map<string, { count: number; amount: number }>();
    
    transactions.forEach(transaction => {
      transaction.tags?.forEach(tag => {
        const current = stats.get(tag) || { count: 0, amount: 0 };
        stats.set(tag, {
          count: current.count + 1,
          amount: current.amount + (transaction.type === 'expense' ? transaction.amount : 0)
        });
      });
    });
    
    return Array.from(stats.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map(([tag, stats]) => ({
        tag,
        ...stats
      }));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (!selectedTag) return [];
    return transactions.filter(t => t.tags?.includes(selectedTag));
  }, [selectedTag, transactions]);

  if (tagStats.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('transaction.tags')}
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tagStats.map(({ tag, count, amount }) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(selectedTag === tag ? null : tag);
                onTagClick(tag);
              }}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors duration-200 ${
                selectedTag === tag 
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
              }`}
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {tag}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600">
                  {count}×
                </span>
                <span className="text-red-500 dark:text-red-400">
                  €{amount.toFixed(2)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedTag && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('transaction.with_tag')}: {selectedTag}
              </h3>
            </div>
            <button
              onClick={() => setSelectedTag(null)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <TransactionList 
            transactions={filteredTransactions}
            onDelete={onDelete}
            onEdit={() => {}}
          />
        </div>
      )}
    </div>
  );
}