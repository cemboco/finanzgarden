import React from 'react';
import { Calendar, Clock, RepeatIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Transaction } from '../types/finance';

interface FinancialCalendarProps {
  transactions: Transaction[];
}

export function FinancialCalendar({ transactions }: FinancialCalendarProps) {
  const [selectedMonth, setSelectedMonth] = React.useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const calendarEvents = React.useMemo(() => {
    const recurringTransactions = transactions.filter(t => t.isRecurring);
    const regularTransactions = transactions.filter(t => !t.isRecurring);
    
    const events: Record<string, Transaction[]> = {};
    
    // Add regular transactions
    regularTransactions.forEach(transaction => {
      const date = transaction.date.split('T')[0];
      if (!events[date]) events[date] = [];
      events[date].push(transaction);
    });
    
    // Add recurring transactions
    recurringTransactions.forEach(transaction => {
      if (transaction.nextDueDate) {
        const date = transaction.nextDueDate.split('T')[0];
        if (!events[date]) events[date] = [];
        events[date].push(transaction);
      }
    });
    
    return events;
  }, [transactions]);

  const getDaysInMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-').map(Number);
    return new Date(year, month - 1, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedMonth);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 dark:bg-gray-800/50" />);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${selectedMonth}-${String(day).padStart(2, '0')}`;
      const dayEvents = calendarEvents[date] || [];
      
      days.push(
        <div
          key={date}
          className="h-24 border border-gray-200 dark:border-gray-700 p-2 overflow-hidden hover:overflow-auto transition-all"
        >
          <div className="flex justify-between items-start">
            <span className="font-medium">{day}</span>
            {dayEvents.length > 0 && (
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-1.5 rounded-full">
                {dayEvents.length}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded ${
                  event.type === 'income'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}
              >
                <div className="flex items-center gap-1">
                  {event.isRecurring && <RepeatIcon className="h-3 w-3" />}
                  <span className="truncate">{event.description}</span>
                </div>
                <span className="font-medium">€{event.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const [year, month] = selectedMonth.split('-').map(Number);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Finanzkalender</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const [year, month] = selectedMonth.split('-').map(Number);
              const newDate = new Date(year, month - 2);
              setSelectedMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            ←
          </button>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date(year, i);
              return (
                <option
                  key={i}
                  value={`${date.getFullYear()}-${String(i + 1).padStart(2, '0')}`}
                >
                  {monthNames[i]} {date.getFullYear()}
                </option>
              );
            })}
          </select>
          <button
            onClick={() => {
              const [year, month] = selectedMonth.split('-').map(Number);
              const newDate = new Date(year, month);
              setSelectedMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px mb-px">
        {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {renderCalendar()}
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Einmalig</span>
        </div>
        <div className="flex items-center gap-1">
          <RepeatIcon className="h-4 w-4" />
          <span>Wiederkehrend</span>
        </div>
      </div>
    </motion.div>
  );
}
