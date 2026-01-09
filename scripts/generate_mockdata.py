#!/usr/bin/env python3
"""
生成完整的 mockData.ts 文件，使用本地图标
"""

import json
from pathlib import Path

# 读取所有工具数据
with open('panews_all_tools.json', 'r') as f:
    all_tools = json.load(f)

# 分类映射
CATEGORY_MAP = {
    'hot': '1',
    'dat-dashboard': '6',
    'ai-agent': '2',
    'meme': '3',
    'blockchain-explorer': '4',
    'data': '5',
    'cefi': '7',
    'defi': '8',
    'nft': '9',
    'dao': '10',
    'dapp': '11',
    'airdrop': '12',
    'mining': '13',
    'wallet': '14',
    'btc-ecosystem': '15',
    'other': '16',
}

# 链映射
CHAIN_MAP = {
    'ethereum': 'ethereum',
    'bsc': 'bsc',
    'base': 'base',
    'arbitrum': 'arbitrum',
    'optimism': 'optimism',
    'solana': 'solana',
    'polygon': 'polygon',
    'avalanche': 'avalanche',
    'sui': 'solana',
    'bnb': 'bsc',
}

# 生成 mockData.ts
output = """import { Category, Tool, Airdrop } from '@/types';

// QuestN 风格的区块链分类（使用本地链 logo）
export const mockChains = [
  { id: 'ethereum', name: 'Ethereum', icon: '⟠', color: 'from-blue-600 to-indigo-600', logo: '/icons/chains/ethereum.png' },
  { id: 'bsc', name: 'BNB Chain', icon: '⬡', color: 'from-yellow-500 to-orange-600', logo: '/icons/chains/bsc.png' },
  { id: 'base', name: 'Base', icon: '🔵', color: 'from-blue-500 to-cyan-500', logo: '/icons/chains/base.png' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🔷', color: 'from-blue-500 to-blue-700', logo: '/icons/chains/arbitrum.png' },
  { id: 'optimism', name: 'Optimism', icon: '🔴', color: 'from-red-500 to-pink-600', logo: '/icons/chains/optimism.png' },
  { id: 'solana', name: 'Solana', icon: '◎', color: 'from-purple-500 to-violet-600', logo: '/icons/chains/solana.png' },
  { id: 'polygon', name: 'Polygon', icon: '⬡', color: 'from-purple-600 to-indigo-600', logo: '/icons/chains/polygon.png' },
  { id: 'avalanche', name: 'Avalanche', icon: '🔺', color: 'from-red-600 to-orange-600', logo: '/icons/chains/avalanche.png' },
];

// 完整的工具分类（参考 PANews）
export const mockCategories: Category[] = [
  { id: '1', name: '热门', slug: 'hot', order: 0 },
  { id: '2', name: 'AI Agent', slug: 'ai-agent', order: 1 },
  { id: '3', name: 'Meme工具', slug: 'meme', order: 2 },
  { id: '4', name: '区块浏览器', slug: 'explorer', order: 3 },
  { id: '5', name: '综合数据', slug: 'data', order: 4 },
  { id: '6', name: 'DAT数据看板', slug: 'dat', order: 5 },
  { id: '7', name: 'CeFi', slug: 'cefi', order: 6 },
  { id: '8', name: 'DeFi', slug: 'defi', order: 7 },
  { id: '9', name: 'NFT', slug: 'nft', order: 8 },
  { id: '10', name: 'DAO', slug: 'dao', order: 9 },
  { id: '11', name: 'DApp', slug: 'dapp', order: 10 },
  { id: '12', name: '空投', slug: 'airdrop', order: 11 },
  { id: '13', name: '矿业', slug: 'mining', order: 12 },
  { id: '14', name: '钱包工具', slug: 'wallet', order: 13 },
  { id: '15', name: 'BTC生态', slug: 'btc', order: 14 },
  { id: '16', name: '其他', slug: 'other', order: 15 },
];

// 从 PANews 导入的所有工具（使用本地图标）
export const mockTools: Tool[] = [
"""

# 按分类生成工具列表
for i, tool in enumerate(all_tools):
    category_id = CATEGORY_MAP.get(tool['category'], '16')
    chain = CHAIN_MAP.get(tool.get('chain', ''), None) if tool.get('chain') else None

    # 从URL推断链
    if 'solana' in tool['url'].lower() or 'pump' in tool['url'].lower():
        chain = 'solana'
    elif 'ethereum' in tool['url'].lower() or 'etherscan' in tool['url'].lower():
        chain = 'ethereum'
    elif 'bsc' in tool['url'].lower():
        chain = 'bsc'
    elif 'base' in tool['url'].lower():
        chain = 'base'
    elif 'arbitrum' in tool['url'].lower():
        chain = 'arbitrum'
    elif 'optimism' in tool['url'].lower():
        chain = 'optimism'

    tool_entry = f"""  {{
    id: '{tool['id']}',
    name: '{tool['name']}',
    description: '{tool['desc']}',
    icon: '{tool['icon']}',
    url: '{tool['url']}',
    category: '{category_id}',
    tags: ['Web3', 'Tools'],
    hot: {str(i < 30).lower()},  # 前30个标记为热门
    featured: {str(i < 15).lower()},  # 前15个标记为精选
    order: {i},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }},"""

    output += tool_entry + "\n"

output += """];

// QuestN 风格的空投任务（保持不变）
export const mockAirdrops: Airdrop[] = [
"""

# 读取原始空投数据
original_mockdata = Path("src/data/mockData.ts").read_text()

# 提取空投部分
import re
airdrop_match = re.search(r'export const mockAirdrops.*?\];', original_mockdata, re.DOTALL)
if airdrop_match:
    output += airdrop_match.group(0) + "\n"
else:
    # 默认空投数据
    output += """  // Ethereum
  {
    id: '1',
    title: 'EigenLayer 再质押活动',
    description: '在EigenLayer上进行再质押，获取早期积分奖励',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    link: 'https://www.eigenlayer.xyz',
    status: 'active',
    deadline: '2025-03-31',
    chain: 'ethereum',
    rewardType: 'points',
    reward: '积分',
    participants: '150K+',
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
"""

# 保存到文件
output_file = Path("src/data/mockData.ts")
output_file.write_text(output)

print(f"✅ mockData.ts 生成成功！")
print(f"📁 保存位置: {output_file}")
print(f"🔧 总计 {len(all_tools)} 个工具")
print(f"\n📝 工具分类统计:")
category_count = {}
for tool in all_tools:
    cat = tool['category']
    category_count[cat] = category_count.get(cat, 0) + 1

for cat, count in sorted(category_count.items(), key=lambda x: x[1], reverse=True):
    print(f"   {cat}: {count} 个工具")
