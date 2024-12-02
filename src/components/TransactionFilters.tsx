import React from 'react';
import { Filter } from 'lucide-react';

interface TransactionFiltersProps {
  onFilterChange: (filters: {
    dateRange: 'all' | 'week' | 'month' | 'year';
    type: 'all' | 'income' | 'expense';
    category?: string;
  }) => void;
}

export function TransactionFilters({ onFilterChange }: TransactionFiltersProps) {
  const [filters, setFilters] = React.useState({
    dateRange: 'all',
    type: 'all',
    category: undefined,
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
        </div>
        
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">Alle Zeiträume</option>
          <option value="week">Diese Woche</option>
          <option value="month">Dieser Monat</option>
          <option value="year">Dieses Jahr</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">Alle Typen</option>
          <option value="income">Einnahmen</option>
          <option value="expense">Ausgaben</option>
        </select>

        <button
          onClick={() => {
            const csvContent = 'data:text/csv;charset=utf-8,' + 
              'Datum,Typ,Beschreibung,Betrag\n' +
              'Export-Funktion implementieren';
            
            const link = document.createElement('a');
            link.href = encodeURI(csvContent);
            link.download = 'finanzgarten-export.csv';
            link.click();
          }}
          className="ml-auto text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
