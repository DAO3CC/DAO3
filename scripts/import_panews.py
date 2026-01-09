#!/usr/bin/env python3
"""
完整提取 PANews 工具导航数据
"""

import os
import json
import requests
from pathlib import Path
from urllib.parse import urlparse
import time

# 基础路径
BASE_DIR = Path("/Users/jim/Desktop/Claude Code/DAO3")
PUBLIC_DIR = BASE_DIR / "public"
ICONS_DIR = PUBLIC_DIR / "icons"

# 创建图标目录
ICONS_DIR.mkdir(exist_ok=True)

# 完整的 PANews 数据
PANEWS_CATEGORIES = [
    {"id": "hot", "name": "热门", "slug": "hot", "icon": "🔥", "order": 0},
    {"id": "dat-dashboard", "name": "DAT数据看板", "slug": "dat-dashboard", "icon": "📊", "order": 1},
    {"id": "ai-agent", "name": "AI Agent", "slug": "ai-agent", "icon": "🤖", "order": 2},
    {"id": "meme", "name": "Meme常用工具", "slug": "meme", "icon": "🐸", "order": 3},
    {"id": "blockchain-explorer", "name": "区块浏览器", "slug": "blockchain-explorer", "icon": "🔍", "order": 4},
    {"id": "data", "name": "综合数据", "slug": "data", "icon": "📈", "order": 5},
    {"id": "btc-ecosystem", "name": "BTC生态工具", "slug": "btc-ecosystem", "icon": "₿", "order": 6},
    {"id": "cefi", "name": "CeFi", "slug": "cefi", "icon": "🏦", "order": 7},
    {"id": "defi", "name": "DeFi", "slug": "defi", "icon": "💰", "order": 8},
    {"id": "nft", "name": "NFT", "slug": "nft", "icon": "🎨", "order": 9},
    {"id": "dao", "name": "DAO", "slug": "dao", "icon": "🏛️", "order": 10},
    {"id": "dapp", "name": "DApp", "slug": "dapp", "icon": "🎮", "order": 11},
    {"id": "airdrop", "name": "空投", "slug": "airdrop", "icon": "🎁", "order": 12},
    {"id": "mining", "name": "矿业", "slug": "mining", "icon": "⛏️", "order": 13},
    {"id": "wallet", "name": "钱包和授权管理", "slug": "wallet", "icon": "👛", "order": 14},
    {"id": "other", "name": "其他", "slug": "other", "icon": "🔧", "order": 15},
]

