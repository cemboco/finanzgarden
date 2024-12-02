import React from 'react';
import { useProfile } from '../hooks/useProfile';

interface AmountProps {
  value: number;
  type?: 'income' | 'expense';
  className?: string;
}

export function Amount({ value, type, className = '' }: AmountProps) {
  const { profile } = useProfile();
  const hideAmounts = profile.settings?.hideAmounts;

  const formattedAmount = `€${Math.abs(value).toFixed(2)}`;
  const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : '';

  return (
    <span className={`${className} ${hideAmounts ? 'blur-md hover:blur-none transition-all duration-300' : ''}`}>
      {prefix}{formattedAmount}
    </span>
  );
}