'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();

  // 滚动监听 - 首页section高亮
  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const sections = ['hero', 'airdrops', 'chains', 'cta'];

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;

          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    const throttledHandleScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // 初始化

    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [pathname]);

  // 关闭菜单当路由改变时
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // 阻止背景滚动当菜单打开时
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navItems = [
    { href: '/', label: '首页', sectionId: 'hero', icon: '🏠' },
    { href: '/tools', label: '工具导航', icon: '🔧' },
    { href: '/airdrops', label: '空投任务', icon: '🎁' },
    { href: '/academy', label: '知识库', icon: '📚' },
    { href: '/admin', label: '后台管理', icon: '⚙️' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <img
                src="/logo.png"
                alt="DAO³ Labs"
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-xl font-bold hidden sm:inline">
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
                  DAO³ Labs
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname === '/' && activeSection === item.sectionId);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 rounded-full animate-underline" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Search Bar - Hidden on mobile and tablet */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索"
                  className="w-48 px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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

            {/* Mobile Menu Button - 右上角汉堡菜单 */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="打开菜单"
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
        </div>
      </header>

      {/* 遮罩层 - 移动端菜单打开时显示 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* 移动端侧边导航抽屉 - 从右上角滑出 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="md:hidden fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* 头部 */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
                导航菜单
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="关闭菜单"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 导航菜单 */}
            <nav className="flex-1 overflow-y-auto py-6 px-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (pathname === '/' && activeSection === item.sectionId);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* 底部信息 */}
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center space-y-1">
                <p>© 2025 DAO³ Labs</p>
                <p className="text-gray-400">区块链创新实验室</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes underline {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .animate-underline {
          animation: underline 0.3s ease-out forwards;
          transform-origin: left;
        }
      `}</style>
    </>
  );
}