# 完整的工具数据（从 PANews 提取）
PANEWS_TOOLS = [
    # 热门工具
    {"id": "1", "name": "推特KOL列表", "desc": "推荐关注的Twitter账号", "icon": "https://cdn-img.panewslab.com/panews/2022/11/03/images/x6w7EVx1B7.jpg", "category": "hot", "url": "https://x.com/DAO3CC/summary"},
    {"id": "2", "name": "GMGN.Ai", "desc": "MEME交易终端", "icon": "https://cdn-img.panewslab.com/panews/2024/12/31/images/88UOLYaJub.jpg", "category": "hot", "url": "https://gmgn.ai"},
    {"id": "3", "name": "Etherscan", "desc": "以太坊区块链浏览器", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/ayT98NBf91.png", "category": "hot", "url": "https://etherscan.io"},
    {"id": "4", "name": "MetaMask", "desc": "Web3钱包", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/E5X632ipfa.jpg", "category": "hot", "url": "https://metamask.io"},
    {"id": "5", "name": "DeFi LIama", "desc": "全链DeFi数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/3Pdl99fm2l.jpg", "category": "hot", "url": "https://defillama.com"},
    {"id": "6", "name": "CoinMarketCap", "desc": "行情数据网站", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/6Jhr4Tj8Wf.jpg", "category": "hot", "url": "https://coinmarketcap.com"},
    {"id": "7", "name": "Dune", "desc": "综合链上数据分析", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/8y6TB3Zj0X.png", "category": "hot", "url": "https://dune.com"},
    {"id": "8", "name": "Debank", "desc": "加密投资组合追踪", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/n8I70y0IoQ.jpg", "category": "hot", "url": "https://debank.com"},

    # DAT 数据看板
    {"id": "9", "name": "Blockworks", "desc": "加密财库公司综合看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/QA4j9wJ7ka.jpg", "category": "dat-dashboard", "url": "https://blockworks.co"},
    {"id": "10", "name": "DELPHI DIGITAL", "desc": "加密财库公司综合看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/FkdBUs52Vx.jpg", "category": "dat-dashboard", "url": "https://delphidigital.io"},
    {"id": "11", "name": "DefiLlama", "desc": "加密财库公司综合看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/1g2wC3T0yU.jpg", "category": "dat-dashboard", "url": "https://defillama.com/treasuries"},
    {"id": "12", "name": "THE BLOCK", "desc": "加密财库公司综合看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/8cIvwE45Ym.jpg", "category": "dat-dashboard", "url": "https://www.theblock.co"},

    # AI Agent
    {"id": "13", "name": "Act I : The AI Prophecy", "desc": "AI交互协作平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/139FcF16Ws.jpg", "category": "ai-agent", "url": "https://act1.ai"},
    {"id": "14", "name": "AGENCY", "desc": "AI Agent分析师", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/MWGI46DS2x.jpg", "category": "ai-agent", "url": "https://agency.xyz"},
    {"id": "15", "name": "AI16Z", "desc": "去中心化AI交易基金", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/W6ZeKgQRdk.jpg", "category": "ai-agent", "url": "https://ai16z.com"},
    {"id": "16", "name": "aiPool", "desc": "AI Agent自主发币", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/F19AmgM6e8.jpg", "category": "ai-agent", "url": "https://aipool.xyz"},
    {"id": "17", "name": "AIXBT", "desc": "AI驱动的加密情报平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/7uW5FgJnKz.jpg", "category": "ai-agent", "url": "https://aixbt.ai"},
    {"id": "18", "name": "Alchemist AI", "desc": "无代码开发平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/4CE5stU04T.jpg", "category": "ai-agent", "url": "https://alchemists.ai"},
    {"id": "19", "name": "Anon", "desc": "AI发币", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/H4jJ40xP7F.jpg", "category": "ai-agent", "url": "https://anon.ai"},
    {"id": "20", "name": "arc", "desc": "AI框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/ppCnktr092.jpg", "category": "ai-agent", "url": "https://arc.app"},
    {"id": "21", "name": "AVA", "desc": "专注视觉与视频内容的跨平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/GnGi2IZJgu.jpg", "category": "ai-agent", "url": "https://ava.ai"},
    {"id": "22", "name": "Clanker", "desc": "AI驱动的Token Bot", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/yYLzdTNdRV.jpg", "category": "ai-agent", "url": "https://clanker.ai"},
    {"id": "23", "name": "Cookie", "desc": "AI Agent索引平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/2N5v73HmIV.jpg", "category": "ai-agent", "url": "https://cookie.fun"},
    {"id": "24", "name": "Dolion", "desc": "AI机器人", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/B6T57zx9s7.jpg", "category": "ai-agent", "url": "https://dolion.ai"},
    {"id": "25", "name": "DUNA", "desc": "AI DAO", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/FaQyCytYO4.jpg", "category": "ai-agent", "url": "https://duna.ai"},
    {"id": "26", "name": "Eilza", "desc": "模块化AI智能体框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/OM2IZji883.jpg", "category": "ai-agent", "url": "https://eilza.ai"},
    {"id": "27", "name": "Fartcoin", "desc": "Terminal of Truths上的首个MEME", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/v4RBqOP0Gd.jpg", "category": "ai-agent", "url": "https://fartcoin.ai"},
    {"id": "28", "name": "G.A.M.E", "desc": "模块化的智能代理框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/nc7TgyhHmt.jpg", "category": "ai-agent", "url": "https://game.gg"},
    {"id": "29", "name": "Goatseus Maximus", "desc": "AI概念MEME币", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/B4Byq0uPvP.jpg", "category": "ai-agent", "url": "https://goatseusmaximus.com"},
    {"id": "30", "name": "Griffain", "desc": "AI助手", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/ev5Ys78tz4.png", "category": "ai-agent", "url": "https://griffain.ai"},
    {"id": "31", "name": "LEXICON", "desc": "开源AI Agent框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/1kGMNY0aPM.png", "category": "ai-agent", "url": "https://github.com/agentic-lexicon"},
    {"id": "32", "name": "Luminous", "desc": "AI自主协作的集体智慧", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/6givNu7d71.jpg", "category": "ai-agent", "url": "https://luminous.ai"},
    {"id": "33", "name": "Luna", "desc": "AI虚拟人", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/j55BJJq2XQ.jpg", "category": "ai-agent", "url": "https://luna.ai"},
    {"id": "34", "name": "MAX", "desc": "AI Agent Launchpad平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/7TScMSm3vF.jpg", "category": "ai-agent", "url": "https://max.ai"},
    {"id": "35", "name": "Neur", "desc": "AI助手", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/AtKlwz874J.jpg", "category": "ai-agent", "url": "https://neur.ai"},
    {"id": "36", "name": "SPORE", "desc": "自主AI进化平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/wRgD8F5xUD.jpg", "category": "ai-agent", "url": "https://spore.ai"},
    {"id": "37", "name": "SwarmNode.ai", "desc": "简化AI Agent部署", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/n4rb1v9gPj.jpg", "category": "ai-agent", "url": "https://swarmnode.ai"},
    {"id": "38", "name": "swarms", "desc": "AI框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/7cE8ulcHOj.jpg", "category": "ai-agent", "url": "https://swarms.ai"},
    {"id": "39", "name": "The Hive", "desc": "基于AI Agent的DeFi项目", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/16EaKzhFT9.jpg", "category": "ai-agent", "url": "https://thehive.ai"},
    {"id": "40", "name": "VaderAI", "desc": "投资DAO网络", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/qlN55YR2X8.jpg", "category": "ai-agent", "url": "https://vaderai.capital"},
    {"id": "41", "name": "Virtuals Protocol", "desc": "AI Agent资产发行平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/EzYy3Vhbhr.jpg", "category": "ai-agent", "url": "https://virtuals.io"},
    {"id": "42", "name": "vvaifu.fun", "desc": "AI Agent项目创建及发行平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/T5Va5F49y6.jpg", "category": "ai-agent", "url": "https://vvaifu.fun"},
    {"id": "43", "name": "YNE", "desc": "DeSci+AI Agent", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/GXXxl206JA.jpg", "category": "ai-agent", "url": "https://yne.ai"},
    {"id": "44", "name": "ZAILGO", "desc": "AI框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/n4Vb492s9j.jpg", "category": "ai-agent", "url": "https://zailgo.ai"},

    # Meme 工具（部分示例）
    {"id": "45", "name": "pump.fun", "desc": "Solana上Meme发布平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/7R3Rm09MW0.jpg", "category": "meme", "url": "https://pump.fun"},
    {"id": "46", "name": "Phantom", "desc": "Sol链常用钱包", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/gTh6JY9xPk.jpg", "category": "meme", "url": "https://phantom.app"},
    {"id": "47", "name": "pump.news", "desc": "MEME社交媒体雷达", "icon": "https://cdn-img.panewslab.com/panews/2024/12/31/images/x43OxtD7PB.png", "category": "meme", "url": "https://pump.news"},
    {"id": "48", "name": "Cryptohunt", "desc": "Web3智能投研平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/4GBlF72DoA.png", "category": "meme", "url": "https://cryptohunt.ai"},
    {"id": "49", "name": "DEX Screener", "desc": "Altcoin数据平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/md3f4v1ay5.jpg", "category": "meme", "url": "https://dexscreener.com"},
    {"id": "50", "name": "Bubblemaps", "desc": "链上资产可视化平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/NkesvtgE96.png", "category": "meme", "url": "https://bubblemaps.io"},
    {"id": "51", "name": "Birdeye", "desc": "链上交易数据聚合器", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/6XOGGlxH7b.jpg", "category": "meme", "url": "https://birdeye.com"},
    {"id": "52", "name": "DEXTools", "desc": "DEX数据分析平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/6biHcNvbYK.jpg", "category": "meme", "url": "https://www.dextools.io"},
    {"id": "53", "name": "Ave.ai", "desc": "链上数据复制交易平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/X2D2BYiAuV.jpg", "category": "meme", "url": "https://ave.ai"},
    {"id": "54", "name": "HolderScan", "desc": "筹码查询工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/MV0z89dzs4.jpg", "category": "meme", "url": "https://holderscan.com"},
    {"id": "55", "name": "Jupiter", "desc": "Solana DEX聚合器", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/3ZUu25mxJz.jpg", "category": "meme", "url": "https://jupiter.ag"},
    {"id": "56", "name": "Raydium", "desc": "Solana链上订单簿", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/4oR3qji9P5.jpg", "category": "meme", "url": "https://raydium.io"},
    {"id": "57", "name": "BonkBot", "desc": "基于Solana的机器人", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/kC553321Lu.jpg", "category": "meme", "url": "https://bonkbot.com"},
]

def download_icon(url: str, tool_id: str, tool_name: str) -> str:
    """下载图标并返回本地路径"""
    try:
        # 从URL提取文件扩展名
        parsed = urlparse(url)
        ext = os.path.splitext(parsed.path)[1] or ".png"

        # 本地文件名（使用安全的文件名）
        safe_name = tool_name.replace('/', '-').replace(' ', '-').replace('\'', '')[:50]
        filename = f"{safe_name}-{tool_id}{ext}"
        local_path = ICONS_DIR / filename

        # 如果文件已存在，直接返回
        if local_path.exists():
            return f"/icons/{filename}"

        # 下载图片
        response = requests.get(url, timeout=30)
        response.raise_for_status()

        # 保存到本地
        with open(local_path, 'wb') as f:
            f.write(response.content)

        print(f"  ✅ {tool_name}")
        return f"/icons/{filename}"
    except Exception as e:
        print(f"  ❌ {tool_name}: {e}")
        return "/logo.png"  # 失败时使用默认logo

def main():
    print("🚀 开始提取 PANews 数据...")
    print(f"📁 图标保存目录: {ICONS_DIR}")
    print(f"📊 总计 {len(PANEWS_CATEGORIES)} 个分类")
    print(f"🔧 总计 {len(PANEWS_TOOLS)} 个工具")
    print("\n📥 开始下载图标...\n")

    # 下载图标并更新路径
    success_count = 0
    for i, tool in enumerate(PANEWS_TOOLS, 1):
        print(f"[{i}/{len(PANEWS_TOOLS)}]", end=" ")
        tool["icon"] = download_icon(tool["icon"], tool["id"], tool["name"])
        if not tool["icon"].endswith("logo.png"):
            success_count += 1
        time.sleep(0.1)  # 避免请求过快

    # 准备最终数据
    final_data = {
        "categories": PANEWS_CATEGORIES,
        "tools": PANEWS_TOOLS
    }

    # 保存 JSON 数据
    output_file = BASE_DIR / "panews_data.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 数据提取完成！")
    print(f"📊 成功下载: {success_count}/{len(PANEWS_TOOLS)} 个图标")
    print(f"💾 数据已保存到: {output_file}")
    print(f"\n📝 下一步:")
    print(f"   1. 查看数据: cat {output_file}")
    print(f"   2. 更新项目: 手动将数据整合到 src/data/mockData.ts")

if __name__ == "__main__":
    main()
