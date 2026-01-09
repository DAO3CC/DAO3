#!/usr/bin/env python3
"""
修复工具分类：将BTC相关工具移到BTC生态，添加CeFi工具
"""
import re

# 读取文件
with open('/Users/jim/Desktop/Claude Code/DAO3/src/data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# BTC相关的工具名称
btc_tools = [
    'BitInfoCharts',
    'Coin Dance',
    'CBECI',
    'Digicomomist',
    'BitcoinVisuals',
    'Bitcoinity',
    '1ML',
    'Bitcoin Treasuries',
    'Crypto Stock Tracker',
]

# 为每个BTC工具修改分类
for tool_name in btc_tools:
    # 匹配模式：找到该工具的category字段并改为'15'
    pattern = f"(name: '{tool_name}'[^{{]*category:) '13'"
    replacement = r"\1 '15'"
    content = re.sub(pattern, replacement, content)

# 同时需要修改order号（BTC生态的order从200开始）
btc_order = 200
for tool_name in btc_tools:
    pattern = f"(name: '{tool_name}'[^{{]*order:) \\d+"
    replacement = f"\\1 {btc_order}"
    content = re.sub(pattern, replacement, content)
    btc_order += 1

# 添加一些CeFi工具（从数据类或钱包类中选择）
cefi_tools = [
    {
        'name': 'Blockchain.com',
        'original_id': 'exp3',
        'category': '7',
        'order': 220,
    },
    {
        'name': 'Blockchair',
        'original_id': 'exp2',
        'category': '7',
        'order': 221,
    },
    {
        'name': 'CoinMarketCap',
        'original_id': 't6',
        'category': '7',
        'order': 222,
    },
    {
        'name': 'CoinGecko',
        'original_id': 't10',
        'category': '7',
        'order': 223,
    },
]

# 修改CeFi工具的分类
for tool in cefi_tools:
    pattern = f"(name: '{tool['name']}'[^{{]*category:) '[^']*'"
    replacement = f"\\1 '{tool['category']}'"
    content = re.sub(pattern, replacement, content)

# 写回文件
with open('/Users/jim/Desktop/Claude Code/DAO3/src/data/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 分类修复完成！")
print(f"- 修改了 {len(btc_tools)} 个BTC工具到BTC生态分类")
print(f"- 修改了 {len(cefi_tools)} 个工具到CeFi分类")
