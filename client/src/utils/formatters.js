/**
 * Formats a number into Indian Rupee format: ₹3,00,000
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  const num = Number(amount);
  if (isNaN(num)) return '₹0';
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

/**
 * Formats a date string into readable Indian format: 25 Oct 2026
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

/**
 * Returns color category for match score percentage
 */
export const getMatchScoreBadge = (score) => {
  if (score >= 85) return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0', label: 'Excellent Match' };
  if (score >= 70) return { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe', label: 'Good Match' };
  if (score >= 50) return { bg: '#fffbeb', text: '#92400e', border: '#fde68a', label: 'Fair Match' };
  return { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', label: 'Low Match' };
};
