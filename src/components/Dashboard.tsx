import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, PiggyBank, Target } from 'lucide-react';
import { Transaction, Profile } from '../types/finance';
import { Grid } from './layout/Grid';
import { Card } from './layout/Card';
import { Amount } from './Amount';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  profile: Profile;
  transactions: Transaction[];
  onUpdateProfile: (updates: Partial<Profile>) => void;
}

export function Dashboard({ profile, transactions, onUpdateProfile }: DashboardProps) {
  const { t } = useLanguage();

  const getMonthlyAverage = () => {
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const months = new Set(transactions.map(t => t.date.substring(0, 7))).size;
    return months > 0 ? expenses / months : 0;
  };

  return (
    <div className="space-y-6">
      <Grid cols={{ default: 1, sm: 2, lg: 4 }} gap={4}>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('dashboard.current_balance')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <Amount value={profile.currentBalance} />
              </p>
            </div>
            <PiggyBank className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('dashboard.monthly_average')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <Amount value={getMonthlyAverage()} type="expense" />
              </p>
            </div>
            <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('dashboard.last_income')}
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                <Amount 
                  value={transactions.find(t => t.type === 'income')?.amount || 0} 
                  type="income"
                />
              </p>
            </div>
            <ArrowUpCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('dashboard.last_expense')}
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                <Amount 
                  value={transactions.find(t => t.type === 'expense')?.amount || 0} 
                  type="expense"
                />
              </p>
            </div>
            <ArrowDownCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </Card>
      </Grid>
    </div>
  );
}