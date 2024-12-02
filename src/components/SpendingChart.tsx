import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Transaction } from '../types/finance';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingChartProps {
  transactions: Transaction[];
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  const categories = {
    fixed: { label: 'Fixkosten', color: 'rgba(54, 162, 235, 0.8)', border: 'rgba(54, 162, 235, 1)', amount: 0 },
    needs: { label: 'Bedürfnisse', color: 'rgba(75, 192, 192, 0.8)', border: 'rgba(75, 192, 192, 1)', amount: 0 },
    wants: { label: 'Wünsche', color: 'rgba(255, 206, 86, 0.8)', border: 'rgba(255, 206, 86, 1)', amount: 0 },
    savings: { label: 'Sparen', color: 'rgba(153, 102, 255, 0.8)', border: 'rgba(153, 102, 255, 1)', amount: 0 }
  };

  transactions
    .filter(t => t.type === 'expense' && t.category)
    .forEach(transaction => {
      const categoryType = transaction.category?.type || 'fixed';
      if (categoryType in categories) {
        categories[categoryType as keyof typeof categories].amount += transaction.amount;
      }
    });

  const data = {
    labels: Object.values(categories).map(cat => cat.label),
    datasets: [
      {
        data: Object.values(categories).map(cat => cat.amount),
        backgroundColor: Object.values(categories).map(cat => cat.color),
        borderColor: Object.values(categories).map(cat => cat.border),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#374151',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `€${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Wo gibst du dein Geld aus?</h2>
      <div className="w-full max-w-md mx-auto">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}