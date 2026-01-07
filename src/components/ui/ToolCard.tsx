'use client';

import { Tool } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ToolCardProps {
  tool: Tool;
  onToggleFavorite?: (toolId: string) => void;
  isFavorite?: boolean;
}

export default function ToolCard({ tool, onToggleFavorite, isFavorite = false }: ToolCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 h-full">
      {/* Hot Badge */}
      {tool.hot && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium z-10 shadow-sm">
          HOT
        </div>
      )}

      {/* Favorite Button */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(tool.id);
          }}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/80 hover:bg-white shadow-sm hover:shadow transition-colors backdrop-blur"
          aria-label={isFavorite ? '取消收藏' : '收藏'}
        >
          <svg
            className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      )}

      {/* Tool Link */}
      <Link href={tool.url} target="_blank" rel="noopener noreferrer" className="block h-full">
        <div className="flex items-start space-x-3 sm:space-x-4">
          {/* Tool Icon */}
          <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            {!imageError ? (
              <Image
                src={tool.icon}
                alt={tool.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl">
                🔧
              </div>
            )}
          </div>

          {/* Tool Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-1">
              {tool.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{tool.description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
