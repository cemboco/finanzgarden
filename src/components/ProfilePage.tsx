import React from 'react';
import { Target, TrendingUp, Edit2 } from 'lucide-react';
import { Profile, Transaction } from '../types/finance';
import { CategoryManager } from './CategoryManager';
import { BudgetOverview } from './BudgetOverview';
import { TagList } from './TagList';
import { getLastSalaryDate } from '../utils/budgetCalculations';
import { Amount } from './Amount';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfilePageProps {
  profile: Profile;
  transactions: Transaction[];
  onUpdateProfile: (updates: Partial<Profile>) => void;
  onDeleteTransaction: (id: string) => void;
}

export function ProfilePage({ profile, transactions, onUpdateProfile, onDeleteTransaction }: ProfilePageProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedProfile, setEditedProfile] = React.useState({
    currentBalance: profile.currentBalance,
  });

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const lastSalaryDate = getLastSalaryDate(transactions);

  const handleSave = () => {
    onUpdateProfile(editedProfile);
    setIsEditing(false);
  };

  const handleTagClick = (tag: string) => {
    // You can implement tag filtering logic here
    console.log(`Filtering by tag: ${tag}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">{t('profile.title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8" />
            <div className="flex-1">
              <p className="text-sm opacity-80">{t('dashboard.current_balance')}</p>
              {isEditing ? (
                <input
                  type="number"
                  value={editedProfile.currentBalance}
                  onChange={(e) => setEditedProfile({
                    ...editedProfile,
                    currentBalance: Number(e.target.value)
                  })}
                  className="w-full bg-white/10 rounded px-2 py-1 text-white"
                />
              ) : (
                <p className="text-2xl font-bold">
                  <Amount value={profile.currentBalance} className="text-white" />
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Target className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-80">{t('profile.total_expenses')}</p>
              <p className="text-2xl font-bold">
                <Amount value={totalExpenses} type="expense" className="text-white" />
              </p>
            </div>
          </div>
        </div>
        {lastSalaryDate && (
          <p className="mt-4 text-sm opacity-80">
            {t('profile.last_salary')}: {lastSalaryDate.toLocaleDateString()}
          </p>
        )}
        <div className="mt-4 flex justify-end">
          {isEditing ? (
            <div className="space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-white rounded-lg text-indigo-600 hover:bg-white/90"
              >
                {t('common.save')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
            >
              <Edit2 className="h-4 w-4" />
              {t('common.edit')}
            </button>
          )}
        </div>
      </div>

      {/* Tag List */}
      <TagList transactions={transactions} onTagClick={handleTagClick} onDelete={onDeleteTransaction} />

      {/* Budget Overview */}
      <BudgetOverview profile={profile} transactions={transactions} />

      {/* Category Manager */}
      <CategoryManager
        categories={profile.categories || []}
        onAddCategory={() => {}}
        onUpdateCategory={() => {}}
      />
    </div>
  );
}