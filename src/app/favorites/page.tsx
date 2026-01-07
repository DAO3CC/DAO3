'use client';

import { useState, useMemo, useEffect } from 'react';
import { mockTools } from '@/data/mockData';
import ToolCard from '@/components/ui/ToolCard';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // 从localStorage加载收藏
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }, []);

  // Filter favorite tools
  const favoriteTools = useMemo(() => {
    if (!mounted) return [];
    return mockTools.filter((tool) => favorites.includes(tool.id));
  }, [favorites, mounted]);

  const handleToggleFavorite = (toolId: string) => {
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter((id) => id !== toolId)
      : [...favorites, toolId];

    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // 避免服务端渲染不匹配
  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">我常看的</h1>
        <p className="text-xl text-gray-600">
          {favoriteTools.length > 0
            ? `已收藏 ${favoriteTools.length} 个工具`
            : '还没有收藏任何工具'}
        </p>
      </div>

      {/* Favorites Grid */}
      {favoriteTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <div className="text-center py-32">
          <div className="text-8xl mb-8">⭐</div>
          <h3 className="text-3xl font-semibold text-gray-900 mb-4">还没有收藏任何工具</h3>
          <p className="text-xl text-gray-600 mb-12">
            浏览工具页面，点击心形图标添加收藏
          </p>
          <Link
            href="/tools"
            className="inline-block px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            前往工具导航
          </Link>
        </div>
      )}
    </div>
  );
}
