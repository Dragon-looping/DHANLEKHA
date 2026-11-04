export function formatINR(amount: number | string | null | undefined): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount ?? 0;
  if (isNaN(num)) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(num);
}

export function formatINRWithDecimals(amount: number | string | null | undefined): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount ?? 0;
  if (isNaN(num)) return '₹0.00';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

// Warm Golden & Bronze Luxury Fintech Palette
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; hex: string }> = {
  'Food and Dining': { bg: 'bg-[#E5A94B]/15', text: 'text-[#E5A94B]', hex: '#E5A94B' },
  'Housing and Rent': { bg: 'bg-[#D6B77A]/15', text: 'text-[#D6B77A]', hex: '#D6B77A' },
  'Transportation': { bg: 'bg-[#B89758]/15', text: 'text-[#B89758]', hex: '#B89758' },
  'Shopping': { bg: 'bg-[#D98236]/15', text: 'text-[#D98236]', hex: '#D98236' },
  'Entertainment': { bg: 'bg-[#EADEC3]/15', text: 'text-[#EADEC3]', hex: '#EADEC3' },
  'Healthcare': { bg: 'bg-[#00C99A]/15', text: 'text-[#00C99A]', hex: '#00C99A' },
  'Education': { bg: 'bg-[#C4A87C]/15', text: 'text-[#C4A87C]', hex: '#C4A87C' },
  'Other': { bg: 'bg-[#A69A87]/15', text: 'text-[#A69A87]', hex: '#A69A87' },
};

export const STANDARD_CATEGORIES = [
  'Food and Dining',
  'Housing and Rent',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Education',
  'Other',
];
