'use client';

import { useState, useMemo } from 'react';
import { mockTools } from '@/data/mockData';
import ToolCard from '@/components/ui/ToolCard';

// 简单的本地存储管理
const getFavoritesFromStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveFavoritesToStorage = (favorites: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>(getFavoritesFromStorage());

  // Filter favorite tools
  const favoriteTools = useMemo(() => {
    return mockTools.filter((tool) => favorites.includes(tool.id));
  }, [favorites]);

  const handleToggleFavorite = (toolId: string) => {
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter((id) => id !== toolId)
      : [...favorites, toolId];

    setFavorites(newFavorites);
    saveFavoritesToStorage(newFavorites);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">我的收藏</h1>
        <p className="text-gray-600">
          {favoriteTools.length > 0
            ? `已收藏 ${favoriteTools.length} 个工具`
            : '还没有收藏任何工具'}
        </p>
      </div>

      {/* Favorites Grid */}
      {favoriteTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">还没有收藏任何工具</h3>
          <p className="text-gray-600 mb-6">
            浏览工具页面，点击心形图标添加收藏
          </p>
          <a
            href="/tools"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow"
          >
            前往工具导航
          </a>
        </div>
      )}
    </div>
  );
}
