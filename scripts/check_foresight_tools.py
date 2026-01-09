#!/usr/bin/env python3
import re

with open('/Users/jim/Desktop/Claude Code/DAO3/src/data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

tool_names = re.findall(r"name: '([^']+)'", content)

foresight_tools = [
    ("NFTGo", "NFT数据分析"),
    ("Snapshot", "投票治理"),
    ("PlayToEarn", "GameFi趋势"),
    ("RabbitHole", "Web3任务平台"),
    ("DGG Tools", "NFT监控"),
    ("ChainEye", "跨链分析"),
]

print("=" * 70)
print("检查Foresight News工具在本地列表中的情况")
print("=" * 70)

missing_tools = []
existing_tools = []

for tool_name, description in foresight_tools:
    exists = any(tool_name.lower() in name.lower() for name in tool_names)
    
    if exists:
        existing_tools.append((tool_name, description))
        status = "✅ 已存在"
    else:
        missing_tools.append((tool_name, description))
        status = "❌ 缺失"
    
    print(f"{status} - {tool_name:15s} ({description})")

print("\n" + "=" * 70)
print(f"总计: {len(foresight_tools)} 个已知工具")
print(f"已存在: {len(existing_tools)} 个")
print(f"缺失: {len(missing_tools)} 个")
print("=" * 70)

if missing_tools:
    print("\n需要添加的工具:")
    for tool_name, description in missing_tools:
        print(f"  • {tool_name}: {description}")

print("\n" + "=" * 70)
print("我们的工具统计")
print("=" * 70)
print(f"工具总数: {len(tool_names)}")
print(f"分类数: 17")
