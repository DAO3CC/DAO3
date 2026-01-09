#!/usr/bin/env python3
"""
提取 PANews 工具导航数据并下载图标
"""

import os
import json
import requests
from pathlib import Path
from urllib.parse import urlparse

# 基础路径
BASE_DIR = Path("/Users/jim/Desktop/Claude Code/DAO3")
PUBLIC_DIR = BASE_DIR / "public"
ICONS_DIR = PUBLIC_DIR / "icons"

# 创建图标目录
ICONS_DIR.mkdir(exist_ok=True)

# PANews 数据（从 webReader 提取）
PANEWS_DATA = {
    "categories": [
        {
            "id": "hot",
            "name": "热门",
            "slug": "hot",
            "icon": "🔥",
            "order": 0,
        },
        {
            "id": "dat-dashboard",
            "name": "DAT数据看板",
            "slug": "dat-dashboard",
            "icon": "📊",
            "order": 1,
        },
        {
            "id": "ai-agent",
            "name": "AI Agent",
            "slug": "ai-agent",
            "icon": "🤖",
            "order": 2,
        },
        {
            "id": "meme",
            "name": "Meme常用工具",
            "slug": "meme",
            "icon": "🐸",
            "order": 3,
        },
        {
            "id": "blockchain-explorer",
            "name": "区块浏览器",
            "slug": "blockchain-explorer",
            "icon": "🔍",
            "order": 4,
        },
        {
            "id": "data",
            "name": "综合数据",
            "slug": "data",
            "icon": "📈",
            "order": 5,
        },
        {
            "id": "btc-ecosystem",
            "name": "BTC生态工具",
            "slug": "btc-ecosystem",
            "icon": "₿",
            "order": 6,
        },
        {
            "id": "cefi",
            "name": "CeFi",
            "slug": "cefi",
            "icon": "🏦",
            "order": 7,
        },
        {
            "id": "defi",
            "name": "DeFi",
            "slug": "defi",
            "icon": "💰",
            "order": 8,
        },
        {
            "id": "nft",
            "name": "NFT",
            "slug": "nft",
            "icon": "🎨",
            "order": 9,
        },
        {
            "id": "dao",
            "name": "DAO",
            "slug": "dao",
            "icon": "🏛️",
            "order": 10,
        },
        {
            "id": "dapp",
            "name": "DApp",
            "slug": "dapp",
            "icon": "🎮",
            "order": 11,
        },
        {
            "id": "airdrop",
            "name": "空投",
            "slug": "airdrop",
            "icon": "🎁",
            "order": 12,
        },
        {
            "id": "mining",
            "name": "矿业",
            "slug": "mining",
            "icon": "⛏️",
            "order": 13,
        },
        {
            "id": "wallet",
            "name": "钱包和授权管理",
            "slug": "wallet",
            "icon": "👛",
            "order": 14,
        },
        {
            "id": "other",
            "name": "其他",
            "slug": "other",
            "icon": "🔧",
            "order": 15,
        },
    ],
    "tools": [
        # 热门工具
        {"id": "1", "name": "推特KOL列表", "desc": "推荐关注的Twitter账号", "icon": "https://cdn-img.panewslab.com/panews/2022/11/03/images/x6w7EVx1B7.jpg", "category": "hot", "url": "https://x.com/DAO3CC/summary"},
        {"id": "2", "name": "GMGN.Ai", "desc": "MEME交易终端", "icon": "https://cdn-img.panewslab.com/panews/2024/12/31/images/88UOLYaJub.jpg", "category": "hot", "url": "https://gmgn.ai"},
        {"id": "3", "name": "Etherscan", "desc": "以太坊区块链浏览器", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/ayT98NBf91.png", "category": "hot", "url": "https://etherscan.io"},
        {"id": "4", "name": "MetaMask", "desc": "Web3钱包", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/E5X632ipfa.jpg", "category": "hot", "url": "https://metamask.io"},
        {"id": "5", "name": "DeFi LIama", "desc": "全链DeFi数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/3Pdl99fm2l.jpg", "category": "hot", "url": "https://defillama.com"},
        {"id": "6", "name": "CoinMarketCap", "desc": "行情数据网站", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/6Jhr4Tj8Wf.jpg", "category": "hot", "url": "https://coinmarketcap.com"},
        {"id": "7", "name": "Dune", "desc": "综合链上数据分析", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/8y6TB3Zj0X.png", "category": "hot", "url": "https://dune.com"},
        {"id": "8", "name": "Debank", "desc": "加密投资组合追踪", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/n8I70y0IoQ.jpg", "category": "hot", "url": "https://debank.com"},

        # AI Agent 工具（示例）
        {"id": "9", "name": "AI16Z", "desc": "去中心化AI交易基金", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/W6ZeKgQRdk.jpg", "category": "ai-agent", "url": "https://ai16z.com"},
        {"id": "10", "name": "Virtuals Protocol", "desc": "AI Agent资产发行平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/EzYy3Vhbhr.jpg", "category": "ai-agent", "url": "https://virtuals.io"},
        {"id": "11", "name": "Clanker", "desc": "AI驱动的Token Bot", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/yYLzdTNdRV.jpg", "category": "ai-agent", "url": "https://clanker.ai"},

        # Meme 工具（示例）
        {"id": "12", "name": "pump.fun", "desc": "Solana上Meme发布平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/7R3Rm09MW0.jpg", "category": "meme", "url": "https://pump.fun"},
        {"id": "13", "name": "DEX Screener", "desc": "Altcoin数据平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/md3f4v1ay5.jpg", "category": "meme", "url": "https://dexscreener.com"},
        {"id": "14", "name": "Phantom", "desc": "Sol链常用钱包", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/gTh6JY9xPk.jpg", "category": "meme", "url": "https://phantom.app"},

        # DeFi 工具（示例）
        {"id": "15", "name": "Uniswap", "desc": "以太坊DEX", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/9N82sWJ950.png", "category": "defi", "url": "https://uniswap.org"},
        {"id": "16", "name": "Aave", "desc": "借贷协议", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/9N82sWJ950.png", "category": "defi", "url": "https://aave.com"},

        # 更多工具可以继续添加...
    ]
}

def download_icon(url: str, tool_id: str) -> str:
    """下载图标并返回本地路径"""
    try:
        # 从URL提取文件扩展名
        parsed = urlparse(url)
        ext = os.path.splitext(parsed.path)[1] or ".png"

        # 本地文件名
        filename = f"tool-{tool_id}{ext}"
        local_path = ICONS_DIR / filename

        # 下载图片
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        # 保存到本地
        with open(local_path, 'wb') as f:
            f.write(response.content)

        return f"/icons/{filename}"
    except Exception as e:
        print(f"❌ 下载图标失败 {tool_id}: {e}")
        return "/logo.png"  # 失败时使用默认logo

def main():
    print("🚀 开始处理 PANews 数据...")

    # 下載图标
    print(f"\n📥 下载图标到 {ICONS_DIR}...")
    for tool in PANEWS_DATA["tools"]:
        tool["icon"] = download_icon(tool["icon"], tool["id"])
        print(f"  ✅ {tool['name']}")

    # 保存 JSON 数据
    output_file = BASE_DIR / "panews_data.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(PANEWS_DATA, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 数据已保存到 {output_file}")
    print(f"📊 总计 {len(PANEWS_DATA['categories'])} 个分类")
    print(f"🔧 总计 {len(PANEWS_DATA['tools'])} 个工具")

if __name__ == "__main__":
    main()
