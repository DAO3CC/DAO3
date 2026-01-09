import json
import re
import requests
from pathlib import Path

# 数据解析
tools_data = {
    "categories": [],
    "tools": []
}

# 从 webReader 的输出中提取数据
content = """从之前获取的内容中提取"""

# 定义分类映射
categories_mapping = {
    "热门": {
        "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/m9yb3f3N1v.png",
        "slug": "hot",
        "tools": [
            {"name": "推特KOL列表", "desc": "推荐关注的Twitter 账号", "icon": "https://cdn-img.panewslab.com/panews/2022/11/03/images/x6w7EVx1B7.jpg"},
            {"name": "GMGN.Ai", "desc": "MEME交易终端", "icon": "https://cdn-img.panewslab.com/panews/2024/12/31/images/88UOLYaJub.jpg"},
            {"name": "Etherscan", "desc": "以太坊区块链浏览器", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/ayT98NBf91.png"},
            {"name": "MetaMask", "desc": "Web3钱包", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/E5X632ipfa.jpg"},
            {"name": "DeFi LIama", "desc": "全链DeFi数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/3Pdl99fm2l.jpg"},
            {"name": "CoinMarketCap", "desc": "行情数据网站", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/6Jhr4Tj8Wf.jpg"},
            {"name": "Dune", "desc": "综合链上数据分析", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/8y6TB3Zj0X.png"},
            {"name": "Debank", "desc": "加密投资组合追踪", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/n8I70y0IoQ.jpg"},
        ]
    },
    "AI Agent": {
        "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/6Eyu5WNniM.png",
        "slug": "ai-agent",
        "tools": [
            {"name": "Act I : The AI Prophecy", "desc": "AI 交互协作平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/139FcF16Ws.jpg"},
            {"name": "AGENCY", "desc": "AI Agent分析师", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/MWGI46DS2x.jpg"},
            {"name": "AI16Z", "desc": "去中心化 AI 交易基金", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/W6ZeKgQRdk.jpg"},
            {"name": "aiPool", "desc": "AI Agent 自主发币", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/F19AmgM6e8.jpg"},
            {"name": "AIXBT", "desc": "AI驱动的加密情报平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/7uW5FgJnKz.jpg"},
            {"name": "Alchemist AI", "desc": "无代码开发平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/4CE5stU04T.jpg"},
            {"name": "Anon", "desc": "AI发币", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/H4jJ40xP7F.jpg"},
            {"name": "arc", "desc": "AI框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/ppCnktr092.jpg"},
            {"name": "AVA", "desc": "专注视觉与视频内容的跨平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/GnGi2IZJgu.jpg"},
            {"name": "Clanker", "desc": "AI驱动的Token Bot", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/yYLzdTNdRV.jpg"},
            {"name": "Cookie", "desc": "AI Agent 索引平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/2N5v73HmIV.jpg"},
            {"name": "Dolion", "desc": "AI机器人", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/B6T57zx9s7.jpg"},
            {"name": "DUNA", "desc": "AI DAO", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/FaQyCytYO4.jpg"},
            {"name": "Eilza", "desc": "模块化AI 智能体框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/OM2IZji883.jpg"},
            {"name": "Fartcoin", "desc": "Terminal of Truths 上的首个MEME", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/v4RBqOP0Gd.jpg"},
            {"name": "G.A.M.E", "desc": "模块化的智能代理框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/nc7TgyhHmt.jpg"},
            {"name": "Goatseus Maximus", "desc": "AI概念MEME币", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/B4Byq0uPvP.jpg"},
            {"name": "Griffain", "desc": "AI 助手", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/ev5Ys78tz4.png"},
            {"name": "LEXICON", "desc": "开源AI Agent框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/1kGMNY0aPM.png"},
            {"name": "Luminous", "desc": "AI自主协作的集体智慧", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/6givNu7d71.jpg"},
            {"name": "Luna", "desc": "AI 虚拟人", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/j55BJJq2XQ.jpg"},
            {"name": "MAX", "desc": "AI Agent Launchpad 平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/7TScMSm3vF.jpg"},
            {"name": "Neur", "desc": "AI 助手", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/AtKlwz874J.jpg"},
            {"name": "SPORE", "desc": "自主AI 进化平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/wRgD8F5xUD.jpg"},
            {"name": "SwarmNode.ai", "desc": "简化 AI Agent 部署", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/n4rb1v9gPj.jpg"},
            {"name": "swarms", "desc": "AI框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/7cE8ulcHOj.jpg"},
            {"name": "The Hive", "desc": "基于AI Agent的DeFi项目", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/16EaKzhFT9.jpg"},
            {"name": "VaderAI", "desc": "投资DAO 网络", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/qlN55YR2X8.jpg"},
            {"name": "Virtuals Protocol", "desc": "AI Agent资产发行平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/EzYy3Vhbhr.jpg"},
            {"name": "vvaifu.fun", "desc": "AI Agent 项目创建及发行平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/T5Va5F49y6.jpg"},
            {"name": "YNE", "desc": "DeSci+AI Agent", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/GXXxl206JA.jpg"},
            {"name": "ZAILGO", "desc": "AI框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/n4Vb492s9j.jpg"},
        ]
    },
    "Meme常用工具": {
        "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/00hZS21NlS.png",
        "slug": "meme",
        "tools": [
            {"name": "GMGN.Ai", "desc": "MEME交易终端", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/817d0c9woZ.jpg"},
            {"name": "pump.fun", "desc": "Solana上Meme发布平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/7R3Rm09MW0.jpg"},
            {"name": "Phantom", "desc": "Sol链常用钱包", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/gTh6JY9xPk.jpg"},
            {"name": "pump.news", "desc": "MEME社交媒体雷达", "icon": "https://cdn-img.panewslab.com/panews/2024/12/31/images/x43OxtD7PB.png"},
            {"name": "Cryptohunt", "desc": "Web3智能投研平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/4GBlF72DoA.png"},
            {"name": "DEX Screener", "desc": "Altcoin数据平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/md3f4v1ay5.jpg"},
            {"name": "Bubblemaps", "desc": "链上资产可视化平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/NkesvtgE96.png"},
            {"name": "Birdeye", "desc": "链上交易数据聚合器", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/6XOGGlxH7b.jpg"},
            {"name": "DEXTools", "desc": "DEX数据分析平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/6biHcNvbYK.jpg"},
            {"name": "Ave.ai", "desc": "链上数据复制交易平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/X2D2BYiAuV.jpg"},
            {"name": "HolderScan", "desc": "筹码查询工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/MV0z89dzs4.jpg"},
            {"name": "Suiscan", "desc": "Solana浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/k448lhrRYe.jpg"},
            {"name": "SolanaFM", "desc": "Solana综合数据平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/Nb1rY17qX3.jpg"},
            {"name": "Vybe Network", "desc": "Solana 数据平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/Ry3gQ0Va8q.jpg"},
            {"name": "Alphatrace", "desc": "链上资产分析工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/HkgfEf04no.png"},
            {"name": "Pepe Boost", "desc": "Telegram交易机器人", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/2Npbee65Cx.png"},
            {"name": "Debank", "desc": "跟踪加密投资组合工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/8Hg1Dr5TLp.jpg"},
            {"name": "TweetScout", "desc": "X活跃及社交评分工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/38FApzyOVh.png"},
            {"name": "TwitterScore", "desc": "X活跃及社交评分工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/Phpmd808j9.jpg"},
            {"name": "Arkham", "desc": "钱包地址数据分析工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/4oWpR8q159.jpg"},
            {"name": "GoPlus Security", "desc": "合约审计风险评估工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/aidHZ90qME.jpg"},
            {"name": "TokenSniffer", "desc": "代币合约风险检测工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/T4WzaWbBnh.jpg"},
            {"name": "Honeypot.is", "desc": "蜜罐行为检测工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/6s3z3f6nG4.jpg"},
            {"name": "Rugcheck", "desc": "合约风险检测工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/apqi01427o.jpg"},
            {"name": "Solsniffer", "desc": "合约风险检测工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/015T59Q6v0.png"},
            {"name": "Zapper", "desc": "链上趋势查看工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/APcKcvuPGH.jpg"},
            {"name": "TrustWallet", "desc": "多链资产管理钱包", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/Y7qK4EP3e7.jpg"},
            {"name": "OKXWallet", "desc": "多功能区块链钱包", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/50hmi7nYf5.png"},
            {"name": "BullX", "desc": "Web端交易工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/1l91VIp2uS.jpg"},
            {"name": "Jupiter", "desc": "Solana DEX 聚合器", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/3ZUu25mxJz.jpg"},
            {"name": "Raydium", "desc": "Solana链上订单簿", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/4oR3qji9P5.jpg"},
            {"name": "Hop", "desc": "Sui链交易聚合器", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/O3dVBZzikC.jpg"},
            {"name": "Cetus", "desc": "Sui链DEX", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/pVOT29a8z1.png"},
            {"name": "Turbos Finance", "desc": "Sui上的Meme hub", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/3B1k108gQr.jpg"},
            {"name": "DeepBook Protocol on Sui", "desc": "Sui链上订单簿交易所", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/HJhAQvWQ7o.jpg"},
            {"name": "BONKbot", "desc": "基于Solana的机器人", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/kC553321Lu.jpg"},
            {"name": "Maestro", "desc": "Telegram交易机器人", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/a1Y00LC6Fy.jpg"},
            {"name": "Trojan", "desc": "Solana交易工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/7L59OUMAD2.jpg"},
            {"name": "Banana Gun", "desc": "Telegram交易机器人", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/Xm515R2F38.jpg"},
            {"name": "SolTradingBot", "desc": "Solana交易助手", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/t1lywG7zd2.jpg"},
            {"name": "Unibot", "desc": "Telegram交易工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/5l4KS799Al.jpg"},
            {"name": "SUIBABot", "desc": "Sui上的交易机器人", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/zdM4u2U3Pe.jpg"},
            {"name": "Move pump", "desc": "Sui上Meme发布平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/3z1LKxBqgF.jpg"},
            {"name": "Logearn", "desc": "AI抓金狗工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/D6T5Fqe281.jpg"},
            {"name": "Dbotx", "desc": "全自动交易机器人", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/brnjvTJIy2.jpg"},
            {"name": "Photon", "desc": "Sol链最快交易平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/i2773Wp921.jpg"},
        ]
    }
}

# 保存数据到 JSON
with open('panews_tools.json', 'w', encoding='utf-8') as f:
    json.dump(categories_mapping, f, ensure_ascii=False, indent=2)

print("✅ 数据提取完成！")
print(f"📊 提取了 {len(categories_mapping)} 个分类")
for cat_name, cat_data in categories_mapping.items():
    print(f"  - {cat_name}: {len(cat_data['tools'])} 个工具")
