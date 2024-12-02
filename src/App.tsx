import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { BudgetDistribution } from './components/BudgetDistribution';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { ProfilePage } from './components/ProfilePage';
import { ExpenseAnalysis } from './components/ExpenseAnalysis';
import { SettingsPage } from './components/SettingsPage';
import { Transaction, Profile } from './types/finance';
import { AnimatePresence, motion } from 'framer-motion';
import { ProfileProvider } from './hooks/useProfile';
import { LanguageProvider } from './contexts/LanguageContext';

const defaultProfile: Profile = {
  currentBalance: 5000,
  budgetDistribution: {
    fixed: 0,
    needs: 0,
    wants: 0,
    savings: 0,
  },
  categories: [],
  savingsGoals: [],
  settings: {
    hideAmounts: false
  }
};

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        return 'dark';
      }
    }
    return 'light';
  });

  const [profile, setProfile] = useState<Profile>(() => {
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [currentView, setCurrentView] = useState<'dashboard' | 'profile' | 'analysis' | 'settings'>('dashboard');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const updateBudgetDistribution = (salaryAmount: number, customPercentages?: {
    fixed: number;
    needs: number;
    wants: number;
    savings: number;
  }) => {
    const percentages = customPercentages || {
      fixed: 0.5,
      needs: 0.3,
      wants: 0.1,
      savings: 0.1,
    };

    const newDistribution = {
      fixed: salaryAmount * percentages.fixed,
      needs: salaryAmount * percentages.needs,
      wants: salaryAmount * percentages.wants,
      savings: salaryAmount * percentages.savings,
    };

    setProfile(prev => ({
      ...prev,
      budgetDistribution: newDistribution,
      lastSalaryDate: new Date().toISOString(),
    }));
  };

  const handleTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };

    setTransactions(prevTransactions => [transaction, ...prevTransactions]);
    
    setProfile(prev => ({
      ...prev,
      currentBalance: prev.currentBalance + (
        transaction.type === 'income' ? transaction.amount : -transaction.amount
      ),
    }));

    if (transaction.type === 'income' && 
        transaction.description.toLowerCase().includes('gehalt')) {
      updateBudgetDistribution(transaction.amount);
    }
  };

  const handleEditTransaction = (id: string, updates: Partial<Omit<Transaction, 'id'>>) => {
    setTransactions(prevTransactions => {
      const oldTransaction = prevTransactions.find(t => t.id === id);
      if (!oldTransaction) return prevTransactions;

      const oldAmount = oldTransaction.type === 'income' ? oldTransaction.amount : -oldTransaction.amount;
      const newAmount = updates.type === 'income' ? (updates.amount || oldTransaction.amount) : -(updates.amount || oldTransaction.amount);
      const balanceDifference = newAmount - oldAmount;

      setProfile(prev => ({
        ...prev,
        currentBalance: prev.currentBalance + balanceDifference,
      }));

      return prevTransactions.map(t => 
        t.id === id 
          ? { ...t, ...updates }
          : t
      );
    });
  };

  const handleDeleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setProfile(prev => ({
        ...prev,
        currentBalance: prev.currentBalance - (
          transaction.type === 'income' ? transaction.amount : -transaction.amount
        ),
      }));
      setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== id));
    }
  };

  const handleUpdateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const handleResetData = () => {
    setProfile(defaultProfile);
    setTransactions([]);
    localStorage.removeItem('profile');
    localStorage.removeItem('transactions');
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <Dashboard 
              profile={profile} 
              transactions={transactions}
              onUpdateProfile={handleUpdateProfile}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <div className="space-y-8">
                <TransactionForm onSubmit={handleTransaction} transactions={transactions} />
                <BudgetDistribution profile={profile} />
              </div>
              <TransactionList 
                transactions={transactions}
                onDelete={handleDeleteTransaction}
                onEdit={handleEditTransaction}
              />
            </div>
          </motion.div>
        );
      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <ProfilePage 
              profile={profile} 
              transactions={transactions}
              onUpdateProfile={handleUpdateProfile}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </motion.div>
        );
      case 'analysis':
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <ExpenseAnalysis transactions={transactions} />
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <SettingsPage
              profile={profile}
              transactions={transactions}
              onUpdateProfile={handleUpdateProfile}
              onResetData={handleResetData}
              updateBudgetDistribution={updateBudgetDistribution}
            />
          </motion.div>
        );
    }
  };

  return (
    <LanguageProvider>
      <ProfileProvider value={{ profile }}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
          <Header 
            onViewChange={setCurrentView} 
            currentView={currentView} 
            theme={theme}
            onThemeToggle={toggleTheme}
            onUpdateProfile={handleUpdateProfile}
          />
          <main className="container mx-auto py-8">
            <AnimatePresence mode="wait">
              {renderCurrentView()}
            </AnimatePresence>
          </main>
        </div>
      </ProfileProvider>
    </LanguageProvider>
  );
}

export default App;