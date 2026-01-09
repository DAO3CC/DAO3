#!/usr/bin/env python3
"""
下载交易所官方CoinMarketCap logo
"""

import urllib.request
import urllib.error
import ssl
import os

# 交易所官方CoinMarketCap ID和logo URL
exchanges_data = [
    {
        'name': 'Binance',
        'slug': 'binance',
        'cmc_id': '270',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png',
    },
    {
        'name': 'OKX',
        'slug': 'okx',
        'cmc_id': 'unknown',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/okx.png',
    },
    {
        'name': 'Coinbase',
        'slug': 'coinbase',
        'cmc_id': 'unknown',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/coinbase.png',
    },
    {
        'name': 'Kraken',
        'slug': 'kraken',
        'cmc_id': 'unknown',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/kraken.png',
    },
    {
        'name': 'Bybit',
        'slug': 'bybit',
        'cmc_id': 'unknown',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/bybit.png',
    },
    {
        'name': 'Gate.io',
        'slug': 'gate',
        'cmc_id': 'unknown',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/gate.png',
    },
]

# 创建SSL上下文
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# 创建输出目录
output_dir = "/Users/jim/Desktop/Claude Code/DAO3/public/icons"

print("=" * 80)
print("下载交易所官方CoinMarketCap Logo")
print("=" * 80)

success_count = 0
failed_list = []

for exchange in exchanges_data:
    name = exchange['name']
    slug = exchange['slug']
    logo_url = exchange['logo_url']
    output_file = os.path.join(output_dir, f"{slug}-official.png")

    try:
        print(f"\n正在下载: {name}...")

        # 创建请求
        req = urllib.request.Request(logo_url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://coinmarketcap.com'
        })

        # 下载logo
        with urllib.request.urlopen(req, context=ssl_context, timeout=30) as response:
            data = response.read()

            # 保存到文件
            with open(output_file, 'wb') as f:
                f.write(data)

            file_size = len(data)
            print(f"✅ {name} - 下载成功 ({file_size} bytes)")
            print(f"   保存为: {slug}-official.png")
            success_count += 1

    except urllib.error.URLError as e:
        print(f"❌ {name} - 下载失败: {e}")
        failed_list.append((name, logo_url))
    except Exception as e:
        print(f"❌ {name} - 发生错误: {e}")
        failed_list.append((name, logo_url))

print("\n" + "=" * 80)
print(f"下载完成!")
print("=" * 80)
print(f"成功: {success_count}/{len(exchanges_data)}")

if failed_list:
    print("\n失败的列表:")
    for name, url in failed_list:
        print(f"  • {name}: {url}")

print("\n" + "=" * 80)
print("下一步: 更新 mockData.ts 中的图标路径")
print("=" * 80)
