import React from 'react';
import { Tags, Plus } from 'lucide-react';
import { Category } from '../types/finance';
import { useLanguage } from '../contexts/LanguageContext';
import { Amount } from './Amount';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id' | 'spent'>) => void;
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
}

export function CategoryManager({ categories, onAddCategory, onUpdateCategory }: CategoryManagerProps) {
  const { t } = useLanguage();
  const [showForm, setShowForm] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState({
    name: '',
    type: 'needs' as const,
    budget: 0,
    color: '#4F46E5',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCategory(newCategory);
    setNewCategory({ name: '', type: 'needs', budget: 0, color: '#4F46E5' });
    setShowForm(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Tags className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('category.title')}
          </h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-1 text-sm rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900/70"
        >
          <Plus className="h-4 w-4" />
          <span>{t('category.new')}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('category.name')}
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('category.type')}
              </label>
              <select
                value={newCategory.type}
                onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="fixed">{t('category.fixed')}</option>
                <option value="needs">{t('category.needs')}</option>
                <option value="wants">{t('category.wants')}</option>
                <option value="savings">{t('category.savings')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('category.budget')}
              </label>
              <input
                type="number"
                value={newCategory.budget}
                onChange={(e) => setNewCategory({ ...newCategory, budget: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                min="0"
                step="0.01"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              {t('category.add')}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t(`category.${category.type}`)}
                </span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  <Amount value={category.budget} />
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('category.spent')}: <Amount value={category.spent} type="expense" />
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full bg-indigo-600"
                style={{
                  width: `${Math.min((category.spent / category.budget) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}