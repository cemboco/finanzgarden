import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // App
    'app.title': 'FinanceGarden',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.analysis': 'Analysis',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',

    // Theme
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode',

    // Common
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.add': 'Add',

    // Dashboard
    'dashboard.current_balance': 'Current Balance',
    'dashboard.monthly_average': 'Monthly Average',
    'dashboard.last_income': 'Last Income',
    'dashboard.last_expense': 'Last Expense',

    // Budget
    'budget.distribution': 'Budget Distribution',
    'budget.total': 'Total',
    'budget.remaining': 'Remaining',

    // Categories
    'category.title': 'Categories',
    'category.new': 'New Category',
    'category.name': 'Name',
    'category.type': 'Type',
    'category.budget': 'Budget',
    'category.spent': 'Spent',
    'category.add': 'Add Category',
    'category.fixed': 'Fixed Costs',
    'category.needs': 'Needs',
    'category.wants': 'Wants',
    'category.savings': 'Savings/Investments',

    // Transactions
    'transaction.new': 'New Transaction',
    'transaction.edit': 'Edit Transaction',
    'transaction.list': 'Transactions',
    'transaction.type': 'Type',
    'transaction.amount': 'Amount',
    'transaction.date': 'Date',
    'transaction.description': 'Description',
    'transaction.category': 'Category',
    'transaction.tags': 'Tags (comma-separated)',
    'transaction.add': 'Add Transaction',
    'transaction.income': 'Income',
    'transaction.expense': 'Expense',
    'transaction.recurring': 'Recurring Transaction',
    'transaction.recurring_short': 'Recurring',
    'transaction.recurrence': 'Recurrence',
    'transaction.next_date': 'Next Date',
    'transaction.weekly': 'Weekly',
    'transaction.monthly': 'Monthly',
    'transaction.yearly': 'Yearly',
    'transaction.no_transactions': 'No transactions yet',
    'transaction.delete_confirm': 'Are you sure you want to delete this transaction?',
    'transaction.with_tag': 'Transactions with tag',

    // Analysis
    'analysis.title': 'Expense Analysis',
    'analysis.week': 'Week',
    'analysis.month': 'Month',
    'analysis.income_expenses': 'Income and Expenses',
    'analysis.expense_forecast': 'Expense Forecast',
    'analysis.projected_expenses': 'Projected Expenses',
    'analysis.spending_distribution': 'Where do you spend your money?',
    'analysis.insights': 'Insights',
    'analysis.monthly_average': 'Average monthly expenses',
    'analysis.highest_expense': 'Highest expense',
    'analysis.lowest_expense': 'Lowest expense',

    // Profile
    'profile.title': 'Financial Profile',
    'profile.total_expenses': 'Total Expenses',
    'profile.last_salary': 'Last Salary',

    // Settings
    'settings.title': 'Settings',
    'settings.budget_distribution': 'Adjust Budget Distribution',
    'settings.data': 'Data Management',
    'settings.export': 'Export Data',
    'settings.reset': 'Reset All Data',
    'settings.reset_confirm': 'Are you sure? This action cannot be undone.',
    'settings.total_must_be_100': 'Total must be 100%',

    // Amounts
    'amounts.show': 'Show Amounts',
    'amounts.hide': 'Hide Amounts',
  },
  de: {
    // App
    'app.title': 'FinanzGarten',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.analysis': 'Analyse',
    'nav.profile': 'Profil',
    'nav.settings': 'Einstellungen',

    // Theme
    'theme.light': 'Heller Modus',
    'theme.dark': 'Dunkler Modus',

    // Common
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.add': 'Hinzufügen',

    // Dashboard
    'dashboard.current_balance': 'Aktueller Kontostand',
    'dashboard.monthly_average': 'Monatlicher Durchschnitt',
    'dashboard.last_income': 'Letzte Einnahme',
    'dashboard.last_expense': 'Letzte Ausgabe',

    // Budget
    'budget.distribution': 'Budgetverteilung',
    'budget.total': 'Gesamt',
    'budget.remaining': 'Verbleibend',

    // Categories
    'category.title': 'Kategorien',
    'category.new': 'Neue Kategorie',
    'category.name': 'Name',
    'category.type': 'Typ',
    'category.budget': 'Budget',
    'category.spent': 'Ausgegeben',
    'category.add': 'Kategorie hinzufügen',
    'category.fixed': 'Fixkosten',
    'category.needs': 'Bedürfnisse',
    'category.wants': 'Wünsche',
    'category.savings': 'Sparen/Investieren',

    // Transactions
    'transaction.new': 'Neue Transaktion',
    'transaction.edit': 'Transaktion bearbeiten',
    'transaction.list': 'Transaktionen',
    'transaction.type': 'Typ',
    'transaction.amount': 'Betrag',
    'transaction.date': 'Datum',
    'transaction.description': 'Beschreibung',
    'transaction.category': 'Kategorie',
    'transaction.tags': 'Tags (kommagetrennt)',
    'transaction.add': 'Transaktion hinzufügen',
    'transaction.income': 'Einnahme',
    'transaction.expense': 'Ausgabe',
    'transaction.recurring': 'Wiederkehrende Transaktion',
    'transaction.recurring_short': 'Wiederkehrend',
    'transaction.recurrence': 'Wiederholung',
    'transaction.next_date': 'Nächstes Datum',
    'transaction.weekly': 'Wöchentlich',
    'transaction.monthly': 'Monatlich',
    'transaction.yearly': 'Jährlich',
    'transaction.no_transactions': 'Noch keine Transaktionen',
    'transaction.delete_confirm': 'Möchten Sie diese Transaktion wirklich löschen?',
    'transaction.with_tag': 'Transaktionen mit Tag',

    // Analysis
    'analysis.title': 'Ausgabenanalyse',
    'analysis.week': 'Woche',
    'analysis.month': 'Monat',
    'analysis.income_expenses': 'Einnahmen und Ausgaben',
    'analysis.expense_forecast': 'Ausgabenprognose',
    'analysis.projected_expenses': 'Prognostizierte Ausgaben',
    'analysis.spending_distribution': 'Wo gibst du dein Geld aus?',
    'analysis.insights': 'Erkenntnisse',
    'analysis.monthly_average': 'Durchschnittliche monatliche Ausgaben',
    'analysis.highest_expense': 'Höchste Ausgabe',
    'analysis.lowest_expense': 'Niedrigste Ausgabe',

    // Profile
    'profile.title': 'Finanzprofil',
    'profile.total_expenses': 'Gesamtausgaben',
    'profile.last_salary': 'Letztes Gehalt',

    // Settings
    'settings.title': 'Einstellungen',
    'settings.budget_distribution': 'Budgetverteilung anpassen',
    'settings.data': 'Datenverwaltung',
    'settings.export': 'Daten exportieren',
    'settings.reset': 'Alle Daten zurücksetzen',
    'settings.reset_confirm': 'Sind Sie sicher? Diese Aktion kann nicht rückgängig gemacht werden.',
    'settings.total_must_be_100': 'Summe muss 100% ergeben',

    // Amounts
    'amounts.show': 'Beträge anzeigen',
    'amounts.hide': 'Beträge ausblenden',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('de');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}