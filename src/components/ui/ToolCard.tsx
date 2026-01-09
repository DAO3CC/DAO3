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
    <div className="group relative bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-300 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 h-full">
      {/* Hot Badge */}
      {tool.hot && (
        <div className="absolute -top-1 -left-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium z-10 shadow-sm">
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
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/90 hover:bg-white shadow-sm hover:shadow-md transition-all backdrop-blur-sm group/btn"
          aria-label={isFavorite ? '取消收藏' : '收藏'}
        >
          <svg
            className={`w-4 h-4 transition-all ${isFavorite ? 'text-red-500 scale-110' : 'text-gray-400 group-hover/btn:text-red-400 group-hover/btn:scale-110'}`}
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
        <div className="flex items-start space-x-2.5">
          {/* Tool Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
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
              <div className="w-full h-full flex items-center justify-center text-lg">
                🔧
              </div>
            )}
          </div>

          {/* Tool Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-0.5 line-clamp-1">
              {tool.name}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2">{tool.description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
