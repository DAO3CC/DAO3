'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Airdrop } from '@/types';

interface AirdropCarouselProps {
  airdrops: Airdrop[];
}

export default function AirdropCarousel({ airdrops }: AirdropCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused && airdrops.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % airdrops.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, airdrops.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + airdrops.length) % airdrops.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % airdrops.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (airdrops.length === 0) {
    return null;
  }

  const currentAirdrop = airdrops[currentIndex];

  return (
    <div
      className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide */}
      <Link
        href={currentAirdrop.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full"
      >
        <div className="relative w-full h-full">
          <Image
            src={currentAirdrop.imageUrl}
            alt={currentAirdrop.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center space-x-2 mb-2">
              <span
                className={`text-xs px-2 py-1 rounded-md font-medium ${
                  currentAirdrop.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : currentAirdrop.status === 'upcoming'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {currentAirdrop.status === 'active'
                  ? '进行中'
                  : currentAirdrop.status === 'upcoming'
                  ? '即将开始'
                  : '已结束'}
              </span>
              {currentAirdrop.deadline && (
                <span className="text-xs text-gray-300">
                  截止: {new Date(currentAirdrop.deadline).toLocaleDateString('zh-CN')}
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {currentAirdrop.title}
            </h2>
            <p className="text-sm text-gray-300 line-clamp-2 mb-4">
              {currentAirdrop.description}
            </p>
            <div className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
              <span className="text-sm font-medium">立即参与</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>

      {/* Navigation Arrows */}
      {airdrops.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            aria-label="上一张"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            aria-label="下一张"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {airdrops.length > 1 && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {airdrops.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-blue-500 w-6' : 'bg-white/50'
              }`}
              aria-label={`前往第 ${index + 1} 张`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
