#!/usr/bin/env python3
"""
详细检查每个分类下的工具是否和PANews一致
"""
import re
import json

# 读取mockData.ts
with open('/Users/jim/Desktop/Claude Code/DAO3/src/data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取分类
category_pattern = r"\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*slug:\s*'[^']+',\s*order:\s*\d+,\s*logo:\s*'([^']+)'\s*\}"
categories = re.findall(category_pattern, content)

category_map = {}
for cat_id, name, logo in categories:
    category_map[cat_id] = {'name': name, 'logo': logo}

# 提取工具
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

# PANews工具列表（按分类）
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
print("本地工具与PANews详细对比 - 检查分类是否正确")
print("=" * 100)

# 检查每个分类
for cat_id, cat_info in sorted(category_map.items(), key=lambda x: int(x[0]) if x[0].isdigit() else 999):
    cat_name = cat_info['name']

    # 找到对应的PANews分类
    panews_category_name = None
    for pn_cat in panews_tools.keys():
        if pn_cat in cat_name or cat_name in pn_cat:
            panews_category_name = pn_cat
            break

    if not panews_category_name:
        print(f"\n❌ 未找到PANews对应分类: {cat_name}")
        continue

    panews_tools_list = panews_tools[panews_category_name]

    # 获取本地该分类的工具
    local_category_tools = [(k, v) for k, v in local_tools.items() if v['category'] == cat_id]
    local_tool_names = [v['name'] for k, v in local_category_tools]

    print(f"\n【{cat_name}】(ID: {cat_id})")
    print(f"PANews对应分类: {panews_category_name}")
    print("-" * 100)

    # 检查PANews有但本地没有的工具
    missing_tools = []
    wrong_category_tools = []

    for panews_tool in panews_tools_list:
        panews_tool_lower = panews_tool.lower()

        # 检查本地是否存在
        found = False
        correct_category = True

        for local_name_lower, local_tool in local_tools.items():
            if local_name_lower == panews_tool_lower:
                found = True
                # 检查分类是否正确
                if local_tool['category'] != cat_id:
                    correct_category = False
                    wrong_category_tools.append({
                        'name': panews_tool,
                        'current_category': category_map.get(local_tool['category'], {}).get('name', '未知'),
                        'current_cat_id': local_tool['category'],
                        'should_be': cat_name
                    })
                break

        if not found:
            missing_tools.append(panews_tool)
        elif not correct_category:
            pass  # 已经在wrong_category_tools中

    # 检查本地有但PANews没有的工具
    extra_tools = []
    for local_name in local_tool_names:
        if local_name not in panews_tools_list:
            extra_tools.append(local_name)

    print(f"本地工具数: {len(local_tool_names)}")
    print(f"PANews工具数: {len(panews_tools_list)}")

    if missing_tools:
        print(f"\n❌ 缺失工具 ({len(missing_tools)}个):")
        for tool in missing_tools[:10]:
            print(f"   • {tool}")
        if len(missing_tools) > 10:
            print(f"   ... 还有 {len(missing_tools) - 10} 个")

    if wrong_category_tools:
        print(f"\n⚠️  分类错误 ({len(wrong_category_tools)}个):")
        for tool in wrong_category_tools[:10]:
            print(f"   • {tool['name']}: 应在【{tool['should_be']}】，实际在【{tool['current_category']}】(ID: {tool['current_cat_id']})")
        if len(wrong_category_tools) > 10:
            print(f"   ... 还有 {len(wrong_category_tools) - 10} 个")

    if extra_tools:
        print(f"\n➕ 额外工具 ({len(extra_tools)}个):")
        for tool in extra_tools[:10]:
            print(f"   • {tool}")
        if len(extra_tools) > 10:
            print(f"   ... 还有 {len(extra_tools) - 10} 个")

    if not missing_tools and not wrong_category_tools and not extra_tools:
        print("\n✅ 完全一致！")

print("\n" + "=" * 100)
print("汇总统计")
print("=" * 100)

total_missing = 0
total_wrong = 0
total_extra = 0

for cat_id, cat_info in sorted(category_map.items(), key=lambda x: int(x[0]) if x[0].isdigit() else 999):
    cat_name = cat_info['name']

    # 找到对应的PANews分类
    panews_category_name = None
    for pn_cat in panews_tools.keys():
        if pn_cat in cat_name or cat_name in pn_cat:
            panews_category_name = pn_cat
            break

    if not panews_category_name:
        continue

    panews_tools_list = panews_tools[panews_category_name]
    local_category_tools = [(k, v) for k, v in local_tools.items() if v['category'] == cat_id]
    local_tool_names = [v['name'] for k, v in local_category_tools]

    # 统计
    for panews_tool in panews_tools_list:
        panews_tool_lower = panews_tool.lower()
        found = False
        correct_category = True

        for local_name_lower, local_tool in local_tools.items():
            if local_name_lower == panews_tool_lower:
                found = True
                if local_tool['category'] != cat_id:
                    correct_category = False
                break

        if not found:
            total_missing += 1
        elif not correct_category:
            total_wrong += 1

    for local_name in local_tool_names:
        if local_name not in panews_tools_list:
            total_extra += 1

print(f"总缺失工具数: {total_missing}")
print(f"分类错误工具数: {total_wrong}")
print(f"额外多余工具数: {total_extra}")
print(f"总差异: {total_missing + total_wrong + total_extra}")
