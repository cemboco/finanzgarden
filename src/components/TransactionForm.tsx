import React, { useState, useMemo } from 'react';
import { PlusCircle, RepeatIcon } from 'lucide-react';
import { Transaction } from '../types/finance';
import { getUniqueTags } from '../utils/tagUtils';
import { useLanguage } from '../contexts/LanguageContext';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  transactions: Transaction[];
}

export function TransactionForm({ onSubmit, transactions }: TransactionFormProps) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('fixed');
  const [tags, setTags] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [nextDueDate, setNextDueDate] = useState('');
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const existingTags = useMemo(() => getUniqueTags(transactions), [transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount: parseFloat(amount),
      type,
      date: new Date(date).toISOString(),
      description,
      category: type === 'expense' ? { 
        id: category, 
        name: category, 
        type: category as 'fixed' | 'needs' | 'wants' | 'savings', 
        budget: 0, 
        spent: 0 
      } : undefined,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
      isRecurring,
      recurrence: isRecurring ? recurrence : undefined,
      nextDueDate: isRecurring ? nextDueDate : undefined
    });
    
    setAmount('');
    setDescription('');
    setTags('');
    setIsRecurring(false);
    setNextDueDate('');
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
  };

  const handleTagClick = (tag: string) => {
    const currentTags = tags.split(',').map(t => t.trim()).filter(t => t !== '');
    if (!currentTags.includes(tag)) {
      setTags(tags ? `${tags}, ${tag}` : tag);
    }
    setShowTagSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{t('transaction.new')}</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('transaction.type')}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
              className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
            >
              <option value="income">{t('transaction.income')}</option>
              <option value="expense">{t('transaction.expense')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('transaction.amount')} (€)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
              required
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('transaction.date')}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('transaction.description')}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
              required
              maxLength={50}
              placeholder={t('transaction.description')}
            />
          </div>
        </div>

        {type === 'expense' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('transaction.category')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
              required
            >
              <option value="fixed">{t('category.fixed')}</option>
              <option value="needs">{t('category.needs')}</option>
              <option value="wants">{t('category.wants')}</option>
              <option value="savings">{t('category.savings')}</option>
            </select>
          </div>
        )}

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('transaction.tags')}
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            onFocus={() => setShowTagSuggestions(true)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
            placeholder={t('transaction.tags')}
            maxLength={100}
          />
          {showTagSuggestions && existingTags.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
              <div className="p-2 flex flex-wrap gap-1">
                {existingTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="px-2 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isRecurring" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {t('transaction.recurring')}
            </label>
          </div>

          {isRecurring && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('transaction.recurrence')}
                </label>
                <select
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value as 'weekly' | 'monthly' | 'yearly')}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
                >
                  <option value="weekly">{t('transaction.weekly')}</option>
                  <option value="monthly">{t('transaction.monthly')}</option>
                  <option value="yearly">{t('transaction.yearly')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('transaction.next_date')}
                </label>
                <input
                  type="date"
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
                  required={isRecurring}
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-6 py-2 rounded-full text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          {t('transaction.add')}
        </button>
      </div>
    </form>
  );
}