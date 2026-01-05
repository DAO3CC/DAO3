'use client';

import { useState, useMemo } from 'react';
import { mockAirdrops, mockChains } from '@/data/mockData';
import AirdropCarousel from '@/components/ui/AirdropCarousel';
import Link from 'next/link';
import Image from 'next/image';

export default function AirdropsPage() {
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'ended'>('all');
  const [rewardTypeFilter, setRewardTypeFilter] = useState<'all' | 'token' | 'nft' | 'whitelist' | 'points' | 'other'>('all');

  // 根据链、状态和奖励类型过滤空投任务
  const filteredAirdrops = useMemo(() => {
    return mockAirdrops.filter((airdrop) => {
      const matchesChain = !selectedChain || airdrop.chain === selectedChain;
      const matchesStatus = statusFilter === 'all' || airdrop.status === statusFilter;
      const matchesRewardType = rewardTypeFilter === 'all' || airdrop.rewardType === rewardTypeFilter;
      return matchesChain && matchesStatus && matchesRewardType;
    });
  }, [selectedChain, statusFilter, rewardTypeFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">空投任务</h1>
        <p className="text-gray-600">参与空投活动，获取代币奖励</p>
      </div>

      {/* Airdrop Carousel */}
      <div className="mb-12">
        <AirdropCarousel airdrops={mockAirdrops} />
      </div>

      {/* Filters Section - QuestN 风格 */}
      <div className="mb-8 space-y-6">
        {/* Chain Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">按链筛选</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedChain(null)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 ${
                !selectedChain
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              全部链
            </button>
            {mockChains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => setSelectedChain(chain.id)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 flex items-center space-x-2 ${
                  selectedChain === chain.id
                    ? `bg-gradient-to-r ${chain.color} text-white shadow-md`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>{chain.icon}</span>
                <span>{chain.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">任务状态</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                statusFilter === 'active'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              进行中
            </button>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                statusFilter === 'upcoming'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              即将开始
            </button>
            <button
              onClick={() => setStatusFilter('ended')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                statusFilter === 'ended'
                  ? 'bg-gray-100 text-gray-700 border border-gray-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              已结束
            </button>
          </div>
        </div>

        {/* Reward Type Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">奖励类型</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setRewardTypeFilter('all')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                rewardTypeFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setRewardTypeFilter('token')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                rewardTypeFilter === 'token'
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              💰 Token
            </button>
            <button
              onClick={() => setRewardTypeFilter('nft')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                rewardTypeFilter === 'nft'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              🎨 NFT
            </button>
            <button
              onClick={() => setRewardTypeFilter('whitelist')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                rewardTypeFilter === 'whitelist'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              🎫 白名单
            </button>
            <button
              onClick={() => setRewardTypeFilter('points')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                rewardTypeFilter === 'points'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              ⭐ 积分
            </button>
            <button
              onClick={() => setRewardTypeFilter('other')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                rewardTypeFilter === 'other'
                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              🎁 其他
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          找到 <span className="font-semibold text-gray-900">{filteredAirdrops.length}</span> 个任务
        </p>
      </div>

      {/* Airdrops Grid */}
      {filteredAirdrops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAirdrops.map((airdrop) => {
            const chain = mockChains.find((c) => c.id === airdrop.chain);
            return (
              <Link
                key={airdrop.id}
                href={airdrop.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-400 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={airdrop.imageUrl}
                    alt={airdrop.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm ${
                        airdrop.status === 'active'
                          ? 'bg-green-500/90 text-white'
                          : airdrop.status === 'upcoming'
                          ? 'bg-blue-500/90 text-white'
                          : 'bg-gray-500/90 text-white'
                      }`}
                    >
                      {airdrop.status === 'active' ? '进行中' : airdrop.status === 'upcoming' ? '即将开始' : '已结束'}
                    </span>
                  </div>

                  {/* Chain Badge */}
                  {chain && (
                    <div className={`absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium text-white bg-gradient-to-r ${chain.color}`}>
                      {chain.icon} {chain.name}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {airdrop.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {airdrop.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center space-x-4">
                      {airdrop.rewardType && airdrop.reward && (
                        <div
                          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium ${
                            airdrop.rewardType === 'token'
                              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              : airdrop.rewardType === 'nft'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : airdrop.rewardType === 'whitelist'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : airdrop.rewardType === 'points'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-gray-50 text-gray-700 border border-gray-200'
                          }`}
                        >
                          <span className="text-base">
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
                          <span>{airdrop.reward}</span>
                        </div>
                      )}
                      {airdrop.participants && (
                        <div className="flex items-center space-x-1 text-gray-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{airdrop.participants}</span>
                        </div>
                      )}
                    </div>
                    {airdrop.deadline && (
                      <div className="text-gray-500">
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(airdrop.deadline).toLocaleDateString('zh-CN')}
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700 font-medium">
                      <span>立即参与</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到相关任务</h3>
          <p className="text-gray-600">请尝试选择其他筛选条件</p>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          参与提示
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• 仔细阅读项目官方公告，了解参与规则</li>
          <li>• 保护个人资产安全，谨慎授权合约</li>
          <li>• 关注项目截止时间，及时完成任务</li>
          <li>• 谨防诈骗，只通过官方渠道参与</li>
        </ul>
      </div>
    </div>
  );
}
