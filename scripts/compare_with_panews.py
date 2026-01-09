#!/usr/bin/env python3
"""
将本地工具与PANews进行对比，找出遗漏的工具
"""
import re
import json

# 读取mockData.ts
with open('/Users/jim/Desktop/Claude Code/DAO3/src/data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取工具 - 使用更宽松的模式
tool_pattern = r"\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*description:\s*'([^']*)',\s*icon:\s*'([^']+)',\s*url:\s*'([^']+)',\s*category:\s*'([^']+)'"
tools = re.findall(tool_pattern, content)

local_tools = {}
for tool_id, name, description, icon, url, category in tools:
    local_tools[name.lower()] = {
        'id': tool_id,
        'name': name,
        'description': description,
        'icon': icon,
        'url': url,
        'category': category
    }

# PANews工具列表（从网页抓取的内容中提取）
panews_tools = {
    '热门': [
        '推特KOL列表', 'GMGN.Ai', 'Etherscan', 'MetaMask', 'DeFi LIama',
        'CoinMarketCap', 'Dune', 'Debank', 'Zcash Dashboard', 'CoinGecko',
        'Ultra Sound Money', '恐惧与贪婪指数', 'TradingView', 'CoinAnk', 'growthepie', 'Nansen'
    ],
    'DAT数据看板': [
        'Blockworks', 'DELPHI DIGITAL', 'DefiLlama', 'THE BLOCK', 'Crypto Stock Tracker',
        'Crypto Treasuries', 'Bitcoin Treasuries', 'coingecko', 'CompaniesMarketCap', 'SoSoValue',
        'bitbo', 'newhedge', 'Strategic ETH Reserve', 'Finder', 'coingecko', 'BBX'
    ],
    'AI Agent': [
        'Act I : The AI Prophecy', 'AGENCY', 'AI16Z', 'aiPool', 'AIXBT', 'Alchemist AI',
        'Anon', 'arc', 'AVA', 'Clanker', 'Cookie', 'Dolion', 'DUNA', 'Eilza', 'Fartcoin',
        'G.A.M.E', 'Goatseus Maximus', 'Griffain', 'LEXICON', 'Luminous', 'Luna', 'MAX',
        'Neur', 'SPORE', 'SwarmNode.ai', 'swarms', 'The Hive', 'VaderAI', 'Virtuals Protocol',
        'vvaifu.fun', 'YNE', 'ZAILGO'
    ],
    'Meme常用工具': [
        'GMGN.Ai', 'pump.fun', 'Phantom', 'pump.news', 'Cryptohunt', 'DEX Screener',
        'Bubblemaps', 'Birdeye', 'DEXTools', 'Ave.ai', 'HolderScan', 'Suiscan', 'SolanaFM',
        'Vybe Network', 'Alphatrace', 'Pepe Boost', 'Debank', 'TweetScout', 'TwitterScore',
        'Arkham', 'GoPlus Security', 'TokenSniffer', 'Honeypot.is', 'Rugcheck', 'Solsniffer',
        'Zapper', 'TrustWallet', 'OKXWallet', 'BullX', 'Jupiter', 'Raydium', 'Hop', 'Cetus',
        'Turbos Finance', 'DeepBook Protocol on Sui', 'BONKbot', 'Maestro', 'Trojan',
        'Banana Gun', 'SolTradingBot', 'Unibot', 'SUIBABot', 'Move pump', 'Logearn', 'Dbotx',
        'Photon'
    ],
    '区块浏览器': [
        'Etherscan', 'Blockchair', 'Blockchain.com', 'OKLINK', 'Blockscout', 'OP浏览器',
        'Arbiscan', 'BscScan', 'polygonscan', 'Solscan', 'Subscan', 'TRONSCAN', 'AVASCAN',
        'FilScan', 'GnosisScan', 'NearScan', 'CronosScan', 'MintScan', 'Aptos', 'Tokenview',
        'Sui'
    ],
    '综合数据': [
        'Glassnode', 'Dune', 'Nansen', 'GeckoTerminal', 'Messari', 'Arkham', 'CryptoHunt',
        'RootData', 'CryptoQuant', 'CoinMarketCap', 'CoinGecko', 'L2BEAT', 'Orbiter',
        'CryptoCompare', 'Mytoken', 'TradingView', 'Intotheblock', 'CryptoRank', 'santiment',
        'Woobull', 'Ahr999', 'JieData', 'DexCheck', 'DEX SCREENER', 'bubblemaps', 'HONEYPOT'
    ],
    'BTC生态工具': [
        'Unisat', 'Xverse App', 'Hiro Wallet', 'Sparrow Wallet', 'Alby Wallet',
        'OKX Web3 Wallet', 'Ordinals Wallet', 'ME on BTC', 'IDclub', 'BestlnSlotXYZ',
        'Mempool', 'Ordinal Explor', 'BRC-20.io', 'TokenPocket', 'GeniiData', 'SatoSea',
        'OrdinalsBot', 'DotSwap', 'Magic Eden', 'Saturn', 'SatsX', 'Rune Bitcoin',
        'Meta Runes', 'Ordbit', 'Liquidium', 'Runessance', 'Runes Legacy', 'OrdiScan',
        'Ord.io', 'RuneMine', 'BitX'
    ],
    'CeFi': [
        'Datamish', 'Coinglass', 'Bitfinex', 'AICoin'
    ],
    'DeFi': [
        'DeFi LIama', 'DeFiPulse', 'DEXTools', 'DeFieye', 'revert', 'vfat', 'DeFi Rate',
        'Staking Rewards', 'RWA.XYZ'
    ],
    'NFT': [
        'OpenSea', 'NFTSCAN', 'NFTGO', 'AlienSwap', 'CryptoSlam', 'NFTNerds', 'Flips',
        'NFTCalendar', 'NFTTrack', 'Degenmint', 'Metasniper', 'Nftinspect'
    ],
    'DAO': [
        'Deep DAO', 'Snapshot', 'Tally', 'Juice Box', 'DaoHaus', 'Syndicate'
    ],
    'DApp': [
        'DAppRadar', 'Play to Earn'
    ],
    '空投': [
        'Defi Llama', 'Earnfi', 'DropsEarn', 'TaskOn'
    ],
    '矿业': [
        'BitInfoCharts', 'Coin Dance', 'f2pool', 'CBECI', 'Digicomomist', '1ML',
        'BitcoinVisuals', '51%攻击', 'BitNodes'
    ],
    '钱包和授权管理': [
        'MetaMask', 'Ledger', 'Trezor', 'imKey', 'OneKey', 'KeyPal', 'ethos', 'DeBank',
        'Zapper', 'Zerion', 'Revoke'
    ],
    '其他': [
        'Umy.com', 'Secure3', 'Bit Jungle', 'Blocknative', 'Ultra Sound', 'MEV-Explore',
        'Token Terminal', 'Crypto Fees', 'dcaBTC', 'Bitcoinity', 'Chain Broker',
        'Dove Metrics', 'ICO Analytics', 'Infinite Market Cap', 'LunarCrush', 'TokenUnlocks'
    ]
}

print("=" * 100)
print("本地工具与PANews对比报告")
print("=" * 100)

missing_tools = {}
found_tools = {}

for category, tools_list in panews_tools.items():
    category_missing = []
    category_found = []

    for tool in tools_list:
        tool_lower = tool.lower()
        if tool_lower in local_tools:
            category_found.append(tool)
        else:
            category_missing.append(tool)

    missing_tools[category] = category_missing
    found_tools[category] = category_found

    print(f"\n【{category}】")
    print(f"  ✅ 已有: {len(category_found)}/{len(tools_list)}")
    print(f"  ❌ 缺失: {len(category_missing)}/{len(tools_list)}")

    if category_missing and len(category_missing) <= 10:
        print(f"  缺失工具: {', '.join(category_missing[:10])}")
    elif category_missing:
        print(f"  缺失工具: {', '.join(category_missing[:10])}... 还有 {len(category_missing) - 10} 个")

print("\n" + "=" * 100)
print("汇总")
print("=" * 100)

total_panews = sum(len(tools) for tools in panews_tools.values())
total_found = sum(len(found) for found in found_tools.values())
total_missing = sum(len(missing) for missing in missing_tools.values())

print(f"\nPANews总工具数: {total_panews}")
print(f"本地已有工具数: {total_found} ({total_found*100//total_panews}%)")
print(f"缺失工具数: {total_missing} ({total_missing*100//total_panews}%)")

if total_missing > 0:
    print(f"\n所有缺失的工具 ({total_missing}个):")
    print("=" * 100)

    for category, tools_list in missing_tools.items():
        if tools_list:
            print(f"\n【{category}】 - {len(tools_list)}个")
            for i, tool in enumerate(tools_list, 1):
                print(f"  {i:2d}. {tool}")
