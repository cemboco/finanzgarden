import React from 'react';
import { Profile, Transaction } from '../types/finance';
import { TrendingUp } from 'lucide-react';

interface BudgetSuggestionsProps {
  profile: Profile;
  transactions: Transaction[];
  onUpdateBudget: (updates: Partial<Profile['budgetDistribution']>) => void;
}

export function BudgetSuggestions({ profile, transactions, onUpdateBudget }: BudgetSuggestionsProps) {
  const calculateSuggestions = () => {
    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const monthlyIncome = profile.monthlyIncome;
    const currentDistribution = profile.budgetDistribution;
    
    const suggestions = {
      fixed: Math.min(monthlyIncome * 0.5, currentDistribution.fixed),
      needs: Math.min(monthlyIncome * 0.3, currentDistribution.needs),
      wants: Math.min(monthlyIncome * 0.1, currentDistribution.wants),
      savings: Math.max(monthlyIncome * 0.1, monthlyIncome - monthlyExpenses),
    };

    return suggestions;
  };

  const suggestions = calculateSuggestions();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Budget-Empfehlungen</h2>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Basierend auf deinem Einkommen von €{profile.monthlyIncome.toFixed(2)} empfehlen wir folgende Verteilung:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(suggestions).map(([category, amount]) => (
            <div key={category} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {category === 'fixed' ? 'Fixkosten' :
                   category === 'needs' ? 'Bedürfnisse' :
                   category === 'wants' ? 'Wünsche' : 'Sparen'}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  €{amount.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(amount / profile.monthlyIncome) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => onUpdateBudget(suggestions)}
          className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Empfehlungen übernehmen
        </button>
      </div>
    </div>
  );
}