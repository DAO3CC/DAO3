#!/usr/bin/env python3
"""
检测并补充遗漏的工具
"""
import re
import json
from pathlib import Path

# 本地mockData.ts文件
mockdata_file = Path("/Users/jim/Desktop/Claude Code/DAO3/src/data/mockData.ts")

# PANews最新工具列表（从网页抓取）
panews_tools = [
    # 热门分类
    {"id": "t1", "name": "推特KOL列表", "desc": "推荐关注的Twitter账号", "url": "https://x.com/DAO3CC/summary", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2022/11/03/images/x6w7EVx1B7.jpg"},
    {"id": "t2", "name": "GMGN.Ai", "desc": "MEME交易终端", "url": "https://gmgn.ai", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2024/12/31/images/88UOLYaJub.jpg"},
    {"id": "t3", "name": "Etherscan", "desc": "以太坊区块链浏览器", "url": "https://etherscan.io", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/ayT98NBf91.png"},
    {"id": "t4", "name": "MetaMask", "desc": "Web3钱包", "url": "https://metamask.io", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/E5X632ipfa.jpg"},
    {"id": "t5", "name": "DeFi Llama", "desc": "全链DeFi数据", "url": "https://defillama.com", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/3Pdl99fm2l.jpg"},
    {"id": "t6", "name": "CoinMarketCap", "desc": "行情数据网站", "url": "https://coinmarketcap.com", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/6Jhr4Tj8Wf.jpg"},
    {"id": "t7", "name": "Dune", "desc": "综合链上数据分析", "url": "https://dune.com", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/8y6TB3Zj0X.png"},
    {"id": "t8", "name": "Debank", "desc": "加密投资组合追踪", "url": "https://debank.com", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/n8I70y0IoQ.jpg"},
    {"id": "t9", "name": "Zcash Dashboard", "desc": "Zcash 数据看板", "url": "https://z.cash/dashboard", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2025/11/17/images/u17A3qrWP5.jpg"},
    {"id": "t10", "name": "CoinGecko", "desc": "行情数据网站", "url": "https://coingecko.com", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/XB7R5bWg0E.jpg"},
    {"id": "t11", "name": "Ultra Sound Money", "desc": "以太坊供应数据监测", "url": "https://ultrasound.money", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2022/10/26/images/yrVo905PFl.jpg"},
    {"id": "t12", "name": "恐惧与贪婪指数", "desc": "恐惧与贪婪指数查询", "url": "https://alternative.me/crypto/fear-and-greed-index/", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/H7hV5l7AC4.jpg"},
    {"id": "t13", "name": "TradingView", "desc": "专业行情分析工具", "url": "https://tradingview.com", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/CJvbdMxnwQ.jpg"},
    {"id": "t14", "name": "growthepie", "desc": "以太坊生态数据看板", "url": "https://growthepie.xyz", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2025/07/11/images/M442c3uPlT.jpg"},
    {"id": "t15", "name": "Nansen", "desc": "交易所钱包余额", "url": "https://www.nansen.ai", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/g3Fsmv91mZ.png"},
    # 新增工具
    {"id": "t16", "name": "CoinAnk", "desc": "加密货币衍生品数据分析", "url": "https://www.coinank.com", "category": "hot", "icon": "https://cdn-img.panewslab.com/panews/2025/12/26/images/0680fM994M.png"},
]

# 读取本地数据
with open(mockdata_file, 'r', encoding='utf-8') as f:
    local_content = f.read()

# 提取本地工具名称
local_tools = set(re.findall(r"name:\s*'([^']+)'", local_content))

print(f"📊 本地工具数量: {len(local_tools)}")
print(f"📊 PANews工具数量: {len(panews_tools)}")

# 找出遗漏的工具
missing_tools = []
for tool in panews_tools:
    if tool['name'] not in local_tools:
        missing_tools.append(tool)

print(f"\n⚠️  发现 {len(missing_tools)} 个遗漏的工具:\n")

if missing_tools:
    for tool in missing_tools:
        print(f"  ❌ {tool['name']} - {tool['desc']}")
        print(f"     URL: {tool['url']}")
        print(f"     Icon: {tool['icon']}")
        print()
else:
    print("✅ 没有遗漏的工具！所有PANews工具都已在本地数据库中。")
