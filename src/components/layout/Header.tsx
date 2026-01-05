'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                DAO³
              </span>
              <span className="text-gray-700">Labs</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm text-gray-900 font-medium hover:text-blue-600 transition-colors">
              首页
            </Link>
            <Link href="/tools" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              工具导航
            </Link>
            <Link href="/airdrops" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              空投任务
            </Link>
            <Link href="/academy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              知识库
            </Link>
            <Link href="/admin" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              后台管理
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索工具..."
                className="w-64 px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-sm text-gray-900 font-medium hover:text-blue-600 transition-colors">
                首页
              </Link>
              <Link href="/tools" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                工具导航
              </Link>
              <Link href="/airdrops" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                空投任务
              </Link>
              <Link href="/academy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                知识库
              </Link>
              <Link href="/admin" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                后台管理
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
