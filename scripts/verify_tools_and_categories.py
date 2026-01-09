#!/usr/bin/env python3
"""
全面检查每个分类下的工具是否正确
"""
import re
import os

# 读取mockData.ts
with open('/Users/jim/Desktop/Claude Code/DAO3/src/data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取分类定义
categories_match = re.search(r'export const mockCategories.*?=\s*\[(.*?)\];', content, re.DOTALL)
if categories_match:
    categories_text = categories_match.group(1)
    categories = re.findall(r'\{[^}]*name:\s*\'([^\']+)\'[^}]*id:\s*\'([^\']+)\'[^}]*logo:\s*\'([^\']+)\'[^}]*\}', categories_text)

    print("=" * 80)
    print("分类列表及其logo检查")
    print("=" * 80)

    category_map = {}
    for name, cat_id, logo in categories:
        category_map[cat_id] = {'name': name, 'logo': logo}

        # 检查logo文件是否存在
        logo_path = f"/Users/jim/Desktop/Claude Code/DAO3/public{logo}"
        exists = os.path.exists(logo_path)
        status = "✅" if exists else "❌"

        print(f"{status} ID:{cat_id:3s} | {name:15s} | {logo}")

# 提取所有工具
tools_match = re.search(r'export const mockTools.*?=\s*\[(.*?)\];', content, re.DOTALL)
if tools_match:
    tools_text = tools_match.group(1)
    tools = re.finditer(r'\{[^}]*name:\s*\'([^\']+)\'[^}]*icon:\s*\'([^\']+)\'[^}]*category:\s*\'([^\']+)\'[^}]*\}', tools_text)

    print("\n" + "=" * 80)
    print("工具分类分布统计")
    print("=" * 80)

    category_tools = {}
    missing_icons = []

    for tool_match in tools:
        name = tool_match.group(1)
        icon = tool_match.group(2)
        category = tool_match.group(3)

        if category not in category_tools:
            category_tools[category] = []
        category_tools[category].append((name, icon))

        # 检查icon文件是否存在
        icon_path = f"/Users/jim/Desktop/Claude Code/DAO3/public{icon}"
        if not os.path.exists(icon_path):
            missing_icons.append((name, icon))

    # 按分类ID排序显示
    for cat_id in sorted(category_tools.keys(), key=lambda x: (len(x), x)):
        tools = category_tools[cat_id]
        cat_name = category_map.get(cat_id, {}).get('name', '未知')

        print(f"\n📁 {cat_name} (ID: {cat_id}) - 共 {len(tools)} 个工具")
        print("-" * 80)

        # 显示前5个工具作为示例
        for i, (name, icon) in enumerate(tools[:5], 1):
            icon_exists = os.path.exists(f"/Users/jim/Desktop/Claude Code/DAO3/public{icon}")
            status = "✅" if icon_exists else "❌"
            print(f"  {status} {i:2d}. {name:40s} | {icon}")

        if len(tools) > 5:
            print(f"  ... 还有 {len(tools) - 5} 个工具")

    print("\n" + "=" * 80)
    print(f"缺失的icon文件 (共 {len(missing_icons)} 个)")
    print("=" * 80)

    if missing_icons:
        for name, icon in missing_icons[:20]:  # 只显示前20个
            print(f"❌ {name:40s} | {icon}")
        if len(missing_icons) > 20:
            print(f"... 还有 {len(missing_icons) - 20} 个缺失的icon")
    else:
        print("✅ 所有工具的icon都存在！")

print("\n" + "=" * 80)
print("总结")
print("=" * 80)
print(f"总分类数: {len(category_map)}")
print(f"总工具数: {sum(len(tools) for tools in category_tools.values())}")
print(f"缺失icon数: {len(missing_icons)}")
