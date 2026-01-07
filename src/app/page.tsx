'use client';

import Link from 'next/link';
import { mockAirdrops, mockChains } from '@/data/mockData';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  // 根据选择的链过滤空投任务
  const filteredAirdrops = selectedChain
    ? mockAirdrops.filter((a) => a.chain === selectedChain)
    : mockAirdrops;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-slide-in {
          animation: slideIn 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .shimmer {
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,255,255,0.4) 50%,
            transparent 100%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        .card-3d {
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          transform-style: preserve-3d;
        }

        .card-3d:hover {
          transform: translateY(-10px) rotateX(5deg) rotateY(-5deg);
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }
      `}</style>

      {/* Hero Section - 重新设计更大气的版本 */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* 动态网格背景 */}
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, #000 70%, transparent 100%)',
          }}
        ></div>

        {/* 粒子光晕效果 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float stagger-2"></div>

        {/* 主内容 */}
        <div className="relative z-10 container mx-auto px-4 text-center py-20">
          {/* Logo部分 - 更大 */}
          <div className="mb-12">
            <h1 className="text-8xl md:text-10xl lg:text-[12rem] font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent gradient-animate">
                DAO³
              </span>
            </h1>
            <div className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-800 tracking-[0.2em]">
              Labs
            </div>
          </div>

          {/* 副标题 - 更大 */}
          <p className="text-3xl md:text-4xl lg:text-5xl text-gray-700 mb-8 tracking-wide font-semibold">
            区块链创新实验室
          </p>

          {/* 介绍文字 - 更大更突出 */}
          <p className="text-2xl md:text-3xl text-gray-600 mb-16 max-w-5xl mx-auto leading-relaxed font-medium">
            探索去中心化技术的未来，汇聚 Web3 工具、空投机会与前沿知识
            <br />
            让创新触手可及，让去中心化惠及每个人
          </p>

          {/* CTA 按钮 - 更大更突出 */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link
              href="/tools"
              className="group relative px-16 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-300/50"
              style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
            >
              <div className="absolute inset-0 shimmer"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative flex items-center">
                探索工具
                <svg className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

            <Link
              href="/airdrops"
              className="group relative px-16 py-6 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:border-blue-400 hover:bg-blue-50 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <span className="relative flex items-center">
                空投任务
                <svg className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </span>
            </Link>
          </div>

          {/* 滚动提示 */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* 装饰性元素 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* 特性卡片 - 3D悬停效果 */}
      <section
        id="features"
        data-animate
        className="py-40 px-4 relative bg-white transition-all duration-1000"
        style={{
          opacity: visibleSections.has('features') ? 1 : 0,
          transform: visibleSections.has('features') ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-28">
            <h2 className="text-6xl md:text-7xl font-bold mb-8 text-gray-900">
              核心服务
            </h2>
            <p className="text-gray-600 text-2xl font-light">打造一站式 Web3 服务平台</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                icon: '🔧',
                title: '工具导航',
                description: '精选 100+ Web3 工具，覆盖 AI、DeFi、NFT 等多个领域',
                color: 'from-blue-600 to-cyan-600',
                link: '/tools',
              },
              {
                icon: '🎁',
                title: '空投任务',
                description: '实时追踪全网空投机会，支持多链筛选，不错过任何福利',
                color: 'from-purple-600 to-pink-600',
                link: '/airdrops',
              },
              {
                icon: '📚',
                title: '知识库',
                description: '深度解析区块链技术，从入门到精通的系统化学习路径',
                color: 'from-green-600 to-emerald-600',
                link: '/academy',
              },
            ].map((feature, index) => (
              <Link
                key={index}
                href={feature.link}
                className={`group relative bg-white border-2 border-gray-100 rounded-3xl p-12 card-3d hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 overflow-hidden transition-all duration-500`}
                style={{
                  opacity: visibleSections.has('features') ? 1 : 0,
                  animation: visibleSections.has('features') ? `slideUp 0.6s ease-out ${index * 0.15}s forwards` : 'none',
                }}
              >
                {/* 悬停时背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                {/* 图标动画 */}
                <div className="relative">
                  <div className={`inline-block p-6 bg-gradient-to-br ${feature.color} rounded-3xl mb-8 text-6xl shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-3xl font-bold mb-6 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">{feature.description}</p>
                  <div className={`flex items-center bg-gradient-to-r ${feature.color} bg-clip-text text-transparent font-semibold text-lg group-hover:translate-x-2 transition-transform duration-300`}>
                    了解更多
                    <svg className="w-6 h-6 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 数据统计 - 数字滚动动画 */}
      <section
        id="stats"
        data-animate
        className="py-40 px-4 relative overflow-hidden bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 transition-all duration-1000"
        style={{
          opacity: visibleSections.has('stats') ? 1 : 0,
          transform: visibleSections.has('stats') ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
            {[
              { value: '226+', label: '精选工具', color: 'from-blue-600 to-cyan-600' },
              { value: '7+', label: '空投任务', color: 'from-purple-600 to-pink-600' },
              { value: '16+', label: '热门分类', color: 'from-green-600 to-emerald-600' },
              { value: '8+', label: '支持公链', color: 'from-orange-600 to-red-600' },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group cursor-default"
                style={{
                  animation: visibleSections.has('stats') ? `scaleIn 0.6s ease-out ${index * 0.1}s forwards` : 'none',
                }}
              >
                <div className={`text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-110 gradient-animate`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 text-base uppercase tracking-wider font-medium group-hover:text-gray-900 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 热门空投 - 高级卡片 */}
      <section
        id="airdrops"
        data-animate
        className="py-40 px-4 relative bg-white transition-all duration-1000"
        style={{
          opacity: visibleSections.has('airdrops') ? 1 : 0,
          transform: visibleSections.has('airdrops') ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-20">
            <div>
              <h2 className="text-6xl md:text-7xl font-bold mb-6 text-gray-900">
                热门空投
              </h2>
              <p className="text-gray-600 text-2xl font-light">发现最新的区块链空投机会</p>
            </div>
            <Link
              href="/airdrops"
              className="hidden md:flex items-center px-10 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 font-medium text-gray-700 hover:shadow-lg group whitespace-nowrap"
            >
              <span className="flex items-center text-lg">
                查看全部
                <svg className="w-6 h-6 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredAirdrops.slice(0, 6).map((airdrop, index) => {
              const chain = mockChains.find((c) => c.id === airdrop.chain);
              return (
                <a
                  key={airdrop.id}
                  href={airdrop.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white border-2 border-gray-100 rounded-2xl overflow-hidden card-3d hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500"
                  style={{
                    animation: visibleSections.has('airdrops') ? `scaleIn 0.6s ease-out ${index * 0.1}s forwards` : 'none',
                  }}
                >
                  {/* 图片 */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={airdrop.imageUrl}
                      alt={airdrop.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent"></div>

                    {/* 状态标签 - 发光动画 */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm shadow-lg transition-all duration-300 ${
                          airdrop.status === 'active'
                            ? 'bg-green-500/95 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                            : airdrop.status === 'upcoming'
                            ? 'bg-blue-500/95 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                            : 'bg-gray-500/95 text-white'
                        }`}
                      >
                        {airdrop.status === 'active' ? '● 进行中' : airdrop.status === 'upcoming' ? '● 即将开始' : '● 已结束'}
                      </span>
                    </div>

                    {/* 链标签 */}
                    {chain && (
                      <div className={`absolute top-4 right-4 text-xs px-3 py-1.5 rounded-full font-medium text-white bg-gradient-to-r ${chain.color} shadow-lg transition-transform duration-300 group-hover:scale-110 flex items-center space-x-2`}>
                        <img src={chain.logo} alt={chain.name} className="w-4 h-4 object-contain" />
                        <span>{chain.name}</span>
                      </div>
                    )}
                  </div>

                  {/* 内容 */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                      {airdrop.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                      {airdrop.description}
                    </p>

                    {/* 元信息 */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        {airdrop.rewardType && airdrop.reward && (
                          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all duration-300">
                            <span className="transition-transform duration-300 group-hover:scale-125">
                              {airdrop.rewardType === 'token'
                                ? '💰'
                                : airdrop.rewardType === 'nft'
                                ? '🎨'
                                : airdrop.rewardType === 'whitelist'
                                ? '🎫'
                                : airdrop.rewardType === 'points'
                                ? '⭐'
                                : '🎁'}
                            </span>
                            <span className="text-gray-700 font-medium">{airdrop.reward}</span>
                          </div>
                        )}
                        {airdrop.participants && (
                          <div className="flex items-center space-x-1 text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{airdrop.participants}</span>
                          </div>
                        )}
                      </div>
                      {airdrop.deadline && (
                        <div className="text-gray-400 text-xs group-hover:text-gray-600 transition-colors duration-300">
                          {new Date(airdrop.deadline).toLocaleDateString('zh-CN')}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* 多链支持 - 弹性按钮 */}
      <section
        id="chains"
        data-animate
        className="py-40 px-4 relative overflow-hidden bg-gray-50 transition-all duration-1000"
        style={{
          opacity: visibleSections.has('chains') ? 1 : 0,
          transform: visibleSections.has('chains') ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="text-center mb-28">
            <h2 className="text-6xl md:text-7xl font-bold mb-8 text-gray-900">
              多链生态
            </h2>
            <p className="text-gray-600 text-2xl font-light">支持主流区块链，一键切换</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {mockChains.map((chain, index) => (
              <button
                key={chain.id}
                onClick={() => setSelectedChain(chain.id)}
                className={`group px-10 py-6 rounded-2xl font-medium transition-all duration-500 transform hover:scale-110 flex items-center space-x-4 border-2 ${
                  selectedChain === chain.id
                    ? `bg-gradient-to-r ${chain.color} text-white border-transparent shadow-2xl`
                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-xl'
                }`}
                style={{
                  animation: visibleSections.has('chains') ? `scaleIn 0.6s ease-out ${index * 0.08}s forwards` : 'none',
                }}
              >
                <img src={chain.logo} alt={chain.name} className="w-12 h-12 object-contain transition-transform duration-300 group-hover:rotate-12" />
                <span className="text-2xl">{chain.name}</span>
              </button>
            ))}
            <button
              onClick={() => setSelectedChain(null)}
              className={`px-10 py-6 rounded-2xl font-medium transition-all duration-500 transform hover:scale-110 border-2 ${
                !selectedChain
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-2xl'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-xl'
              }`}
            >
              <span className="text-2xl">全部链</span>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section - 渐进动画 */}
      <section
        id="cta"
        data-animate
        className="py-48 px-4 relative overflow-hidden bg-white transition-all duration-1000"
        style={{
          opacity: visibleSections.has('cta') ? 1 : 0,
          transform: visibleSections.has('cta') ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-cyan-100/50"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        <div className="container mx-auto relative z-10 text-center max-w-5xl">
          <h2 className="text-6xl md:text-7xl font-bold mb-8 text-gray-900">
            开启去中心化之旅
          </h2>
          <p className="text-2xl text-gray-600 mb-16 font-light">
            加入 DAO³ Labs，与我们一起探索 Web3 的无限可能
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link
              href="/tools"
              className="px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-300/50 overflow-hidden relative group"
            >
              <div className="absolute inset-0 shimmer"></div>
              <span className="relative">立即开始</span>
            </Link>
            <Link
              href="/academy"
              className="px-12 py-6 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold text-xl transition-all duration-500 hover:border-blue-400 hover:bg-blue-50 hover:scale-105 hover:shadow-xl"
            >
              了解更多
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-10">
            <h3 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent gradient-animate">
                DAO³ Labs
              </span>
            </h3>
            <p className="text-gray-600 text-lg font-light">区块链创新实验室</p>
          </div>
          <p className="text-gray-500 text-base">
            © 2025 DAO³ Labs. 致力于推动去中心化技术发展
          </p>
        </div>
      </footer>
    </div>
  );
}
