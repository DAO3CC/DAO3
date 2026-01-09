#!/usr/bin/env python3
"""
对比PANews工具和已知的Foresight News工具列表
"""

# 根据搜索结果，Foresight News工具页面的主要分类
foresight_categories = [
    "综合数据",
    "区块链浏览器",
    "DeFi Tools",
    "NFT Tools",
    "DAO Tools",
    "GameFi Tools",
    "DApp Tools",
    "Mining Tools",
    "衍生品",
    "生态汇总",
    "空投工具",
    "其他工具",
]

# 已知Foresight News提到但可能不在我们工具列表中的工具
foresight_tools = [
    ("NFTGo", "NFT数据分析"),
    ("Snapshot", "投票治理"),
    ("PlayToEarn", "GameFi趋势"),
    ("RabbitHole", "Web3任务平台"),
    ("DGG Tools", "NFT监控"),
    ("ChainEye", "跨链分析"),
]

print("=" * 60)
print("Foresight News 工具分类")
print("=" * 60)
for i, cat in enumerate(foresight_categories, 1):
    print(f"{i:2d}. {cat}")

print("\n" + "=" * 60)
print("已知Foresight News工具（需要检查是否在本地列表中）")
print("=" * 60)

for tool_name, description in foresight_tools:
    print(f"• {tool_name:15s} - {description}")

print("\n" + "=" * 60)
print("建议：")
print("=" * 60)
print("1. 手动访问 https://foresightnews.pro/tools")
print("2. 浏览各个分类")
print("3. 如果发现遗漏的工具，记录下工具名称")
print("4. 可以手动添加到 mockData.ts")
