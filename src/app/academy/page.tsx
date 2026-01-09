'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockArticles, articleCategories } from '@/data/mockArticles';

export default function AcademyPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter articles based on search
  const filteredArticles = useMemo(() => {
    return mockArticles.filter((article) => {
      return (
        searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [searchQuery]);

  // Featured articles (display 2)
  const featuredArticles = mockArticles.filter((a) => a.featured).slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="container mx-auto text-center">
          {/* Book Icon */}
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-blue-500 mb-6">
            Web3 知识库
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            深入了解 Web3 技术、DeFi 协议和区块链应用
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
                placeholder="搜索文章标题或内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">精选文章</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredArticles.map((article) => {
            const category = articleCategories.find((c) => c.id === article.category);
            return (
              <Link
                key={article.id}
                href={`/academy/${article.slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer">
                  {/* Cover Image */}
                  {article.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Category Tag */}
                    {category && (
                      <span className="inline-block bg-blue-50 text-blue-500 text-sm px-4 py-1.5 rounded-lg mb-4 font-medium">
                        {category.icon} {category.name}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-500 transition-colors leading-tight">
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p className="text-base text-gray-500 mb-6 leading-relaxed">
                      {article.excerpt}
                    </p>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 text-sm px-4 py-1.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bottom Info */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                      </span>
                      <span className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center group/link">
                        阅读更多
                        <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All Articles Section */}
      {searchQuery && (
        <section className="container mx-auto px-4 pb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">搜索结果 ({filteredArticles.length})</h2>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => {
                const category = articleCategories.find((c) => c.id === article.category);
                return (
                  <Link
                    key={article.id}
                    href={`/academy/${article.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer">
                      {/* Cover Image */}
                      {article.coverImage && (
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          {/* Category Badge on Image */}
                          {category && (
                            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-600 text-xs px-3 py-1 rounded-lg font-medium">
                              {category.icon} {category.name}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{article.excerpt}</p>

                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{new Date(article.publishedAt).toLocaleDateString('zh-CN')}</span>
                          <span className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center group/link">
                            阅读更多
                            <svg className="w-3 h-3 ml-1 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到相关文章</h3>
              <p className="text-gray-600">请尝试使用不同的搜索词</p>
            </div>
          )}
        </section>
      )}

      {/* Categories Section */}
      {!searchQuery && (
        <section className="container mx-auto px-4 pb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">按分类浏览</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articleCategories.map((category) => {
              const categoryArticles = mockArticles.filter((a) => a.category === category.id);

              return (
                <Link
                  key={category.id}
                  href={`/academy?category=${category.id}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{category.icon}</span>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-500 transition-colors">
                        {category.name}
                      </h3>
                    </div>
                    <span className="bg-blue-50 text-blue-500 text-sm px-3 py-1 rounded-lg font-medium">
                      {categoryArticles.length} 篇
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2">
                    {category.description || `浏览所有 ${category.name} 相关文章`}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
