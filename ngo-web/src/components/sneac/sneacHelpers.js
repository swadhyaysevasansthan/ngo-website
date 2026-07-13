// 🔥 SNEAC — shared helpers used across the admin panel components

export const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const formatDateLong = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

// Fields sometimes come back as JSON strings, sometimes already parsed.
export const parseMaybeJSON = (raw) => {
  if (!raw) return [];
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
};

export const getCategories = (reg) => parseMaybeJSON(reg.competition_categories);

// Has every category the school opted into actually been allotted a date?
export const isFullyAllotted = (reg, competitionType) => {
  if (competitionType === 'painting') {
    const categories = getCategories(reg);
    const primaryOk = categories.includes('primary') ? !!reg.primary_allotted_date : true;
    const secondaryOk = categories.includes('secondary') ? !!reg.secondary_allotted_date : true;
    return primaryOk && secondaryOk;
  }
  return !!reg.allotted_date;
};