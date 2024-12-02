import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Transaction } from '../types/finance';
import { useLanguage } from '../contexts/LanguageContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ExpenseAnalysisProps {
  transactions: Transaction[];
}

export function ExpenseAnalysis({ transactions }: ExpenseAnalysisProps) {
  const { t } = useLanguage();
  const [timeFrame, setTimeFrame] = useState<'week' | 'month'>('month');
  const [chartData, setChartData] = useState<any>(null);
  const [trendData, setTrendData] = useState<any>(null);

  const categories = {
    fixed: { label: t('category.fixed'), color: 'rgba(54, 162, 235, 0.8)', border: 'rgba(54, 162, 235, 1)', amount: 0 },
    needs: { label: t('category.needs'), color: 'rgba(75, 192, 192, 0.8)', border: 'rgba(75, 192, 192, 1)', amount: 0 },
    wants: { label: t('category.wants'), color: 'rgba(255, 206, 86, 0.8)', border: 'rgba(255, 206, 86, 1)', amount: 0 },
    savings: { label: t('category.savings'), color: 'rgba(153, 102, 255, 0.8)', border: 'rgba(153, 102, 255, 1)', amount: 0 }
  };

  transactions
    .filter(t => t.type === 'expense' && t.category)
    .forEach(transaction => {
      const categoryType = transaction.category?.type || 'fixed';
      if (categoryType in categories) {
        categories[categoryType as keyof typeof categories].amount += transaction.amount;
      }
    });

  const pieData = {
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

  const pieOptions = {
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

  const processTransactions = () => {
    const now = new Date();
    const timeFrameStart = new Date();
    
    if (timeFrame === 'week') {
      timeFrameStart.setDate(now.getDate() - 7);
    } else {
      timeFrameStart.setMonth(now.getMonth() - 1);
    }

    const filteredTransactions = transactions.filter(t => 
      new Date(t.date) >= timeFrameStart
    );

    const labels = [];
    const incomeData = [];
    const expenseData = [];

    if (timeFrame === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('de-DE', { weekday: 'short' }));
        
        const dayTransactions = filteredTransactions.filter(t => 
          new Date(t.date).toDateString() === date.toDateString()
        );

        incomeData.push(
          dayTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)
        );

        expenseData.push(
          dayTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
        );
      }
    } else {
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        if (i % 3 === 0) {
          labels.push(date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }));
        } else {
          labels.push('');
        }
        
        const dayTransactions = filteredTransactions.filter(t => 
          new Date(t.date).toDateString() === date.toDateString()
        );

        incomeData.push(
          dayTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)
        );

        expenseData.push(
          dayTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
        );
      }
    }

    const trendLabels = [...Array(6)].map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      return date.toLocaleDateString('de-DE', { month: 'short' });
    });

    const avgExpense = expenseData.reduce((a, b) => a + b, 0) / expenseData.length;
    const trendLine = trendLabels.map((_, i) => avgExpense * (1 + i * 0.02));

    setChartData({
      labels,
      datasets: [
        {
          label: t('transaction.income'),
          data: incomeData,
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
        },
        {
          label: t('transaction.expense'),
          data: expenseData,
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
        },
      ],
    });

    setTrendData({
      labels: trendLabels,
      datasets: [
        {
          label: t('analysis.projected_expenses'),
          data: trendLine,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          tension: 0.4,
        },
      ],
    });
  };

  useEffect(() => {
    processTransactions();
  }, [timeFrame, transactions]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#374151',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: t('analysis.income_expenses'),
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#374151',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#374151',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#374151',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const trendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#374151',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: t('analysis.expense_forecast'),
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#374151',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#374151',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#374151',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('analysis.title')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFrame('week')}
              className={`px-4 py-2 rounded-lg ${
                timeFrame === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('analysis.week')}
            </button>
            <button
              onClick={() => setTimeFrame('month')}
              className={`px-4 py-2 rounded-lg ${
                timeFrame === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('analysis.month')}
            </button>
          </div>
        </div>
        {chartData && <Bar options={options} data={chartData} />}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {t('analysis.spending_distribution')}
        </h2>
        <div className="w-full max-w-md mx-auto">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {t('analysis.expense_forecast')}
        </h2>
        {trendData && <Line options={trendOptions} data={trendData} />}
        <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
            {t('analysis.insights')}
          </h3>
          <ul className="list-disc list-inside space-y-2 text-indigo-800 dark:text-indigo-200">
            <li>
              {t('analysis.monthly_average')}: €
              {(chartData?.datasets[1].data.reduce((a: number, b: number) => a + b, 0) / 
                (timeFrame === 'week' ? 7 : 30) * 30).toFixed(2)}
            </li>
            <li>
              {t('analysis.highest_expense')}: €
              {Math.max(...(chartData?.datasets[1].data || [0])).toFixed(2)}
            </li>
            <li>
              {t('analysis.lowest_expense')}: €
              {Math.min(...(chartData?.datasets[1].data.filter((x: number) => x > 0) || [0])).toFixed(2)}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}