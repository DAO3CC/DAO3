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
        const targetElement = document.getElementById(`category-${categoryId}`);
        if (targetElement) {
          // 获取左侧被点击导航按钮的位置
          const navButtons = document.querySelectorAll(`button[onclick*="${categoryId}"]`);
          let navButtonTop = 0;
          navButtons.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            if (rect.top > 0) { // 找到可见的导航按钮
              navButtonTop = rect.top;
            }
          });

          // 计算目标滚动位置，使右侧分类标题与左侧导航按钮对齐
          const targetRect = targetElement.getBoundingClientRect();
          const currentScroll = window.pageYOffset;
          const offsetPosition = currentScroll + (targetRect.top - navButtonTop);

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
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
    <>
      <style jsx global>{`
        .sidebar-fixed-force {
          position: fixed !important;
          left: 0 !important;
          top: 64px !important;
          bottom: 0 !important;
          width: 96px !important;
          background-color: white !important;
          border-right: 1px solid rgb(229 231 235) !important;
          z-index: 9999 !important;
        }

        @media (min-width: 768px) {
          .sidebar-fixed-force {
            width: 224px !important;
          }
        }

        @keyframes rotate3d {
          0% {
            transform: perspective(500px) rotateY(0deg);
          }
          100% {
            transform: perspective(500px) rotateY(360deg);
          }
        }

        .icon-3d {
        }

        .group:hover .icon-3d {
          animation: rotate3d 0.8s ease-out;
        }

        .group:hover .icon-label {
          opacity: 1 !important;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* 左侧分类侧边栏 - 固定定位，不随页面滚动 */}
        <aside className="sidebar-fixed-force">
          <div className="h-full px-2 md:px-4 pt-2 space-y-2">
            {/* 小屏幕 - 只显示图标 */}
            <div className="md:hidden space-y-2">
                {/* 我常看的 */}
                <div className="relative group">
                  <button
                    onClick={() => handleCategoryClick('favorites')}
                    className={`w-full flex flex-col items-center justify-center px-3 py-3 rounded-lg transition-colors ${
                      lastClickedCategory === 'favorites'
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-[50px] h-[50px] text-yellow-500 icon-3d" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="icon-label text-xs mt-1 font-medium opacity-0 transition-opacity duration-300">收藏</span>
                  </button>
                </div>

                {/* 全部工具 */}
                <div className="relative group">
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className={`w-full flex flex-col items-center justify-center px-3 py-3 rounded-lg transition-colors ${
                      lastClickedCategory === 'all'
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <img
                      src="/icons/categories/all-tools.png"
                      alt="全部工具"
                      className="w-[60px] h-[60px] object-contain icon-3d"
                    />
                    <span className="icon-label text-xs mt-1 font-medium opacity-0 transition-opacity duration-300">全部</span>
                  </button>
                </div>

                {/* 分类列表 - 只显示图标 */}
                {mockCategories.map((category) => (
                  <div key={category.id} className="relative group">
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full flex flex-col items-center justify-center px-3 py-3 rounded-lg transition-colors ${
                        lastClickedCategory === category.id
                          ? 'bg-blue-50'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category.logo ? (
                        <img
                          src={category.logo}
                          alt={category.name}
                          className="w-[50px] h-[50px] object-contain icon-3d"
                        />
                      ) : (
                        <span className="text-[50px] icon-3d">{category.icon || '📁'}</span>
                      )}
                      <span className="icon-label text-xs mt-1 font-medium opacity-0 transition-opacity duration-300 truncate w-full text-center">
                        {category.shortName || category.name}
                      </span>
                    </button>
                  </div>
                ))}
              </div>

              {/* 大屏幕 - 显示完整的侧边栏 */}
              <div className="hidden md:block">
                <nav className="space-y-1">
                  {/* 我常看的 */}
                  <button
                    onClick={() => handleCategoryClick('favorites')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      lastClickedCategory === 'favorites'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-6 h-6 flex-shrink-0 text-yellow-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="flex-1 text-left">收藏</span>
                    {favorites.length > 0 && (
                      <span className="text-xs text-gray-400">{favorites.length}</span>
                    )}
                  </button>

                  {/* 全部工具 */}
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      lastClickedCategory === 'all'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <img
                      src="/icons/categories/all-tools.png"
                      alt="全部工具"
                      className="w-6 h-6 object-contain flex-shrink-0"
                    />
                    <span className="flex-1 text-left">全部工具</span>
                    <span className="text-xs text-gray-400">{mockTools.length}</span>
                  </button>

                  {/* 分类列表 */}
                  <div className="border-t border-gray-200 my-3"></div>

                  {mockCategories.map((category) => {
                    const count = mockTools.filter((t) => t.category === category.id).length;
                    const isLastClicked = lastClickedCategory === category.id;

                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isLastClicked
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category.logo ? (
                          <img
                            src={category.logo}
                            alt={category.name}
                            className="w-6 h-6 object-contain flex-shrink-0"
                          />
                        ) : (
                          <span className="text-xl flex-shrink-0">{category.icon || '📁'}</span>
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

      {/* 主内容区域 - 添加左边距和padding以避开固定的侧边栏 */}
      <div className="ml-24 md:ml-56">
        {/* Hero Section */}
        <section className="bg-gray-50 py-12 px-4 mb-6">
          <div className="container mx-auto text-center">
            {/* Wrench Icon */}
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-4">
              Web3 工具导航
            </h1>

            {/* Subtitle */}
            <p className="text-base text-gray-500 mb-8 max-w-2xl mx-auto">
              探索优质 Web3 工具，提升你的区块链体验
            </p>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <svg
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
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
                <input
                  type="text"
                  placeholder="搜索工具名称、描述或标签..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 工具列表内容 */}
        <div className="px-4 pb-6">
            {/* 搜索结果 */}
            {searchQuery && (
              <div className="mb-8">
                <p className="text-sm text-gray-600 mb-4">
                  找到 <span className="text-gray-900 font-medium">{filteredTools.length}</span> 个工具
                </p>
                {filteredTools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
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
              <div className="space-y-4">
                {/* 我常看的 */}
                <section
                  id="category-favorites"
                  ref={(el) => { categoryRefs.current['favorites'] = el; }}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => handleCategoryClick('favorites')}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <svg className="w-8 h-8 mr-3 text-yellow-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      收藏
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
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
                  className="border border-gray-200 rounded-xl overflow-hidden"
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
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
                      className="border border-gray-200 rounded-xl overflow-hidden"
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
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
    </>
  );
}
