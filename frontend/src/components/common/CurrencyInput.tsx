import React, { useState, useEffect } from 'react';
import { formatINR } from '../../utils/formatters';

interface CurrencyInputProps {
  value: number | string;
  onChange: (numericValue: number, rawString: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  required?: boolean;
  showPreview?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder = '50000',
  className = '',
  id,
  name,
  disabled = false,
  min = 0.01,
  max = 1000000000,
  required = false,
  showPreview = true,
}) => {
  // Keep local string representation so user can type freely without floating-point disruption
  const [displayValue, setDisplayValue] = useState<string>(() => {
    if (value === '' || value === 0 || value === undefined || value === null) return '';
    return value.toString();
  });

  useEffect(() => {
    if (value !== undefined && value !== null) {
      const numVal = typeof value === 'number' ? value : parseFloat(value);
      if (!isNaN(numVal) && numVal !== parseFloat(displayValue || '0')) {
        setDisplayValue(value.toString());
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Allow empty string
    if (raw === '') {
      setDisplayValue('');
      onChange(0, '');
      return;
    }

    // Sanitize: allow only digits and at most one decimal point with up to 2 decimal places
    const sanitized = raw.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    let cleaned = sanitized;
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length === 2 && parts[1].length > 2) {
      cleaned = parts[0] + '.' + parts[1].slice(0, 2);
    }

    setDisplayValue(cleaned);

    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) {
      onChange(parsed, cleaned);
    } else {
      onChange(0, cleaned);
    }
  };

  const parsedNumeric = parseFloat(displayValue) || 0;

  return (
    <div className="w-full">
      <div className="relative flex items-center">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-champagne font-mono text-xl sm:text-2xl font-bold select-none pointer-events-none">
          ₹
        </span>
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          id={id}
          name={name}
          disabled={disabled}
          required={required}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-2xl bg-surface-elevated/80 border border-bronze/70 text-ivory text-xl sm:text-2xl font-bold font-mono focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne/50 transition-all placeholder:text-typography-muted/40 tabular-nums ${className}`}
        />
      </div>

      {showPreview && parsedNumeric > 0 && (
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-typography-muted px-1">
          <span>Formatted: <strong className="text-champagne font-semibold">{formatINR(parsedNumeric)}</strong></span>
          {parsedNumeric > max && (
            <span className="text-danger">Exceeds max limit</span>
          )}
          {parsedNumeric < min && parsedNumeric > 0 && (
            <span className="text-danger">Must be at least ₹{min}</span>
          )}
        </div>
      )}
    </div>
  );
};
