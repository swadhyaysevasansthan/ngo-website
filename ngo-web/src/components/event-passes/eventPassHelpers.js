/**
 * Returns a Tailwind CSS class string for a given pass category badge.
 */
export const getCategoryColor = (category) => {
  const cat = (category || '').toUpperCase();
  if (cat === 'VIP') return 'bg-red-100 text-red-800 border-red-200';
  if (cat === 'GUEST') return 'bg-blue-100 text-blue-800 border-blue-200';
  if (cat === 'DELEGATE') return 'bg-green-100 text-green-800 border-green-200';
  return 'bg-amber-100 text-amber-800 border-amber-200';
};

/**
 * Generates a random human-readable password for scanner device registration.
 */
export const generateScannerPassword = () => {
  const charset = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let pass = '';
  for (let i = 0; i < 10; i++) {
    pass += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return pass;
};
