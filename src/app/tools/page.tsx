'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { mockCategories, mockTools } from '@/data/mockData';
import ToolCard from '@/components/ui/ToolCard';
import { Tool } from '@/types';

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  // 初始展开所有分类，除了"全部工具"（all）
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['favorites', ...mockCategories.map(c => c.id)])
  );
  const [lastClickedCategory, setLastClickedCategory] = useState<string | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // 从localStorage加载收藏
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
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
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // 滚动监听，自动高亮可见的分类
  useEffect(() => {
    // 获取所有分类区域元素
    const allElements = [
      document.getElementById('category-favorites'),
      document.getElementById('category-all'),
      ...mockCategories.map(cat => document.getElementById(`category-${cat.id}`))
    ].filter(Boolean);

    if (allElements.length === 0) return;

    // 使用 IntersectionObserver 检测可见元素
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoryId = entry.target.id.replace('category-', '');
            setLastClickedCategory(categoryId);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1
      }
    );

    // 观察所有分类元素
    allElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [mockCategories]);

  // 处理分类点击（第一次定位，第二次展开/收起）
  const handleCategoryClick = (categoryId: string) => {
    if (lastClickedCategory === categoryId) {
      // 第二次点击同一个分类：切换展开/收起
      const newExpanded = new Set(expandedCategories);
      if (newExpanded.has(categoryId)) {
        newExpanded.delete(categoryId);
      } else {
        newExpanded.add(categoryId);
      }
      setExpandedCategories(newExpanded);
    } else {
      // 第一次点击或点击不同分类：只滚动定位
      setLastClickedCategory(categoryId);
      setTimeout(() => {
        document.getElementById(`category-${categoryId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    return mockTools.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' ? true :
        selectedCategory === 'favorites' ? favorites.includes(tool.id) :
        selectedCategory === null ? true :
        tool.category === selectedCategory;

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

      <div className="px-4 py-6">
        <div className="flex gap-6">
          {/* 左侧分类侧边栏 - 使用fixed定位，完全固定，无任何滚动 */}
          <aside className="fixed left-0 top-0 h-full w-16 md:w-56 bg-white border-r border-gray-200 z-40 overflow-hidden">
            <div className="h-full py-4 md:py-6 px-2 md:px-4 space-y-2">
              {/* 小屏幕 - 只显示图标 */}
              <div className="md:hidden space-y-2">
                {/* 我常看的 */}
                <button
                  onClick={() => handleCategoryClick('favorites')}
                  title="我常看的"
                  className={`w-full flex justify-center px-3 py-3 rounded-lg transition-colors ${
                    lastClickedCategory === 'favorites'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">⭐</span>
                </button>

                {/* 全部工具 */}
                <button
                  onClick={() => handleCategoryClick('all')}
                  title="全部工具"
                  className={`w-full flex justify-center px-3 py-3 rounded-lg transition-colors ${
                    lastClickedCategory === 'all'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <img
                    src="/icons/categories/all-tools.png"
                    alt="全部工具"
                    className="w-6 h-6 object-contain"
                  />
                </button>

                {/* 分类列表 - 只显示图标 */}
                {mockCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    title={category.name}
                    className={`w-full flex justify-center px-3 py-3 rounded-lg transition-colors ${
                      lastClickedCategory === category.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.logo ? (
                      <img
                        src={category.logo}
                        alt={category.name}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <span className="text-xl">{category.icon || '📁'}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* 大屏幕 - 显示完整的侧边栏 */}
              <div className="hidden md:block">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  分类导航
                </h2>
                <nav className="space-y-1">
                  {/* 我常看的 */}
                  <button
                    onClick={() => handleCategoryClick('favorites')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      lastClickedCategory === 'favorites'
                        ? expandedCategories.has('favorites')
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
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
                    onClick={() => handleCategoryClick('all')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      lastClickedCategory === 'all'
                        ? expandedCategories.has('all')
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <img
                      src="/icons/categories/all-tools.png"
                      alt="全部工具"
                      className="w-5 h-5 object-contain flex-shrink-0"
                    />
                    <span className="flex-1 text-left">全部工具</span>
                    <span className="text-xs text-gray-400">{mockTools.length}</span>
                  </button>

                  {/* 分类列表 */}
                  <div className="border-t border-gray-200 my-3"></div>

                  {mockCategories.map((category) => {
                    const count = mockTools.filter((t) => t.category === category.id).length;
                    const isLastClicked = lastClickedCategory === category.id;
                    const isExpanded = expandedCategories.has(category.id);

                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isLastClicked
                            ? isExpanded
                              ? 'text-gray-700 hover:bg-gray-100'
                              : 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category.logo ? (
                          <img
                            src={category.logo}
                            alt={category.name}
                            className="w-5 h-5 object-contain flex-shrink-0"
                          />
                        ) : (
                          <span className="text-base">{category.icon || '📁'}</span>
                        )}
                        <span className="flex-1 text-left truncate">{category.name}</span>
                        <span className="text-xs text-gray-400 flex-shrink-0">{count}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* 主内容区域 - 添加左边距以避开固定的侧边栏 */}
          <div className="flex-1 min-w-0 ml-16 md:ml-56">
            {/* Search Bar */}
            <div className="mb-6">
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

            {/* 搜索结果 */}
            {searchQuery && (
              <div className="mb-8">
                <p className="text-sm text-gray-600 mb-4">
                  找到 <span className="text-gray-900 font-medium">{filteredTools.length}</span> 个工具
                </p>
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
                    <p className="text-gray-600">请尝试使用不同的搜索词</p>
                  </div>
                )}
              </div>
            )}

            {/* 按分类显示所有工具 */}
            {!searchQuery && (
              <div className="space-y-6">
                {/* 我常看的 */}
                <section
                  id="category-favorites"
                  ref={(el) => { categoryRefs.current['favorites'] = el; }}
                  className="scroll-mt-24 border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => handleCategoryClick('favorites')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <span className="text-2xl mr-3">⭐</span>
                      我常看的
                      <span className="ml-3 text-sm font-normal text-gray-500">{favorites.length} 个工具</span>
                    </h2>
                    <svg
                      className={`w-6 h-6 transition-transform ${expandedCategories.has('favorites') ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedCategories.has('favorites') && (
                    <div className="px-6 pb-6">
                      {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {mockTools.filter((tool) => favorites.includes(tool.id)).map((tool) => (
                            <ToolCard
                              key={tool.id}
                              tool={tool}
                              onToggleFavorite={handleToggleFavorite}
                              isFavorite={true}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                          <div className="text-5xl mb-4">⭐</div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">还没有收藏任何工具</h3>
                          <p className="text-gray-600">点击工具卡片上的心形图标添加收藏</p>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* 全部工具 */}
                <section
                  id="category-all"
                  ref={(el) => { categoryRefs.current['all'] = el; }}
                  className="scroll-mt-24 border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <img src="/icons/categories/all-tools.png" alt="全部工具" className="w-8 h-8 mr-3" />
                      全部工具
                      <span className="ml-3 text-sm font-normal text-gray-500">{mockTools.length} 个工具</span>
                    </h2>
                    <svg
                      className={`w-6 h-6 transition-transform ${expandedCategories.has('all') ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedCategories.has('all') && (
                    <div className="px-6 pb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {mockTools.map((tool) => (
                          <ToolCard
                            key={tool.id}
                            tool={tool}
                            onToggleFavorite={handleToggleFavorite}
                            isFavorite={favorites.includes(tool.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* 分类工具列表 */}
                {mockCategories.map((category) => {
                  const categoryTools = mockTools.filter((t) => t.category === category.id);

                  if (categoryTools.length === 0) return null;

                  return (
                    <section
                      key={category.id}
                      id={`category-${category.id}`}
                      ref={(el) => { categoryRefs.current[category.id] = el; }}
                      className="scroll-mt-24 border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                          {category.logo ? (
                            <img src={category.logo} alt={category.name} className="w-8 h-8 mr-3" />
                          ) : (
                            <span className="text-2xl mr-3">{category.icon || '📁'}</span>
                          )}
                          {category.name}
                          <span className="ml-3 text-sm font-normal text-gray-500">{categoryTools.length} 个工具</span>
                        </h2>
                        <svg
                          className={`w-6 h-6 transition-transform ${expandedCategories.has(category.id) ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedCategories.has(category.id) && (
                        <div className="px-6 pb-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {categoryTools.map((tool) => (
                              <ToolCard
                                key={tool.id}
                                tool={tool}
                                onToggleFavorite={handleToggleFavorite}
                                isFavorite={favorites.includes(tool.id)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
