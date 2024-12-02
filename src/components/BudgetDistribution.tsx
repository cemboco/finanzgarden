import React from 'react';
import { Profile } from '../types/finance';
import { Amount } from './Amount';
import { useLanguage } from '../contexts/LanguageContext';

interface BudgetDistributionProps {
  profile: Profile;
}

export function BudgetDistribution({ profile }: BudgetDistributionProps) {
  const { t } = useLanguage();
  
  const categories = [
    { name: t('category.fixed'), amount: profile.budgetDistribution.fixed, color: 'bg-blue-500' },
    { name: t('category.needs'), amount: profile.budgetDistribution.needs, color: 'bg-green-500' },
    { name: t('category.wants'), amount: profile.budgetDistribution.wants, color: 'bg-yellow-500' },
    { name: t('category.savings'), amount: profile.budgetDistribution.savings, color: 'bg-purple-500' },
  ];

  const total = Object.values(profile.budgetDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        {t('budget.distribution')}
      </h2>
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {category.name}
              </span>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <Amount value={category.amount} />
                <span className="ml-1">
                  ({total > 0 ? ((category.amount / total) * 100).toFixed(0) : '0'}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={`${category.color} h-2.5 rounded-full transition-all duration-300`}
                style={{ width: total > 0 ? `${(category.amount / total) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      {profile.lastSalaryDate && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('profile.last_salary')}: {new Date(profile.lastSalaryDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('budget.total')}: <Amount value={total} />
          </p>
        </div>
      )}
    </div>
  );
}