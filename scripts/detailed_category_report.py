#!/usr/bin/env python3
import re
import os

with open('/Users/jim/Desktop/Claude Code/DAO3/src/data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取分类
category_pattern = r"\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*slug:\s*'[^']+',\s*order:\s*\d+,\s*logo:\s*'([^']+)'\s*\}"
categories = re.findall(category_pattern, content)

category_map = {}
for cat_id, name, logo in categories:
    category_map[cat_id] = {'name': name, 'logo': logo}

# 提取工具详细信息
tool_pattern = r"\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*description:\s*'([^']*)',\s*icon:\s*'([^']+)',\s*url:\s*'[^']+',\s*category:\s*'([^']+)'"
tools = re.findall(tool_pattern, content)

print("=" * 90)
print("详细分类-工具验证报告")
print("=" * 90)

# 按分类显示工具
for cat_id in sorted(category_map.keys(), key=lambda x: int(x) if x.isdigit() else 999):
    cat_info = category_map[cat_id]
    cat_name = cat_info['name']
    cat_logo = cat_info['logo']

    # 检查分类logo
    logo_path = f"/Users/jim/Desktop/Claude Code/DAO3/public{cat_logo}"
    logo_exists = os.path.exists(logo_path)
    logo_status = "✅" if logo_exists else "❌"

    # 获取该分类下的所有工具
    cat_tools = [(t[0], t[1], t[2], t[3]) for t in tools if t[4] == cat_id]

    print(f"\n{logo_status} 【{cat_name}】(ID: {cat_id}) - 共 {len(cat_tools)} 个工具")
    print("-" * 90)

    # 检查工具icon
    missing_icons = []
    for tool_id, tool_name, tool_desc, tool_icon in cat_tools:
        icon_path = f"/Users/jim/Desktop/Claude Code/DAO3/public{tool_icon}"
        if not os.path.exists(icon_path):
            missing_icons.append((tool_name, tool_icon))

    # 显示所有工具
    for i, (tool_id, tool_name, tool_desc, tool_icon) in enumerate(cat_tools, 1):
        icon_path = f"/Users/jim/Desktop/Claude Code/DAO3/public{tool_icon}"
        icon_exists = os.path.exists(icon_path)
        icon_status = "✅" if icon_exists else "❌"

        print(f"  {icon_status} {i:2d}. {tool_name:40s} | {tool_desc[:30]}")

    if missing_icons:
        print(f"\n  ⚠️  该分类下有 {len(missing_icons)} 个工具缺少icon:")
        for tool_name, tool_icon in missing_icons:
            print(f"     - {tool_name}: {tool_icon}")

print("\n" + "=" * 90)
print("总结")
print("=" * 90)

# 统计缺失的icon
all_missing = []
for tool_id, tool_name, tool_desc, tool_icon, cat_id in [(t[0], t[1], t[2], t[3], t[4]) for t in tools]:
    icon_path = f"/Users/jim/Desktop/Claude Code/DAO3/public{tool_icon}"
    if not os.path.exists(icon_path):
        all_missing.append((tool_name, tool_icon, cat_id))

print(f"总分类数: {len(category_map)}")
print(f"总工具数: {len(tools)}")
print(f"缺失icon的工具: {len(all_missing)}")

if all_missing:
    print(f"\n所有缺失icon的工具:")
    for tool_name, tool_icon, cat_id in all_missing:
        cat_name = category_map.get(cat_id, {}).get('name', '未知')
        print(f"  ❌ [{cat_name}] {tool_name}: {tool_icon}")
else:
    print(f"\n✅ 所有工具的icon都存在！")
