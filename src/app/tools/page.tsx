'use client';

import { useState, useMemo, useEffect } from 'react';
import { mockCategories, mockTools } from '@/data/mockData';
import ToolCard from '@/components/ui/ToolCard';
import { Tool } from '@/types';

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  // 从localStorage加载收藏
  useEffect(() => {
    const savedFavorites = localStorage.getItem('dao3-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // 保存收藏到localStorage
  const handleToggleFavorite = (toolId: string) => {
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter((id) => id !== toolId)
      : [...favorites, toolId];

    setFavorites(newFavorites);
    localStorage.setItem('dao3-favorites', JSON.stringify(newFavorites));
  };

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    return mockTools.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        selectedCategory === 'favorites'
          ? favorites.includes(tool.id)
          : tool.category === selectedCategory;

      const matchesSearch =
        searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, favorites]);

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部提示 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>点击"收藏"加入"我常看的"</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
              <span>拖动页卡进行排序</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex">
          {/* 左侧分类侧边栏 */}
          <aside className="w-56 flex-shrink-0 mr-8">
            <div className="sticky top-20">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                分类导航
              </h2>
              <nav className="space-y-1">
                {/* 我常看的 */}
                <button
                  onClick={() => setSelectedCategory('favorites')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'favorites'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">⭐</span>
                  <span className="flex-1 text-left">我常看的</span>
                  {favorites.length > 0 && (
                    <span className="text-xs text-gray-400">{favorites.length}</span>
                  )}
                </button>

                {/* 全部工具 */}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">🌟</span>
                  <span className="flex-1 text-left">全部工具</span>
                  <span className="text-xs text-gray-400">{mockTools.length}</span>
                </button>

                {/* 分类列表 */}
                <div className="border-t border-gray-200 my-3"></div>

                {mockCategories.map((category) => {
                  const count = mockTools.filter((t) => t.category === category.id).length;
                  const isActive = selectedCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base">{category.icon || '📁'}</span>
                      <span className="flex-1 text-left truncate">{category.name}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">{count}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* 主内容区域 */}
          <div className="flex-1 min-w-0">
            {/* Page Header & Search */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedCategory === 'favorites'
                  ? '我常看的'
                  : selectedCategory === 'all'
                  ? '全部工具'
                  : mockCategories.find((c) => c.id === selectedCategory)?.name || '工具导航'}
              </h1>
              <p className="text-gray-600 mb-4">发现和探索最好的 Web3 工具</p>

              {/* Search Bar */}
              <div className="relative max-w-xl">
                <input
                  type="text"
                  placeholder="搜索工具名称、描述或标签..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                />
                <svg
                  className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Mobile Category Selector */}
            <div className="mb-6 lg:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
              >
                <option value="favorites">⭐ 我常看的</option>
                <option value="all">🌟 全部工具</option>
                {mockCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                找到 <span className="text-gray-900 font-medium">{filteredTools.length}</span> 个工具
              </p>
            </div>

            {/* Tools Grid */}
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.includes(tool.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到相关工具</h3>
                <p className="text-gray-600">请尝试使用不同的搜索词或选择其他分类</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
