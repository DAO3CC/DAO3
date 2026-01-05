'use client';

import { Category } from '@/types';
import { useSearchParams } from 'next/navigation';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryTabs({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="border-b border-gray-200 mb-8 overflow-x-auto bg-white rounded-t-xl">
      <div className="flex space-x-1 min-w-max px-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            selectedCategory === 'all'
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          全部
          {selectedCategory === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
              selectedCategory === category.id
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {category.name}
            {selectedCategory === category.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
