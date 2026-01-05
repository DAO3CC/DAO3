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
    { href: '/favorites', label: '我的收藏', icon: '⭐' },
    { href: '/admin', label: '后台管理', icon: '⚙️' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          {!isCollapsed && (
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-gray-900">DAO3</div>
              <span className="text-sm text-gray-500">导航</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors ml-auto"
            title={isCollapsed ? '展开菜单' : '收起菜单'}
          >
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              © 2025 DAO3 导航
            </div>
          </div>
        )}
      </aside>

      {/* Desktop Spacer */}
      <div className="hidden lg:block" style={{ width: isCollapsed ? '5rem' : '16rem' }} />

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-xl font-bold text-gray-900">DAO3</div>
            <span className="text-xs text-gray-500">导航</span>
          </Link>

          {/* Mobile Navigation */}
          <nav className="flex items-center space-x-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={item.label}
                >
                  {item.icon}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}
