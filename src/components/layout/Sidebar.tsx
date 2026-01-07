'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { href: '/', label: '首页', icon: '🏠' },
    { href: '/tools', label: '工具导航', icon: '🔧' },
    { href: '/airdrops', label: '空投任务', icon: '🎁' },
    { href: '/academy', label: '知识库', icon: '📚' },
    { href: '/favorites', label: '我的收藏', icon: '⭐' },
    { href: '/admin', label: '后台管理', icon: '⚙️' },
  ];

  return (
    <>
      {/* Desktop Sidebar - Only visible on lg screens and above */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-200 w-72 z-50">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="DAO³ Labs"
              className="h-8 w-auto"
            />
            {!isCollapsed && (
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
                DAO³ Labs
              </span>
            )}
          </Link>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-all"
          aria-label="切换侧边栏"
        >
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            © 2025 DAO³ Labs
          </div>
        </div>
      </aside>

      {/* Desktop Spacer - Only on lg screens and above */}
      <div className="hidden lg:block w-72 flex-shrink-0" />
    </>
  );
}
