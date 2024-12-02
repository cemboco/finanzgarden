import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Tag, Edit2, Trash2 } from 'lucide-react';
import { Transaction } from '../types/finance';
import { TransactionEditModal } from './TransactionEditModal';
import { Amount } from './Amount';
import { useLanguage } from '../contexts/LanguageContext';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => void;
}

export function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { t } = useLanguage();

  const handleDelete = (id: string) => {
    if (window.confirm(t('transaction.delete_confirm'))) {
      onDelete(id);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {t('transaction.list')}
        </h2>
        {transactions.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {t('transaction.no_transactions')}
          </p>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  {transaction.type === 'income' ? (
                    <ArrowUpCircle className="h-8 w-8 text-green-500" />
                  ) : (
                    <ArrowDownCircle className="h-8 w-8 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                      {transaction.category && ` • ${t(`category.${transaction.category.type}`)}`}
                      {transaction.isRecurring && ` • ${t('transaction.recurring_short')}`}
                    </p>
                    {transaction.tags && transaction.tags.length > 0 && (
                      <div className="flex items-center mt-1 space-x-1">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <div className="flex gap-1">
                          {transaction.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Amount
                    value={transaction.amount}
                    type={transaction.type}
                    className={`font-medium ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  />
                  <button
                    onClick={() => setEditingTransaction(transaction)}
                    className="p-1 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                    title={t('common.edit')}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title={t('common.delete')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingTransaction && (
        <TransactionEditModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={(updates) => {
            onEdit(editingTransaction.id, updates);
            setEditingTransaction(null);
          }}
        />
      )}
    </>
  );
}