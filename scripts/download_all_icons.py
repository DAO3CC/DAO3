#!/usr/bin/env python3
"""
从PANews下载所有工具的logo
"""
import urllib.request
import urllib.error
import os
import re
from pathlib import Path

# 图标保存目录
icons_dir = Path("/Users/jim/Desktop/Claude Code/DAO3/public/icons")
tools_dir = icons_dir / "tools"
tools_dir.mkdir(parents=True, exist_ok=True)

# 从mockData.ts提取所有工具的图标URL
mockdata_file = Path("/Users/jim/Desktop/Claude Code/DAO3/src/data/mockData.ts")

print("正在读取mockData.ts...")
with open(mockdata_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 提取所有外部URL（不以/icons开头的icon）
pattern = r"icon:\s*'((?!/icons).*?)'"
external_icons = re.findall(pattern, content)

# 去重
external_icons = list(set(external_icons))

print(f"找到 {len(external_icons)} 个需要下载的外部图标")

# 下载图标
success_count = 0
fail_count = 0
skip_count = 0

for i, icon_url in enumerate(external_icons, 1):
    try:
        # 从URL提取文件名
        filename = icon_url.split('/')[-1]
        # 处理URL参数
        if '?' in filename:
            filename = filename.split('?')[0]

        # 确定保存路径
        save_path = tools_dir / filename

        # 如果文件已存在，跳过
        if save_path.exists():
            print(f"[{i}/{len(external_icons)}] ✓ 跳过: {filename} (已存在)")
            skip_count += 1
            continue

        # 下载文件
        print(f"[{i}/{len(external_icons)}] ↓ 下载中: {filename}")

        # 使用urllib下载
        req = urllib.request.Request(
            icon_url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        )

        with urllib.request.urlopen(req, timeout=30) as response:
            with open(save_path, 'wb') as f:
                f.write(response.read())

        print(f"[{i}/{len(external_icons)}] ✓ 成功: {filename}")
        success_count += 1

    except Exception as e:
        print(f"[{i}/{len(external_icons)}] ✗ 失败: {icon_url}")
        print(f"  错误: {str(e)}")
        fail_count += 1

print("\n" + "="*60)
print("下载完成！")
print(f"成功: {success_count} 个")
print(f"跳过: {skip_count} 个")
print(f"失败: {fail_count} 个")
print("="*60)
