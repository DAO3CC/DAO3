#!/usr/bin/env python3
"""
完整提取 PANews 所有工具数据并下载图标
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

# 完整的 PANews 所有工具数据（从 webReader 完整提取）
ALL_PANEWS_TOOLS = [
    # 热门工具
    {"id": "t1", "name": "推特KOL列表", "desc": "推荐关注的Twitter账号", "icon": "https://cdn-img.panewslab.com/panews/2022/11/03/images/x6w7EVx1B7.jpg", "category": "hot", "url": "https://x.com/DAO3CC/summary"},
    {"id": "t2", "name": "GMGN.Ai", "desc": "MEME交易终端", "icon": "https://cdn-img.panewslab.com/panews/2024/12/31/images/88UOLYaJub.jpg", "category": "hot", "url": "https://gmgn.ai"},
    {"id": "t3", "name": "Etherscan", "desc": "以太坊区块链浏览器", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/ayT98NBf91.png", "category": "hot", "url": "https://etherscan.io"},
    {"id": "t4", "name": "MetaMask", "desc": "Web3钱包", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/E5X632ipfa.jpg", "category": "hot", "url": "https://metamask.io"},
    {"id": "t5", "name": "DeFi LIama", "desc": "全链DeFi数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/3Pdl99fm2l.jpg", "category": "hot", "url": "https://defillama.com"},
    {"id": "t6", "name": "CoinMarketCap", "desc": "行情数据网站", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/6Jhr4Tj8Wf.jpg", "category": "hot", "url": "https://coinmarketcap.com"},
    {"id": "t7", "name": "Dune", "desc": "综合链上数据分析", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/8y6TB3Zj0X.png", "category": "hot", "url": "https://dune.com"},
    {"id": "t8", "name": "Debank", "desc": "加密投资组合追踪", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/n8I70y0IoQ.jpg", "category": "hot", "url": "https://debank.com"},
    {"id": "t9", "name": "Zcash Dashboard", "desc": "Zcash数据看板", "icon": "https://cdn-img.panewslab.com/panews/2025/11/17/images/u17A3qrWP5.jpg", "category": "hot", "url": "https://z.cash"},
    {"id": "t10", "name": "CoinGecko", "desc": "行情数据网站", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/XB7R5bWg0E.jpg", "category": "hot", "url": "https://coingecko.com"},
    {"id": "t11", "name": "Ultra Sound Money", "desc": "以太坊供应数据监测", "icon": "https://cdn-img.panewslab.com/panews/2022/10/26/images/yrVo905PFl.jpg", "category": "hot", "url": "https://ultrasound.money"},
    {"id": "t12", "name": "恐惧与贪婪指数", "desc": "恐惧与贪婪指数查询", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/H7hV5l7AC4.jpg", "category": "hot", "url": "https://alternative.me/crypto/fear-and-greed-index/"},
    {"id": "t13", "name": "TradingView", "desc": "专业行情分析工具", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/CJvbdMxnwQ.jpg", "category": "hot", "url": "https://tradingview.com"},
    {"id": "t14", "name": "growthepie", "desc": "以太坊生态数据看板", "icon": "https://cdn-img.panewslab.com/panews/2025/07/11/images/M442c3uPlT.jpg", "category": "hot", "url": "https://growthepie.xyz"},
    {"id": "t15", "name": "Nansen", "desc": "交易所钱包余额", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/g3Fsmv91mZ.png", "category": "hot", "url": "https://www.nansen.ai"},

    # DAT 数据看板
    {"id": "dat1", "name": "Blockworks", "desc": "加密财库公司综合看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/QA4j9wJ7ka.jpg", "category": "dat-dashboard", "url": "https://blockworks.co"},
    {"id": "dat2", "name": "DELPHI DIGITAL", "desc": "加密财库公司综合看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/FkdBUs52Vx.jpg", "category": "dat-dashboard", "url": "https://delphidigital.io"},
    {"id": "dat3", "name": "DefiLlama", "desc": "加密财库公司综合看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/1g2wC3T0yU.jpg", "category": "dat-dashboard", "url": "https://defillama.com/treasuries"},
    {"id": "dat4", "name": "THE BLOCK", "desc": "加密财库公司综合看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/8cIvwE45Ym.jpg", "category": "dat-dashboard", "url": "https://www.theblock.co"},
    {"id": "dat5", "name": "Crypto Stock Tracker", "desc": "加密财库公司综合看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/2QY8o9137F.jpg", "category": "dat-dashboard", "url": "https://cryptostocktracker.com"},
    {"id": "dat6", "name": "Crypto Treasuries", "desc": "加密财库公司综合看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/Di5P2Jj41K.png", "category": "dat-dashboard", "url": "https://cryptostocktracker.com/treasuries"},
    {"id": "dat7", "name": "Bitcoin Treasuries", "desc": "上市公司BTC财库看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/2hD608X4Ia.jpg", "category": "dat-dashboard", "url": "https://bitcointreasuries.net"},
    {"id": "dat8", "name": "coingecko", "desc": "上市公司BTC财库看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/89JG02uzec.png", "category": "dat-dashboard", "url": "https://www.coingecko.com/en/explorer/treasury/bitcoin"},
    {"id": "dat9", "name": "CompaniesMarketCap", "desc": "BTC持有量排行（公司市值）", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/ira73Q24s7.jpg", "category": "dat-dashboard", "url": "https://companiesmarketcap.com"},
    {"id": "dat10", "name": "SoSoValue", "desc": "上市公司BTC财库看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/x6yvkAO2DK.jpg", "category": "dat-dashboard", "url": "https://www.sosovalue.com"},
    {"id": "dat11", "name": "bitbo", "desc": "上市公司BTC财库看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/10UMHXMrR1.jpg", "category": "dat-dashboard", "url": "https://bitbo.io"},
    {"id": "dat12", "name": "newhedge", "desc": "公司BTC财库看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/75Ioe1ZVAG.jpg", "category": "dat-dashboard", "url": "https://newhedge.io"},
    {"id": "dat13", "name": "Strategic ETH Reserve", "desc": "ETH战略储备看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/82y3eWv9No.png", "category": "dat-dashboard", "url": "https://ethreserve.io"},
    {"id": "dat14", "name": "Finder", "desc": "ETH财库看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/GBfM0VGGcr.jpg", "category": "dat-dashboard", "url": "https://www.finder.com.au"},
    {"id": "dat15", "name": "coingecko", "desc": "上市公司ETH财库看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/01/images/e4n4JNWpdN.png", "category": "dat-dashboard", "url": "https://www.coingecko.com/en/explorer/treasury/ethereum"},
    {"id": "dat16", "name": "BBX", "desc": "加密货币储备综合看板", "icon": "https://cdn-img.panewslab.com/panews/2025/08/04/images/1McDEzrNLq.jpg", "category": "dat-dashboard", "url": "https://www.bbx.link"},

    # AI Agent 工具
    {"id": "ai1", "name": "Act I : The AI Prophecy", "desc": "AI交互协作平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/139FcF16Ws.jpg", "category": "ai-agent", "url": "https://act1.ai"},
    {"id": "ai2", "name": "AGENCY", "desc": "AI Agent分析师", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/MWGI46DS2x.jpg", "category": "ai-agent", "url": "https://agency.xyz"},
    {"id": "ai3", "name": "AI16Z", "desc": "去中心化AI交易基金", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/W6ZeKgQRdk.jpg", "category": "ai-agent", "url": "https://ai16z.com"},
    {"id": "ai4", "name": "aiPool", "desc": "AI Agent自主发币", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/F19AmgM6e8.jpg", "category": "ai-agent", "url": "https://aipool.xyz"},
    {"id": "ai5", "name": "AIXBT", "desc": "AI驱动的加密情报平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/7uW5FgJnKz.jpg", "category": "ai-agent", "url": "https://aixbt.ai"},
    {"id": "ai6", "name": "Alchemist AI", "desc": "无代码开发平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/4CE5stU04T.jpg", "category": "ai-agent", "url": "https://alchemists.ai"},
    {"id": "ai7", "name": "Anon", "desc": "AI发币", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/H4jJ40xP7F.jpg", "category": "ai-agent", "url": "https://anon.ai"},
    {"id": "ai8", "name": "arc", "desc": "AI框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/ppCnktr092.jpg", "category": "ai-agent", "url": "https://arc.app"},
    {"id": "ai9", "name": "AVA", "desc": "专注视觉与视频内容的跨平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/GnGi2IZJgu.jpg", "category": "ai-agent", "url": "https://ava.ai"},
    {"id": "ai10", "name": "Clanker", "desc": "AI驱动的Token Bot", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/yYLzdTNdRV.jpg", "category": "ai-agent", "url": "https://clanker.ai"},
    {"id": "ai11", "name": "Cookie", "desc": "AI Agent索引平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/2N5v73HmIV.jpg", "category": "ai-agent", "url": "https://cookie.fun"},
    {"id": "ai12", "name": "Dolion", "desc": "AI机器人", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/B6T57zx9s7.jpg", "category": "ai-agent", "url": "https://dolion.ai"},
    {"id": "ai13", "name": "DUNA", "desc": "AI DAO", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/FaQyCytYO4.jpg", "category": "ai-agent", "url": "https://duna.ai"},
    {"id": "ai14", "name": "Eilza", "desc": "模块化AI智能体框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/OM2IZji883.jpg", "category": "ai-agent", "url": "https://eilza.ai"},
    {"id": "ai15", "name": "Fartcoin", "desc": "Terminal of Truths上的首个MEME", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/v4RBqOP0Gd.jpg", "category": "ai-agent", "url": "https://fartcoin.ai"},
    {"id": "ai16", "name": "G.A.M.E", "desc": "模块化的智能代理框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/nc7TgyhHmt.jpg", "category": "ai-agent", "url": "https://game.gg"},
    {"id": "ai17", "name": "Goatseus Maximus", "desc": "AI概念MEME币", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/B4Byq0uPvP.jpg", "category": "ai-agent", "url": "https://goatseusmaximus.com"},
    {"id": "ai18", "name": "Griffain", "desc": "AI助手", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/ev5Ys78tz4.png", "category": "ai-agent", "url": "https://griffain.ai"},
    {"id": "ai19", "name": "LEXICON", "desc": "开源AI Agent框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/1kGMNY0aPM.png", "category": "ai-agent", "url": "https://github.com/agentic-lexicon"},
    {"id": "ai20", "name": "Luminous", "desc": "AI自主协作的集体智慧", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/6givNu7d71.jpg", "category": "ai-agent", "url": "https://luminous.ai"},
    {"id": "ai21", "name": "Luna", "desc": "AI虚拟人", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/j55BJJq2XQ.jpg", "category": "ai-agent", "url": "https://luna.ai"},
    {"id": "ai22", "name": "MAX", "desc": "AI Agent Launchpad平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/7TScMSm3vF.jpg", "category": "ai-agent", "url": "https://max.ai"},
    {"id": "ai23", "name": "Neur", "desc": "AI助手", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/AtKlwz874J.jpg", "category": "ai-agent", "url": "https://neur.ai"},
    {"id": "ai24", "name": "SPORE", "desc": "自主AI进化平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/wRgD8F5xUD.jpg", "category": "ai-agent", "url": "https://spore.ai"},
    {"id": "ai25", "name": "SwarmNode.ai", "desc": "简化AI Agent部署", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/n4rb1v9gPj.jpg", "category": "ai-agent", "url": "https://swarmnode.ai"},
    {"id": "ai26", "name": "swarms", "desc": "AI框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/7cE8ulcHOj.jpg", "category": "ai-agent", "url": "https://swarms.ai"},
    {"id": "ai27", "name": "The Hive", "desc": "基于AI Agent的DeFi项目", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/16EaKzhFT9.jpg", "category": "ai-agent", "url": "https://thehive.ai"},
    {"id": "ai28", "name": "VaderAI", "desc": "投资DAO网络", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/qlN55YR2X8.jpg", "category": "ai-agent", "url": "https://vaderai.capital"},
    {"id": "ai29", "name": "Virtuals Protocol", "desc": "AI Agent资产发行平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/EzYy3Vhbhr.jpg", "category": "ai-agent", "url": "https://virtuals.io"},
    {"id": "ai30", "name": "vvaifu.fun", "desc": "AI Agent项目创建及发行平台", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/T5Va5F49y6.jpg", "category": "ai-agent", "url": "https://vvaifu.fun"},
    {"id": "ai31", "name": "YNE", "desc": "DeSci+AI Agent", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/GXXxl206JA.jpg", "category": "ai-agent", "url": "https://yne.ai"},
    {"id": "ai32", "name": "ZAILGO", "desc": "AI框架", "icon": "https://cdn-img.panewslab.com/panews/2025/01/03/images/n4Vb492s9j.jpg", "category": "ai-agent", "url": "https://zailgo.ai"},

    # Meme 工具
    {"id": "meme1", "name": "GMGN.Ai", "desc": "MEME交易终端", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/817d0c9woZ.jpg", "category": "meme", "url": "https://gmgn.ai"},
    {"id": "meme2", "name": "pump.fun", "desc": "Solana上Meme发布平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/7R3Rm09MW0.jpg", "category": "meme", "url": "https://pump.fun"},
    {"id": "meme3", "name": "Phantom", "desc": "Sol链常用钱包", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/gTh6JY9xPk.jpg", "category": "meme", "url": "https://phantom.app"},
    {"id": "meme4", "name": "pump.news", "desc": "MEME社交媒体雷达", "icon": "https://cdn-img.panewslab.com/panews/2024/12/31/images/x43OxtD7PB.png", "category": "meme", "url": "https://pump.news"},
    {"id": "meme5", "name": "Cryptohunt", "desc": "Web3智能投研平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/4GBlF72DoA.png", "category": "meme", "url": "https://cryptohunt.ai"},
    {"id": "meme6", "name": "DEX Screener", "desc": "Altcoin数据平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/md3f4v1ay5.jpg", "category": "meme", "url": "https://dexscreener.com"},
    {"id": "meme7", "name": "Bubblemaps", "desc": "链上资产可视化平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/NkesvtgE96.png", "category": "meme", "url": "https://bubblemaps.io"},
    {"id": "meme8", "name": "Birdeye", "desc": "链上交易数据聚合器", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/6XOGGlxH7b.jpg", "category": "meme", "url": "https://birdeye.com"},
    {"id": "meme9", "name": "DEXTools", "desc": "DEX数据分析平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/6biHcNvbYK.jpg", "category": "meme", "url": "https://www.dextools.io"},
    {"id": "meme10", "name": "Ave.ai", "desc": "链上数据复制交易平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/X2D2BYiAuV.jpg", "category": "meme", "url": "https://ave.ai"},
    {"id": "meme11", "name": "HolderScan", "desc": "筹码查询工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/MV0z89dzs4.jpg", "category": "meme", "url": "https://holderscan.com"},
    {"id": "meme12", "name": "Suiscan", "desc": "Solana浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/k448lhrRYe.jpg", "category": "meme", "url": "https://suiscan.xyz"},
    {"id": "meme13", "name": "SolanaFM", "desc": "Solana综合数据平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/Nb1rY17qX3.jpg", "category": "meme", "url": "https://solana.fm"},
    {"id": "meme14", "name": "Vybe Network", "desc": "Solana数据平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/Ry3gQ0Va8q.jpg", "category": "meme", "url": "https://vybenetwork.xyz"},
    {"id": "meme15", "name": "Alphatrace", "desc": "链上资产分析工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/HkgfEf04no.png", "category": "meme", "url": "https://alphatrace.io"},
    {"id": "meme16", "name": "Pepe Boost", "desc": "Telegram交易机器人", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/2Npbee65Cx.png", "category": "meme", "url": "https://t.me/pepeboostbot"},
    {"id": "meme17", "name": "Debank", "desc": "跟踪加密投资组合工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/8Hg1Dr5TLp.jpg", "category": "meme", "url": "https://debank.com"},
    {"id": "meme18", "name": "TweetScout", "desc": "X活跃及社交评分工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/38FApzyOVh.png", "category": "meme", "url": "https://tweetscout.io"},
    {"id": "meme19", "name": "TwitterScore", "desc": "X活跃及社交评分工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/Phpmd808j9.jpg", "category": "meme", "url": "https://twitterscore.io"},
    {"id": "meme20", "name": "Arkham", "desc": "钱包地址数据分析工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/4oWpR8q159.jpg", "category": "meme", "url": "https://arkhamcrypto.com"},
    {"id": "meme21", "name": "GoPlus Security", "desc": "合约审计风险评估工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/aidHZ90qME.jpg", "category": "meme", "url": "https://gopluslabs.io"},
    {"id": "meme22", "name": "TokenSniffer", "desc": "代币合约风险检测工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/T4WzaWbBnh.jpg", "category": "meme", "url": "https://tokensniffer.com"},
    {"id": "meme23", "name": "Honeypot.is", "desc": "蜜罐行为检测工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/6s3z3f6nG4.jpg", "category": "meme", "url": "https://honeypot.is"},
    {"id": "meme24", "name": "Rugcheck", "desc": "合约风险检测工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/apqi01427o.jpg", "category": "meme", "url": "https://rugcheck.com"},
    {"id": "meme25", "name": "Solsniffer", "desc": "合约风险检测工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/015T59Q6v0.png", "category": "meme", "url": "https://solsniffer.com"},
    {"id": "meme26", "name": "Zapper", "desc": "链上趋势查看工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/APcKcvuPGH.jpg", "category": "meme", "url": "https://zapper.xyz"},
    {"id": "meme27", "name": "TrustWallet", "desc": "多链资产管理钱包", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/Y7qK4EP3e7.jpg", "category": "meme", "url": "https://trustwallet.com"},
    {"id": "meme28", "name": "OKXWallet", "desc": "多功能区块链钱包", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/50hmi7nYf5.png", "category": "meme", "url": "https://okx.com/web3"},
    {"id": "meme29", "name": "BullX", "desc": "Web端交易工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/1l91VIp2uS.jpg", "category": "meme", "url": "https://bullx.io"},
    {"id": "meme30", "name": "Jupiter", "desc": "Solana DEX聚合器", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/3ZUu25mxJz.jpg", "category": "meme", "url": "https://jupiter.ag"},
    {"id": "meme31", "name": "Raydium", "desc": "Solana链上订单簿", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/4oR3qji9P5.jpg", "category": "meme", "url": "https://raydium.io"},
    {"id": "meme32", "name": "Hop", "desc": "Sui链交易聚合器", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/O3dVBZzikC.jpg", "category": "meme", "url": "https://hop.ag"},
    {"id": "meme33", "name": "Cetus", "desc": "Sui链DEX", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/pVOT29a8z1.png", "category": "meme", "url": "https://cetus.xyz"},
    {"id": "meme34", "name": "Turbos Finance", "desc": "Sui上的Meme hub", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/3B1k108gQr.jpg", "category": "meme", "url": "https://turbos.finance"},
    {"id": "meme35", "name": "DeepBook Protocol on Sui", "desc": "Sui链上订单簿交易所", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/HJhAQvWQ7o.jpg", "category": "meme", "url": "https://suiprotocol.com"},
    {"id": "meme36", "name": "BONKbot", "desc": "基于Solana的机器人", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/kC553321Lu.jpg", "category": "meme", "url": "https://bonkbot.com"},
    {"id": "meme37", "name": "Maestro", "desc": "Telegram交易机器人", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/a1Y00LC6Fy.jpg", "category": "meme", "url": "https://t.me/maestrobot"},
    {"id": "meme38", "name": "Trojan", "desc": "Solana交易工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/7L59OUMAD2.jpg", "category": "meme", "url": "https://trojan.exchange"},
    {"id": "meme39", "name": "Banana Gun", "desc": "Telegram交易机器人", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/Xm515R2F38.jpg", "category": "meme", "url": "https://bananagun.com"},
    {"id": "meme40", "name": "SolTradingBot", "desc": "Solana交易助手", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/t1lywG7zd2.jpg", "category": "meme", "url": "https://t.me/SolTradingBot"},
    {"id": "meme41", "name": "Unibot", "desc": "Telegram交易工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/5l4KS799Al.jpg", "category": "meme", "url": "https://www.unibot.app"},
    {"id": "meme42", "name": "SUIBABot", "desc": "Sui上的交易机器人", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/zdM4u2U3Pe.jpg", "category": "meme", "url": "https://t.me/suibabot"},
    {"id": "meme43", "name": "Move pump", "desc": "Sui上Meme发布平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/3z1LKxBqgF.jpg", "category": "meme", "url": "https://movepump.com"},
    {"id": "meme44", "name": "Logearn", "desc": "AI抓金狗工具", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/D6T5Fqe281.jpg", "category": "meme", "url": "https://logearn.io"},
    {"id": "meme45", "name": "Dbotx", "desc": "全自动交易机器人", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/brnjvTJIy2.jpg", "category": "meme", "url": "https://dbotx.com"},
    {"id": "meme46", "name": "Photon", "desc": "Sol链最快交易平台", "icon": "https://cdn-img.panewslab.com/panews/2024/10/18/images/i2773Wp921.jpg", "category": "meme", "url": "https://photon-swap.com"},

    # 区块浏览器
    {"id": "exp1", "name": "Etherscan", "desc": "以太坊区块链浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/1f0JtloZ0l.png", "category": "blockchain-explorer", "url": "https://etherscan.io"},
    {"id": "exp2", "name": "Blockchair", "desc": "多链浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/438TL42a0T.png", "category": "blockchain-explorer", "url": "https://blockchair.com"},
    {"id": "exp3", "name": "Blockchain.com", "desc": "多链浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/2V6xn8D363.png", "category": "blockchain-explorer", "url": "https://www.blockchain.com"},
    {"id": "exp4", "name": "OKLINK", "desc": "多链浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/08/23/images/25ynl9T4H7.png", "category": "blockchain-explorer", "url": "https://www.oklink.com"},
    {"id": "exp5", "name": "Blockscout", "desc": "EVM区块链浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/1s5k08BBLk.png", "category": "blockchain-explorer", "url": "https://blockscout.com"},
    {"id": "exp6", "name": "OP浏览器", "desc": "Optimism浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/0H5saT45jL.jpg", "category": "blockchain-explorer", "url": "https://optimistic.etherscan.io"},
    {"id": "exp7", "name": "Arbiscan", "desc": "Arbitrum浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/2Q3C65u1C3.png", "category": "blockchain-explorer", "url": "https://arbiscan.io"},
    {"id": "exp8", "name": "BscScan", "desc": "BNB链浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/jM2Sqtu71I.png", "category": "blockchain-explorer", "url": "https://bscscan.com"},
    {"id": "exp9", "name": "polygonscan", "desc": "Polygon浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/XbHxFULZ3y.png", "category": "blockchain-explorer", "url": "https://polygonscan.com"},
    {"id": "exp10", "name": "Solscan", "desc": "Solana浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/Q542dSTP7n.png", "category": "blockchain-explorer", "url": "https://solscan.io"},
    {"id": "exp11", "name": "Subscan", "desc": "波卡生态浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/XbjNHT7OEt.png", "category": "blockchain-explorer", "url": "https://subscan.io"},
    {"id": "exp12", "name": "TRONSCAN", "desc": "TRON浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/kDi9E5LE1s.png", "category": "blockchain-explorer", "url": "https://tronscan.org"},
    {"id": "exp13", "name": "AVASCAN", "desc": "Avalanche浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/1fu3YGwbb0.png", "category": "blockchain-explorer", "url": "https://snowtrace.io"},
    {"id": "exp14", "name": "FilScan", "desc": "Filecoin浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/54ryz9lx9b.png", "category": "blockchain-explorer", "url": "https://filscan.io"},
    {"id": "exp15", "name": "GnosisScan", "desc": "Gnosis浏览器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/t7T1U5CQxh.png", "category": "blockchain-explorer", "url": "https://gnosisscan.io"},
    {"id": "exp16", "name": "NearScan", "desc": "Near浏览器", "icon": "https://cdn-img.panewslab.com/panews/2022/08/30/images/BS46Xlp4nK.jpg", "category": "blockchain-explorer", "url": "https://nearblocks.io"},
    {"id": "exp17", "name": "CronosScan", "desc": "Cronos浏览器", "icon": "https://cdn-img.panewslab.com/panews/2022/08/30/images/45ahkwk4U9.jpg", "category": "blockchain-explorer", "url": "https://cronoscan.com"},
    {"id": "exp18", "name": "MintScan", "desc": "Cosmos浏览器", "icon": "https://cdn-img.panewslab.com/panews/2022/08/30/images/xQ91GAEjQ9.jpg", "category": "blockchain-explorer", "url": "https://www.mintscan.io"},
    {"id": "exp19", "name": "Aptos", "desc": "Aptos浏览器", "icon": "https://cdn-img.panewslab.com/panews/2022/10/26/images/Hy65xtM213.jpg", "category": "blockchain-explorer", "url": "https://aptoscan.com"},
    {"id": "exp20", "name": "Tokenview", "desc": "多链浏览器", "icon": "https://cdn-img.panewslab.com/panews/2022/12/27/images/41LAx9804Q.png", "category": "blockchain-explorer", "url": "https://tokenview.io"},
    {"id": "exp21", "name": "Sui", "desc": "Sui浏览器", "icon": "https://cdn-img.panewslab.com/panews/2023/05/06/images/195xcmxEGD.jpg", "category": "blockchain-explorer", "url": "https://suiscan.xyz"},

    # 综合数据
    {"id": "data1", "name": "Glassnode", "desc": "全面的区块链链上数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/Kmpl43PkCD.png", "category": "data", "url": "https://glassnode.com"},
    {"id": "data2", "name": "Dune", "desc": "综合链上数据分析", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/DF230hRbS4.png", "category": "data", "url": "https://dune.com"},
    {"id": "data3", "name": "Nansen", "desc": "资产链上活动追踪", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/VnR5EkO3i4.png", "category": "data", "url": "https://www.nansen.ai"},
    {"id": "data4", "name": "GeckoTerminal", "desc": "资产链上活动追踪", "icon": "https://cdn-img.panewslab.com/panews/2024/07/25/images/S2bPOiKXWz.jpg", "category": "data", "url": "https://www.geckoterminal.com"},
    {"id": "data5", "name": "Messari", "desc": "综合数据和报告平台", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/1M10zXS1p7.png", "category": "data", "url": "https://messari.io"},
    {"id": "data6", "name": "Arkham", "desc": "链上数据分析平台", "icon": "https://cdn-img.panewslab.com/panews/2023/07/18/images/5Gm6xFLylY.png", "category": "data", "url": "https://arkhamcrypto.com"},
    {"id": "data7", "name": "CryptoHunt", "desc": "用AI发现阿尔法机会", "icon": "https://cdn-img.panewslab.com/panews/2024/08/23/images/6TInb70jA0.png", "category": "data", "url": "https://www.cryptohunt.org"},
    {"id": "data8", "name": "RootData", "desc": "Web3资产数据平台", "icon": "https://cdn-img.panewslab.com/panews/2024/04/12/images/254ph0mU4c.png", "category": "data", "url": "https://www.rootdata.com"},
    {"id": "data9", "name": "CryptoQuant", "desc": "综合链上交易数据指标", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/TPv5o4a6yH.png", "category": "data", "url": "https://cryptoquant.com"},
    {"id": "data10", "name": "CoinMarketCap", "desc": "行情数据网站", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/09mhn7bEr0.png", "category": "data", "url": "https://coinmarketcap.com"},
    {"id": "data11", "name": "CoinGecko", "desc": "行情数据网站", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/m066wTc8Y4.png", "category": "data", "url": "https://coingecko.com"},
    {"id": "data12", "name": "L2BEAT", "desc": "Layer2综合数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/eu5DC40U5Z.png", "category": "data", "url": "https://l2beat.com"},
    {"id": "data13", "name": "Orbiter", "desc": "Layer2综合数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/Li5vfqeQ24.png", "category": "data", "url": "https://www.orbiter.finance"},
    {"id": "data14", "name": "CryptoCompare", "desc": "加密市场数据即API", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/ed5AGjP98a.png", "category": "data", "url": "https://www.cryptocompare.com"},
    {"id": "data15", "name": "Mytoken", "desc": "一站式数字资产行情资讯平台", "icon": "https://cdn-img.panewslab.com/panews/2025/03/21/images/64Tf7662e6.png", "category": "data", "url": "https://www.mytoken.com"},
    {"id": "data16", "name": "TradingView", "desc": "专业行情分析工具", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/Uwy8UWpZm8.jpg", "category": "data", "url": "https://tradingview.com"},
    {"id": "data17", "name": "Intotheblock", "desc": "综合数据指标和分析", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/VQH376slL0.png", "category": "data", "url": "https://intotheblock.com"},
    {"id": "data18", "name": "CryptoRank", "desc": "ICO/IEO/IDO信息和回报率", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/o2ERRGOto3.png", "category": "data", "url": "https://cryptorank.io"},
    {"id": "data19", "name": "santiment", "desc": "数据可视化平台", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/r80nw0jvJl.png", "category": "data", "url": "https://app.santiment.net"},
    {"id": "data20", "name": "Woobull", "desc": "Woo的比特币指标", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/1CtbA7W2zv.png", "category": "data", "url": "https://woobull.com"},
    {"id": "data21", "name": "Ahr999", "desc": "9神比特币定投和抄底指标", "icon": "https://cdn-img.panewslab.com/panews/2022/09/05/images/0Da8z1RorE.png", "category": "data", "url": "https://ndf.cloud"},
    {"id": "data22", "name": "JieData", "desc": "链上异动地址锁定", "icon": "https://cdn-img.panewslab.com/panews/2022/12/09/images/2y6RAB14F6.png", "category": "data", "url": "https://www.jiedata.io"},
    {"id": "data23", "name": "DexCheck", "desc": "AI增强链上分析工具", "icon": "https://cdn-img.panewslab.com/panews/2023/05/06/images/53O7ozK9uV.jpg", "category": "data", "url": "https://dex.check"},
    {"id": "data24", "name": "DEX SCREENER", "desc": "可视化DEX聚合平台", "icon": "https://cdn-img.panewslab.com/panews/2023/05/06/images/8ijzi8v1gY.jpg", "category": "data", "url": "https://www.dexscreener.com"},
    {"id": "data25", "name": "bubblemaps", "desc": "Token持仓分布", "icon": "https://cdn-img.panewslab.com/panews/2023/05/06/images/T1SP0w4q2q.jpg", "category": "data", "url": "https://bubblemaps.io"},
    {"id": "data26", "name": "HONEYPOT", "desc": "貔貅项目检测", "icon": "https://cdn-img.panewslab.com/panews/2023/05/06/images/7Pl2Yf682l.jpg", "category": "data", "url": "https://honeypot.is"},

    # DeFi 工具
    {"id": "defi1", "name": "DeFi LIama", "desc": "全链DeFi数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/2Z8b5Iq1UV.png", "category": "defi", "url": "https://defillama.com"},
    {"id": "defi2", "name": "DeFiPulse", "desc": "以太坊DeFi数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/9KgW6Dyj66.png", "category": "defi", "url": "https://www.defipulse.com"},
    {"id": "defi3", "name": "DEXTools", "desc": "DEX行情", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/35xm459EAJ.png", "category": "defi", "url": "https://www.dextools.io"},
    {"id": "defi4", "name": "DeFieye", "desc": "跨链桥比较", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/AN4Vrr82BI.png", "category": "defi", "url": "https://www.defieye.io"},
    {"id": "defi5", "name": "revert", "desc": "跟踪无常损失和收益", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/H49tk0F9Lv.png", "category": "defi", "url": "https://www.revert.finance"},
    {"id": "defi6", "name": "vfat", "desc": "DeFi挖矿收益查询", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/J4ILJI7g17.png", "category": "defi", "url": "https://vfat.tools"},
    {"id": "defi7", "name": "DeFi Rate", "desc": "CeFi和DeFi平台存款和借贷利率", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/0a1HCWY6W2.png", "category": "defi", "url": "https://www.defirate.com"},
    {"id": "defi8", "name": "Staking Rewards", "desc": "质押数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/0b41csS6jc.png", "category": "defi", "url": "https://www.stakingrewards.com"},
    {"id": "defi9", "name": "RWA.XYZ", "desc": "真实世界资产项目数据", "icon": "https://cdn-img.panewslab.com/panews/2023/04/21/images/lU1xoZ7WKL.jpg", "category": "defi", "url": "https://rwa.xyz"},

    # NFT 工具
    {"id": "nft1", "name": "OpenSea", "desc": "最大的NFT交易平台", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/031EM3gg2l.png", "category": "nft", "url": "https://opensea.io"},
    {"id": "nft2", "name": "NFTSCAN", "desc": "NFT浏览器和数据分析平台", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/49sal0F93V.png", "category": "nft", "url": "https://nftscan.com"},
    {"id": "nft3", "name": "NFTGO", "desc": "排行、稀有度、巨鲸追踪等数据平台", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/shbbkqOsm1.png", "category": "nft", "url": "https://nftgo.io"},
    {"id": "nft4", "name": "AlienSwap", "desc": "NFT市场和聚合器", "icon": "https://cdn-img.panewslab.com/panews/2023/05/10/images/Q81jmJPSYP.jpg", "category": "nft", "url": "https://alienswap.xyz"},
    {"id": "nft5", "name": "CryptoSlam", "desc": "NFT数据聚合器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/NWufdh8W9r.png", "category": "nft", "url": "https://www.cryptoslam.io"},
    {"id": "nft6", "name": "NFTNerds", "desc": "NFT交易信息", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/866f81HzaF.png", "category": "nft", "url": "https://nftnerds.com"},
    {"id": "nft7", "name": "Flips", "desc": "NFT历史数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/eM32E7HYjM.png", "category": "nft", "url": "https://flips.app"},
    {"id": "nft8", "name": "NFTCalendar", "desc": "NFT发行日历", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/X44d6DP6Kk.png", "category": "nft", "url": "https://nftcalendar.io"},
    {"id": "nft9", "name": "NFTTrack", "desc": "追踪NFT巨鲸", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/48O9xl28oL.png", "category": "nft", "url": "https://nfttrack.io"},
    {"id": "nft10", "name": "Degenmint", "desc": "铸造实时监控工具", "icon": "https://cdn-img.panewslab.com/panews/2022/10/11/images/QqWuiRv4Pk.jpg", "category": "nft", "url": "https://degenmint.xyz"},
    {"id": "nft11", "name": "Metasniper", "desc": "NFT自动化Bot", "icon": "https://cdn-img.panewslab.com/panews/2022/10/11/images/gEd20YNBSD.jpg", "category": "nft", "url": "https://metasniper.com"},
    {"id": "nft12", "name": "Nftinspect", "desc": "PFP推特用户实用度", "icon": "https://cdn-img.panewslab.com/panews/2022/10/11/images/9IXrj78Omo.jpg", "category": "nft", "url": "https://nftinspect.io"},

    # DAO 工具
    {"id": "dao1", "name": "Deep DAO", "desc": "DAO相关数据统计", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/VS92OuBbxS.jpg", "category": "dao", "url": "https://deepdao.io"},
    {"id": "dao2", "name": "Snapshot", "desc": "投票治理", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/549AzSwlV0.jpg", "category": "dao", "url": "https://snapshot.org"},
    {"id": "dao3", "name": "Tally", "desc": "投票和治理分析", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/Ir8k3hP40G.jpg", "category": "dao", "url": "https://www.withtally.com"},
    {"id": "dao4", "name": "Juice Box", "desc": "DAO融资", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/xZ1C58MEX0.jpg", "category": "dao", "url": "https://juicebox.money"},
    {"id": "dao5", "name": "DaoHaus", "desc": "无代码启动DAO的平台", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/1WPQsFfn8E.jpg", "category": "dao", "url": "https://daohaus.club"},
    {"id": "dao6", "name": "Syndicate", "desc": "创建投资型DAO", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/WK49HEXzo8.jpg", "category": "dao", "url": "https://syndicate.io"},

    # DApp 工具
    {"id": "dapp1", "name": "DAppRadar", "desc": "综合类DApp数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/UfWm26PDjo.jpg", "category": "dapp", "url": "https://dappradar.com"},
    {"id": "dapp2", "name": "Play to Earn", "desc": "链游排行", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/m7T6XCrHzK.jpg", "category": "dapp", "url": "https://playtoearn.net"},

    # 空投工具
    {"id": "airdrop1", "name": "Defi Llama", "desc": "defillama", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/9m28cuE0DC.jpg", "category": "airdrop", "url": "https://defillama.com/airdrops"},
    {"id": "airdrop2", "name": "Earnfi", "desc": "个人地址空投查询", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/VGy7356eDN.jpg", "category": "airdrop", "url": "https://earnfi.com"},
    {"id": "airdrop3", "name": "DropsEarn", "desc": "完成任务瓜分空投", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/N304y380gu.jpg", "category": "airdrop", "url": "https://dropsearn.com"},
    {"id": "airdrop4", "name": "TaskOn", "desc": "营销运营任务协作平台", "icon": "https://cdn-img.panewslab.com/panews/2023/02/15/images/26lyrc0ED0.jpg", "category": "airdrop", "url": "https://www.taskon.xyz"},

    # 矿业工具
    {"id": "mining1", "name": "BitInfoCharts", "desc": "挖矿难度/巨鲸排行等综合数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/5HRd8pX5Pj.jpg", "category": "mining", "url": "https://bitinfocharts.com"},
    {"id": "mining2", "name": "Coin Dance", "desc": "综合比特币数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/G1piT9xbIV.jpg", "category": "mining", "url": "https://coin.dance"},
    {"id": "mining3", "name": "f2pool", "desc": "比特币矿池、矿机数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/2y00FU2bK7.jpg", "category": "mining", "url": "https://www.f2pool.com"},
    {"id": "mining4", "name": "CBECI", "desc": "比特币电力消耗统计", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/rCX2tD1k42.jpg", "category": "mining", "url": "https://cbeci.info"},
    {"id": "mining5", "name": "Digicomomist", "desc": "比特币能源消耗数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/528865fKkF.jpg", "category": "mining", "url": "https://digiconomist.net"},
    {"id": "mining6", "name": "1ML", "desc": "比特币闪电网络数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/y30I4KxZ9o.jpg", "category": "mining", "url": "https://1ml.com"},
    {"id": "mining7", "name": "BitcoinVisuals", "desc": "比特币闪电网络数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/Fap6XNoLo2.jpg", "category": "mining", "url": "https://bitcoinvisuals.com"},
    {"id": "mining8", "name": "51%攻击", "desc": "51攻击花费数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/LvmnF6sX85.jpg", "category": "mining", "url": "https://crypto51.com"},
    {"id": "mining9", "name": "BitNodes", "desc": "比特币节点数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/oNonK00950.jpg", "category": "mining", "url": "https://bitnodes.io"},

    # 钱包工具
    {"id": "wallet1", "name": "MetaMask", "desc": "Web3钱包", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/Va6MGXt3Ka.jpg", "category": "wallet", "url": "https://metamask.io"},
    {"id": "wallet2", "name": "Ledger", "desc": "硬件钱包", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/p0ob6JeWSg.jpg", "category": "wallet", "url": "https://www.ledger.com"},
    {"id": "wallet3", "name": "Trezor", "desc": "硬件钱包", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/81n3o9HDW0.jpg", "category": "wallet", "url": "https://trezor.io"},
    {"id": "wallet4", "name": "imKey", "desc": "硬件钱包", "icon": "https://cdn-img.panewslab.com/panews/2022/11/03/images/218VT77t1D.jpg", "category": "wallet", "url": "https://imkey.im"},
    {"id": "wallet5", "name": "OneKey", "desc": "全开源硬件钱包", "icon": "https://cdn-img.panewslab.com/panews/2022/10/09/images/S54t8kg5oF.png", "category": "wallet", "url": "https://onekey.com"},
    {"id": "wallet6", "name": "KeyPal", "desc": "双芯片硬件钱包", "icon": "https://cdn-img.panewslab.com/panews/2022/10/10/images/LSG2fa30O2.png", "category": "wallet", "url": "https://keypal.io"},
    {"id": "wallet7", "name": "ethos", "desc": "Sui生态钱包", "icon": "https://cdn-img.panewslab.com/panews/2023/05/06/images/598TApeGDh.jpg", "category": "wallet", "url": "https://ethoswallet.xyz"},
    {"id": "wallet8", "name": "DeBank", "desc": "资产查看和管理", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/m2Z46O6191.jpg", "category": "wallet", "url": "https://debank.com"},
    {"id": "wallet9", "name": "Zapper", "desc": "资产查看和管理", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/cPJkf60OhW.jpg", "category": "wallet", "url": "https://zapper.xyz"},
    {"id": "wallet10", "name": "Zerion", "desc": "资产查看和管理", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/qw1hHVAzA2.jpg", "category": "wallet", "url": "https://zerion.io"},
    {"id": "wallet11", "name": "Revoke", "desc": "授权检查", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/7haG8cpat7.jpg", "category": "wallet", "url": "https://revoke.cash"},

    # 其他工具
    {"id": "other1", "name": "Umy.com", "desc": "基于Web3的旅行平台", "icon": "https://cdn-img.panewslab.com/panews/2024/12/03/images/j83k2IbPfj.png", "category": "other", "url": "https://umy.com"},
    {"id": "other2", "name": "Secure3", "desc": "智能竞赛安全审计平台", "icon": "https://cdn-img.panewslab.com/panews/2024/04/03/images/xr0Lw658fE.png", "category": "other", "url": "https://secure3.io"},
    {"id": "other3", "name": "Bit Jungle", "desc": "领先的区块链安全公司", "icon": "https://cdn-img.panewslab.com/panews/2023/08/23/images/kpYYcoh3e1.png", "category": "other", "url": "https://bitjungle.com"},
    {"id": "other4", "name": "Blocknative", "desc": "Gas和MemPool数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/rfvmUI2st3.jpg", "category": "other", "url": "https://www.blocknative.com"},
    {"id": "other5", "name": "Ultra Sound", "desc": "以太坊销毁数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/15DpHRM1Yg.jpg", "category": "other", "url": "https://ultrasound.money"},
    {"id": "other6", "name": "MEV-Explore", "desc": "以太坊上MEV活动查询", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/PMJtvj7IHE.jpg", "category": "other", "url": "https://explore.dune.com"},
    {"id": "other7", "name": "Token Terminal", "desc": "协议收入指标", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/D8gpFAvJ0f.jpg", "category": "other", "url": "https://tokenterminal.com"},
    {"id": "other8", "name": "Crypto Fees", "desc": "加密项目费用", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/3Y7yca38w5.jpg", "category": "other", "url": "https://cryptofees.info"},
    {"id": "other9", "name": "dcaBTC", "desc": "比特币投资、定投计算器", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/NALAu4q5e3.jpg", "category": "other", "url": "https://dcabtc.com"},
    {"id": "other10", "name": "Bitcoinity", "desc": "比特币交易数据", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/7C5x1P7zsB.jpg", "category": "other", "url": "https://bitcoinity.org"},
    {"id": "other11", "name": "Chain Broker", "desc": "融资信息/VC回报率和排名", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/vHSMWABDBx.jpg", "category": "other", "url": "https://chainbroker.io"},
    {"id": "other12", "name": "Dove Metrics", "desc": "融资信息汇总", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/2wh6HdWqKl.jpg", "category": "other", "url": "https://dovemetrics.xyz"},
    {"id": "other13", "name": "ICO Analytics", "desc": "提供ICO日历", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/7N6ihf9hwe.jpg", "category": "other", "url": "https://icoranalytics.io"},
    {"id": "other14", "name": "Infinite Market Cap", "desc": "加密货币和传统资产的市值排名", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/27y6l5zic5.jpg", "category": "other", "url": "https://infinite.marketcap"},
    {"id": "other15", "name": "LunarCrush", "desc": "社交媒体加密信息监测", "icon": "https://cdn-img.panewslab.com/panews/2024/12/26/images/FJB5A8VPW3.jpg", "category": "other", "url": "https://lunacrush.com"},
    {"id": "other16", "name": "TokenUnlocks", "desc": "知名项目代币解锁数据", "icon": "https://cdn-img.panewslab.com/panews/2022/11/04/images/y5w1gO6w7f.jpg", "category": "other", "url": "https://token.unlocks.app"},
]

def download_icon(url: str, tool_id: str, tool_name: str) -> str:
    """下载图标并返回本地路径"""
    try:
        # 从URL提取文件扩展名
        parsed = urlparse(url)
        ext = os.path.splitext(parsed.path)[1] or ".png"

        # 本地文件名（使用安全的文件名）
        safe_name = tool_name.replace('/', '-').replace(' ', '-').replace('\'', '').replace(':', '-').replace('?', '')[:50]
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
        print(f"  ❌ {tool_name}: {str(e)[:50]}")
        return "/logo.png"  # 失败时使用默认logo

def main():
    print("🚀 开始导入所有 PANews 工具...")
    print(f"📁 图标保存目录: {ICONS_DIR}")
    print(f"🔧 总计 {len(ALL_PANEWS_TOOLS)} 个工具")
    print(f"\n📥 开始下载图标...\n")

    # 下载图标并更新路径
    success_count = 0
    fail_count = 0
    for i, tool in enumerate(ALL_PANEWS_TOOLS, 1):
        print(f"[{i}/{len(ALL_PANEWS_TOOLS)}]", end=" ")
        tool["icon"] = download_icon(tool["icon"], tool["id"], tool["name"])
        if not tool["icon"].endswith("logo.png"):
            success_count += 1
        else:
            fail_count += 1
        time.sleep(0.05)  # 避免请求过快

    # 保存 JSON 数据
    output_file = BASE_DIR / "panews_all_tools.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(ALL_PANEWS_TOOLS, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 数据提取完成！")
    print(f"📊 成功下载: {success_count}/{len(ALL_PANEWS_TOOLS)} 个图标")
    print(f"❌ 下载失败: {fail_count} 个（使用默认logo）")
    print(f"💾 数据已保存到: {output_file}")
    print(f"\n📝 下一步:")
    print(f"   1. 查看数据: cat {output_file}")
    print(f"   2. 更新 mockData.ts")

if __name__ == "__main__":
    main()
