'use client';

import { useState, useMemo, useEffect } from 'react';
import { mockTools, mockCategories, mockAirdrops } from '@/data/mockData';
import { mockArticles, articleCategories } from '@/data/mockArticles';
import { Tool, Airdrop, Category, Article } from '@/types';

type TabType = 'tools' | 'airdrops' | 'categories' | 'articles';

const ADMIN_PASSWORD = 'dao3admin2025'; // 管理员密码

export default function AdminPage() {
  // 访问控制 state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(true);

  // Main state
  const [activeTab, setActiveTab] = useState<TabType>('tools');

  // Tools state
  const [tools, setTools] = useState<Tool[]>(mockTools);
  const [toolSearchQuery, setToolSearchQuery] = useState('');
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);

  // Airdrops state
  const [airdrops, setAirdrops] = useState<Airdrop[]>(mockAirdrops);
  const [airdropSearchQuery, setAirdropSearchQuery] = useState('');
  const [editingAirdrop, setEditingAirdrop] = useState<Airdrop | null>(null);
  const [isAirdropModalOpen, setIsAirdropModalOpen] = useState(false);

  // Categories state
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Articles state
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  // 验证密码
  useEffect(() => {
    const auth = localStorage.getItem('dao3-admin-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      setShowPasswordInput(false);
    }
  }, []);

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(toolSearchQuery.toLowerCase())
    );
  }, [tools, toolSearchQuery]);

  // Filter airdrops based on search query
  const filteredAirdrops = useMemo(() => {
    return airdrops.filter(
      (airdrop) =>
        airdrop.title.toLowerCase().includes(airdropSearchQuery.toLowerCase()) ||
        airdrop.description.toLowerCase().includes(airdropSearchQuery.toLowerCase())
    );
  }, [airdrops, airdropSearchQuery]);

  // Filter articles based on search query
  const filteredArticles = useMemo(() => {
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(articleSearchQuery.toLowerCase())
    );
  }, [articles, articleSearchQuery]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowPasswordInput(false);
      localStorage.setItem('dao3-admin-auth', 'true');
    } else {
      alert('密码错误！');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowPasswordInput(true);
    localStorage.removeItem('dao3-admin-auth');
    setPassword('');
  };

  // 如果未认证，显示密码输入框
  if (showPasswordInput) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">DAO³ 后台管理</h1>
            <p className="text-gray-600">请输入管理员密码</p>
          </div>
          <input
            type="password"
            placeholder="输入密码..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            登录
          </button>
        </div>
      </div>
    );
  }

  // Tool handlers
  const handleAddTool = () => {
    const newTool: Tool = {
      id: Date.now().toString(),
      name: '',
      description: '',
      icon: '',
      url: '',
      category: mockCategories[0].id,
      tags: [],
      hot: false,
      featured: false,
      order: tools.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingTool(newTool);
    setIsToolModalOpen(true);
  };

  const handleEditTool = (tool: Tool) => {
    setEditingTool({ ...tool });
    setIsToolModalOpen(true);
  };

  const handleDeleteTool = (toolId: string) => {
    if (confirm('确定要删除这个工具吗？')) {
      setTools(tools.filter((tool) => tool.id !== toolId));
    }
  };

  const handleSaveTool = () => {
    if (!editingTool) return;

    if (tools.find((t) => t.id === editingTool.id)) {
      setTools(
        tools.map((t) => (t.id === editingTool.id ? { ...editingTool, updatedAt: new Date().toISOString() } : t))
      );
    } else {
      setTools([...tools, editingTool]);
    }

    setIsToolModalOpen(false);
    setEditingTool(null);
  };

  // Airdrop handlers
  const handleAddAirdrop = () => {
    const newAirdrop: Airdrop = {
      id: Date.now().toString(),
      title: '',
      description: '',
      imageUrl: '',
      link: '',
      status: 'active',
      order: airdrops.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingAirdrop(newAirdrop);
    setIsAirdropModalOpen(true);
  };

  const handleEditAirdrop = (airdrop: Airdrop) => {
    setEditingAirdrop({ ...airdrop });
    setIsAirdropModalOpen(true);
  };

  const handleDeleteAirdrop = (airdropId: string) => {
    if (confirm('确定要删除这个空投任务吗？')) {
      setAirdrops(airdrops.filter((airdrop) => airdrop.id !== airdropId));
    }
  };

  const handleSaveAirdrop = () => {
    if (!editingAirdrop) return;

    if (airdrops.find((a) => a.id === editingAirdrop.id)) {
      setAirdrops(
        airdrops.map((a) => (a.id === editingAirdrop.id ? { ...editingAirdrop, updatedAt: new Date().toISOString() } : a))
      );
    } else {
      setAirdrops([...airdrops, editingAirdrop]);
    }

    setIsAirdropModalOpen(false);
    setEditingAirdrop(null);
  };

  // Category handlers
  const handleAddCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: '',
      slug: '',
      icon: '📁',
      order: categories.length,
    };
    setEditingCategory(newCategory);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category });
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('确定要删除这个分类吗？该分类下的工具将被移至"热门"分类。')) {
      setCategories(categories.filter((c) => c.id !== categoryId));
    }
  };

  const handleSaveCategory = () => {
    if (!editingCategory) return;

    if (categories.find((c) => c.id === editingCategory.id)) {
      setCategories(
        categories.map((c) => (c.id === editingCategory.id ? { ...editingCategory } : c))
      );
    } else {
      setCategories([...categories, editingCategory]);
    }

    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const moveCategory = (fromIndex: number, toIndex: number) => {
    const newCategories = [...categories];
    const [removed] = newCategories.splice(fromIndex, 1);
    newCategories.splice(toIndex, 0, removed);
    // 更新order
    newCategories.forEach((cat, index) => {
      cat.order = index;
    });
    setCategories(newCategories);
  };

  // Article handlers
  const handleAddArticle = () => {
    const newArticle: Article = {
      id: Date.now().toString(),
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: articleCategories[0].id,
      tags: [],
      author: 'DAO³ Labs',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: articles.length,
      featured: false,
    };
    setEditingArticle(newArticle);
    setIsArticleModalOpen(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle({ ...article });
    setIsArticleModalOpen(true);
  };

  const handleDeleteArticle = (articleId: string) => {
    if (confirm('确定要删除这篇文章吗？')) {
      setArticles(articles.filter((article) => article.id !== articleId));
    }
  };

  const handleSaveArticle = () => {
    if (!editingArticle) return;

    if (articles.find((a) => a.id === editingArticle.id)) {
      setArticles(
        articles.map((a) => (a.id === editingArticle.id ? { ...editingArticle, updatedAt: new Date().toISOString() } : a))
      );
    } else {
      setArticles([...articles, editingArticle]);
    }

    setIsArticleModalOpen(false);
    setEditingArticle(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar with Logout */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-900">DAO³ 后台管理</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('tools')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tools'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              工具管理
            </button>
            <button
              onClick={() => setActiveTab('airdrops')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'airdrops'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              空投任务
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'categories'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              分类管理
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'articles'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              文章管理
            </button>
          </div>
        </div>

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <>
            {/* Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="搜索工具..."
                  value={toolSearchQuery}
                  onChange={(e) => setToolSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
              <button
                onClick={handleAddTool}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                添加工具
              </button>
            </div>

            {/* Tools Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      工具名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      分类
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      链
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      热门/精选
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTools.map((tool) => {
                    const category = categories.find((c) => c.id === tool.category);
                    return (
                      <tr key={tool.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img src={tool.icon} alt="" className="w-8 h-8 rounded-lg mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{tool.name}</div>
                              <div className="text-sm text-gray-500">{tool.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{category?.name || '-'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {tool.chain && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                              {tool.chain}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {tool.hot && (
                              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">热门</span>
                            )}
                            {tool.featured && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">精选</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditTool(tool)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteTool(tool.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Airdrops Tab */}
        {activeTab === 'airdrops' && (
          <>
            {/* Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="搜索空投..."
                  value={airdropSearchQuery}
                  onChange={(e) => setAirdropSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
              <button
                onClick={handleAddAirdrop}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                添加空投
              </button>
            </div>

            {/* Airdrops Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      标题
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      链
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      奖励类型
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAirdrops.map((airdrop) => (
                    <tr key={airdrop.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={airdrop.imageUrl} alt="" className="w-12 h-12 rounded-lg mr-3 object-cover" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{airdrop.title}</div>
                            <div className="text-sm text-gray-500">{airdrop.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {airdrop.chain && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {airdrop.chain}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            airdrop.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : airdrop.status === 'ended'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {airdrop.status === 'active' ? '进行中' : airdrop.status === 'ended' ? '已结束' : '即将开始'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {airdrop.rewardType && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {airdrop.reward || '-'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditAirdrop(airdrop)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteAirdrop(airdrop.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <>
            {/* Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">共 {categories.length} 个分类</div>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                添加分类
              </button>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      排序
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      分类名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      可见性
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {index > 0 && (
                            <button
                              onClick={() => moveCategory(index, index - 1)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ↑
                            </button>
                          )}
                          {index < categories.length - 1 && (
                            <button
                              onClick={() => moveCategory(index, index + 1)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ↓
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{category.icon || '📁'}</span>
                          <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">{category.slug}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            const updatedCategory = {
                              ...category,
                              visible: category.visible === false ? true : false,
                            };
                            setCategories(
                              categories.map((c) => (c.id === category.id ? updatedCategory : c))
                            );
                          }}
                          className={`text-xs px-2 py-1 rounded ${
                            category.visible === false
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {category.visible === false ? '隐藏' : '显示'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <>
            {/* Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="搜索文章..."
                  value={articleSearchQuery}
                  onChange={(e) => setArticleSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
              <button
                onClick={handleAddArticle}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                发布文章
              </button>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => {
                const category = articleCategories.find((c) => c.id === article.category);
                return (
                  <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {article.coverImage && (
                      <div className="relative h-40">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        {category && (
                          <div className="absolute top-2 left-2">
                            <span className="text-xs px-2 py-1 bg-blue-600/90 text-white rounded">
                              {category.icon} {category.name}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {article.featured && (
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                              精选
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="text-blue-600 hover:text-blue-900 text-xs"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="text-red-600 hover:text-red-900 text-xs"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Tool Modal */}
      {isToolModalOpen && editingTool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {tools.find((t) => t.id === editingTool.id) ? '编辑工具' : '添加工具'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">工具名称</label>
                  <input
                    type="text"
                    value={editingTool.name}
                    onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <textarea
                    value={editingTool.description}
                    onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">图标URL</label>
                  <input
                    type="text"
                    value={editingTool.icon}
                    onChange={(e) => setEditingTool({ ...editingTool, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">链接</label>
                  <input
                    type="text"
                    value={editingTool.url}
                    onChange={(e) => setEditingTool({ ...editingTool, url: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    value={editingTool.category}
                    onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标签 (逗号分隔)</label>
                  <input
                    type="text"
                    value={editingTool.tags?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingTool({
                        ...editingTool,
                        tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">链</label>
                    <select
                      value={editingTool.chain || ''}
                      onChange={(e) => setEditingTool({ ...editingTool, chain: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      <option value="">无</option>
                      <option value="ethereum">Ethereum</option>
                      <option value="bsc">BNB Chain</option>
                      <option value="base">Base</option>
                      <option value="arbitrum">Arbitrum</option>
                      <option value="optimism">Optimism</option>
                      <option value="solana">Solana</option>
                      <option value="polygon">Polygon</option>
                      <option value="avalanche">Avalanche</option>
                    </select>
                  </div>
                  <div className="flex items-end space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingTool.hot || false}
                        onChange={(e) => setEditingTool({ ...editingTool, hot: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">热门</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingTool.featured || false}
                        onChange={(e) => setEditingTool({ ...editingTool, featured: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">精选</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsToolModalOpen(false);
                    setEditingTool(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveTool}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Airdrop Modal */}
      {isAirdropModalOpen && editingAirdrop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {airdrops.find((a) => a.id === editingAirdrop.id) ? '编辑空投' : '添加空投'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                  <input
                    type="text"
                    value={editingAirdrop.title}
                    onChange={(e) => setEditingAirdrop({ ...editingAirdrop, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <textarea
                    value={editingAirdrop.description}
                    onChange={(e) => setEditingAirdrop({ ...editingAirdrop, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">封面图片URL</label>
                  <input
                    type="text"
                    value={editingAirdrop.imageUrl}
                    onChange={(e) => setEditingAirdrop({ ...editingAirdrop, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">链接</label>
                  <input
                    type="text"
                    value={editingAirdrop.link}
                    onChange={(e) => setEditingAirdrop({ ...editingAirdrop, link: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                    <select
                      value={editingAirdrop.status}
                      onChange={(e) =>
                        setEditingAirdrop({
                          ...editingAirdrop,
                          status: e.target.value as 'active' | 'ended' | 'upcoming',
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      <option value="active">进行中</option>
                      <option value="upcoming">即将开始</option>
                      <option value="ended">已结束</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">链</label>
                    <select
                      value={editingAirdrop.chain || ''}
                      onChange={(e) => setEditingAirdrop({ ...editingAirdrop, chain: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      <option value="">无</option>
                      <option value="ethereum">Ethereum</option>
                      <option value="bsc">BNB Chain</option>
                      <option value="base">Base</option>
                      <option value="arbitrum">Arbitrum</option>
                      <option value="optimism">Optimism</option>
                      <option value="solana">Solana</option>
                      <option value="polygon">Polygon</option>
                      <option value="avalanche">Avalanche</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">奖励类型</label>
                    <select
                      value={editingAirdrop.rewardType || 'other'}
                      onChange={(e) =>
                        setEditingAirdrop({
                          ...editingAirdrop,
                          rewardType: e.target.value as 'token' | 'nft' | 'whitelist' | 'points' | 'other',
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      <option value="token">Token</option>
                      <option value="nft">NFT</option>
                      <option value="whitelist">白名单</option>
                      <option value="points">积分</option>
                      <option value="other">其他</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">奖励描述</label>
                    <input
                      type="text"
                      value={editingAirdrop.reward || ''}
                      onChange={(e) => setEditingAirdrop({ ...editingAirdrop, reward: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
                    <input
                      type="date"
                      value={editingAirdrop.deadline?.split('T')[0] || ''}
                      onChange={(e) => setEditingAirdrop({ ...editingAirdrop, deadline: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">参与人数</label>
                    <input
                      type="text"
                      value={editingAirdrop.participants || ''}
                      onChange={(e) => setEditingAirdrop({ ...editingAirdrop, participants: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsAirdropModalOpen(false);
                    setEditingAirdrop(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveAirdrop}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {categories.find((c) => c.id === editingCategory.id) ? '编辑分类' : '添加分类'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={editingCategory.slug}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">图标 (Emoji)</label>
                  <input
                    type="text"
                    value={editingCategory.icon || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <textarea
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Modal */}
      {isArticleModalOpen && editingArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {articles.find((a) => a.id === editingArticle.id) ? '编辑文章' : '发布文章'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">文章标题</label>
                  <input
                    type="text"
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL路径)</label>
                  <input
                    type="text"
                    value={editingArticle.slug}
                    onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
                  <textarea
                    value={editingArticle.excerpt}
                    onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">封面图片URL</label>
                  <input
                    type="text"
                    value={editingArticle.coverImage || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, coverImage: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    {articleCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标签 (逗号分隔)</label>
                  <input
                    type="text"
                    value={editingArticle.tags?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
                  <input
                    type="text"
                    value={editingArticle.author || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">正文内容</label>
                  <textarea
                    value={editingArticle.content}
                    onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                    rows={12}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingArticle.featured || false}
                      onChange={(e) => setEditingArticle({ ...editingArticle, featured: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">精选文章</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsArticleModalOpen(false);
                    setEditingArticle(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveArticle}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
