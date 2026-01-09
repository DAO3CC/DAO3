#!/usr/bin/env python3
import re
import os

# 读取文件
with open('/Users/jim/Desktop/Claude Code/DAO3/src/data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取分类
category_pattern = r"\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*slug:\s*'[^']+',\s*order:\s*\d+,\s*logo:\s*'([^']+)'\s*\}"
categories = re.findall(category_pattern, content)

print("=" * 80)
print("分类列表")
print("=" * 80)

category_map = {}
for cat_id, name, logo in categories:
    category_map[cat_id] = name
    logo_path = f"/Users/jim/Desktop/Claude Code/DAO3/public{logo}"
    exists = "✅" if os.path.exists(logo_path) else "❌"
    print(f"{exists} ID:{cat_id:3s} | {name:15s}")

# 提取工具 - 按分类统计
tool_pattern = r"\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*description:\s*'[^']*',\s*icon:\s*'([^']+)',\s*url:\s*'[^']+',\s*category:\s*'([^']+)'"
tools = re.findall(tool_pattern, content)

print("\n" + "=" * 80)
print("工具分类分布")
print("=" * 80)

category_tools = {}
for tool_id, name, icon, cat_id in tools:
    if cat_id not in category_tools:
        category_tools[cat_id] = []
    category_tools[cat_id].append(name)

# 按分类ID排序显示
for cat_id in sorted(category_map.keys()):
    cat_name = category_map[cat_id]
    tool_count = len(category_tools.get(cat_id, []))
    
    print(f"\n📁 {cat_name} (ID: {cat_id})")
    print(f"   工具数量: {tool_count}")

# 验证分类ID匹配
print("\n" + "=" * 80)
print("分类ID验证")
print("=" * 80)

for cat_id in sorted(category_map.keys()):
    cat_name = category_map[cat_id]
    if cat_id in category_tools:
        print(f"✅ ID {cat_id:3s} - {cat_name:15s}: {len(category_tools[cat_id])} 个工具")
    else:
        print(f"⚠️  ID {cat_id:3s} - {cat_name:15s}: 没有工具")

# 检查是否有工具使用了不存在的分类ID
print("\n" + "=" * 80)
print("检查无效的分类ID")
print("=" * 80)

invalid_found = False
for cat_id in category_tools.keys():
    if cat_id not in category_map:
        print(f"❌ 发现未定义的分类ID: {cat_id}")
        print(f"   包含工具: {', '.join(category_tools[cat_id][:5])}")
        invalid_found = True

if not invalid_found:
    print("✅ 所有工具使用的分类ID都有效")

print("\n" + "=" * 80)
print("总结")
print("=" * 80)
print(f"分类总数: {len(category_map)}")
print(f"工具总数: {sum(len(tools) for tools in category_tools.values())}")
