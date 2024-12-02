import React from 'react';
import { Profile, Transaction } from '../types/finance';
import { Card } from './layout/Card';
import { calculateSpentAmounts } from '../utils/budgetCalculations';
import { Amount } from './Amount';
import { useLanguage } from '../contexts/LanguageContext';

interface BudgetOverviewProps {
  profile: Profile;
  transactions: Transaction[];
}

export function BudgetOverview({ profile, transactions }: BudgetOverviewProps) {
  const { t } = useLanguage();
  const spentAmounts = calculateSpentAmounts(transactions);
  
  const categories = [
    { 
      name: t('category.fixed'), 
      budget: profile.budgetDistribution.fixed,
      spent: spentAmounts.fixed,
      color: 'bg-blue-500' 
    },
    { 
      name: t('category.needs'), 
      budget: profile.budgetDistribution.needs,
      spent: spentAmounts.needs,
      color: 'bg-green-500' 
    },
    { 
      name: t('category.wants'), 
      budget: profile.budgetDistribution.wants,
      spent: spentAmounts.wants,
      color: 'bg-yellow-500' 
    },
    { 
      name: t('category.savings'), 
      budget: profile.budgetDistribution.savings,
      spent: spentAmounts.savings,
      color: 'bg-purple-500' 
    },
  ];

  return (
    <Card>
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        {t('budget.distribution')}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {categories.map((category) => {
          const remaining = Math.max(0, category.budget - category.spent);
          const percentage = category.budget > 0 
            ? (category.spent / category.budget) * 100 
            : 0;
          
          return (
            <div key={category.name} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
                <span className={`text-sm font-medium ${
                  percentage > 100 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${category.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">{t('budget.total')}</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      <Amount value={category.budget} />
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">{t('category.spent')}</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      <Amount value={category.spent} type="expense" />
                    </p>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">{t('budget.remaining')}</p>
                  <p className={`font-medium ${
                    remaining > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    <Amount value={remaining} />
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}