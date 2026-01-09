#!/usr/bin/env python3
"""
下载PANews分类logo
"""
import requests
from pathlib import Path

# 创建分类图标目录
CATEGORIES_DIR = Path("/Users/jim/Desktop/Claude Code/DAO3/public/icons/categories")
CATEGORIES_DIR.mkdir(exist_ok=True)

# 分类logo映射
CATEGORY_LOGOS = {
    'hot': 'https://cdn-img.panewslab.com/panews/2024/12/26/images/m9yb3f3N1v.png',
    'dat': 'https://cdn-img.panewslab.com/panews/2025/08/01/images/4N93PV68h0.png',
    'ai-agent': 'https://cdn-img.panewslab.com/panews/2025/01/03/images/6Eyu5WNniM.png',
    'meme': 'https://cdn-img.panewslab.com/panews/2024/12/26/images/00hZS21NlS.png',
    'explorer': 'https://cdn-img.panewslab.com/panews/2024/12/26/images/KqIT1VN3hD.png',
    'data': 'https://cdn-img.panewslab.com/panews/2024/12/26/images/86z95Dj0Vg.png',
    'btc': 'https://cdn-img.panewslab.com/panews/2024/12/26/images/ios5h8k4R8.png',
    'cefi': 'https://cdn-img.panewslab.com/panews/2024/12/26/images/9N82sWJ950.png',
    'defi': 'https://cdn-img.panewslab.com/panews/2024/12/26/images/zs4Fpd54yj.png',
    'nft': 'https://cdn-img.panewslab.com/panews/2024/12/26/images/f3q0fGhQG3.png',
    'dao': 'https://cdn-img.panewslab.com/panews/2024/12/26/images/0yfTtG5DoS.png',
    'dapp': 'https://cdn-img.panewslab.com/panews/2024/12/26/images/qZ1vIFq2Xh.png',
    'airdrop': 'https://cdn-img.panewslab.com/panews/2024/12/26/images/C2Q4y82PKT.png',
    'mining': 'https://cdn-img.panewslab.com/panews/2024/12/26/images/mBTjjA7iYS.png',
    'wallet': 'https://cdn-img.panewslab.com/panews/2024/12/26/images/W2d3WaLz7o.png',
    'other': 'https://cdn-img.panewslab.com/panews/2024/12/26/images/A9Y9CFrke0.png',
}

print("📥 开始下载分类logo...")

success_count = 0
fail_count = 0

for slug, url in CATEGORY_LOGOS.items():
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()

        filename = f"{slug}.png"
        filepath = CATEGORIES_DIR / filename

        with open(filepath, 'wb') as f:
            f.write(response.content)

        print(f"  ✅ {slug}: {filename}")
        success_count += 1
    except Exception as e:
        print(f"  ❌ {slug}: {str(e)}")
        fail_count += 1

print(f"\n✨ 下载完成！")
print(f"✅ 成功: {success_count}")
print(f"❌ 失败: {fail_count}")
print(f"📁 保存位置: {CATEGORIES_DIR}")
