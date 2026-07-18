import React from 'react';
import { Tag } from 'lucide-react';

export const CATEGORY_STYLE = {
  wildlife: 'bg-orange-100 text-orange-700',
  nature: 'bg-green-100 text-green-700',
};

const CategoryBadge = ({ category }) => {
  if (!category) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
        CATEGORY_STYLE[category] || 'bg-gray-100 text-gray-600'
      }`}
    >
      <Tag size={11} /> {category}
    </span>
  );
};

export default CategoryBadge;