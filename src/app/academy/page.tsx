'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockArticles, articleCategories } from '@/data/mockArticles';
import { Article } from '@/types';

export default function AcademyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter articles based on category and search
  const filteredArticles = useMemo(() => {
    return mockArticles.filter((article) => {
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Featured articles
  const featuredArticles = mockArticles.filter((a) => a.featured);

  // Get articles by category
  const getArticlesByCategory = (categoryId: string, limit = 3) => {
    return mockArticles
      .filter((a) => a.category === categoryId)
      .slice(0, limit);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">DAO³ 加密学院</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            您值得信赖的加密知识与行业洞察平台
          </p>
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 pl-12 bg-white/10 backdrop-blur border border-white/30 rounded-xl text-white placeholder-blue-100 focus:outline-none focus:border-white focus:bg-white/20 transition-all"
            />
            <svg
              className="absolute left-4 top-3.5 h-5 w-5 text-blue-100"
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
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Section */}
        {featuredArticles.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">精选内容</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => {
                const category = articleCategories.find((c) => c.id === article.category);
                return (
                  <Link
                    key={article.id}
                    href={`/academy/${article.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {article.coverImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {category && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                              {category.icon} {category.name}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {article.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Latest Articles */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">最新发布</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.slice(0, 9).map((article) => {
              const category = articleCategories.find((c) => c.id === article.category);
              return (
                <Link
                  key={article.id}
                  href={`/academy/${article.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  {article.coverImage && (
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {category && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-blue-600/90 text-white text-xs px-2 py-1 rounded-md">
                            {category.icon} {category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(article.publishedAt).toLocaleDateString('zh-CN')}</span>
                      {article.tags && article.tags.length > 0 && (
                        <span className="bg-gray-100 px-2 py-1 rounded-md">{article.tags[0]}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到相关文章</h3>
              <p className="text-gray-600">请尝试使用不同的搜索词或选择其他分类</p>
            </div>
          )}
        </section>

        {/* Articles by Category */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">按分类浏览</h2>
          <div className="space-y-8">
            {articleCategories.map((category) => {
              const categoryArticles = getArticlesByCategory(category.id);
              if (categoryArticles.length === 0) return null;

              return (
                <div key={category.id} className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </h3>
                    <Link
                      href={`/academy?category=${category.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      查看更多
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categoryArticles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/academy/${article.slug}`}
                        className="group"
                      >
                        <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                          {article.coverImage && (
                            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                              <Image
                                src={article.coverImage}
                                alt={article.title}
                                width={80}
                                height={80}
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {article.title}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Topics Tags */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">所有主题</h2>
          <div className="flex flex-wrap gap-3">
            {['比特币', '以太坊', 'DeFi', 'NFT', 'AI', 'Web3', '安全', '交易', '区块链', '稳定币'].map((topic) => (
              <button
                key={topic}
                onClick={() => setSearchQuery(topic)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all"
              >
                #{topic}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
