#!/usr/bin/env python3
"""
从CoinMarketCap下载交易所官方logo
"""

import urllib.request
import urllib.error
import ssl
import os
import re

# 从CoinMarketCap提取的前30个交易所数据
exchanges_data = [
    {
        'name': 'Binance',
        'slug': 'binance',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/binance.png',
        'url': 'https://www.binance.com',
    },
    {
        'name': 'Coinbase Exchange',
        'slug': 'coinbase',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/coinbase.png',
        'url': 'https://www.coinbase.com',
    },
    {
        'name': 'Upbit',
        'slug': 'upbit',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/upbit.png',
        'url': 'https://www.upbit.com',
    },
    {
        'name': 'OKX',
        'slug': 'okx',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/okx.png',
        'url': 'https://www.okx.com',
    },
    {
        'name': 'Bybit',
        'slug': 'bybit',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/bybit.png',
        'url': 'https://www.bybit.com',
    },
    {
        'name': 'Bitget',
        'slug': 'bitget',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/bitget.png',
        'url': 'https://www.bitget.com',
    },
    {
        'name': 'Gate',
        'slug': 'gate',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/gate.png',
        'url': 'https://www.gate.io',
    },
    {
        'name': 'KuCoin',
        'slug': 'kucoin',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/kucoin.png',
        'url': 'https://www.kucoin.com',
    },
    {
        'name': 'MEXC',
        'slug': 'mexc',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/mexc.png',
        'url': 'https://www.mexc.com',
    },
    {
        'name': 'HTX',
        'slug': 'htx',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/htx.png',
        'url': 'https://www.htx.com',
    },
    {
        'name': 'Crypto.com Exchange',
        'slug': 'crypto-com',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/crypto-com-exchange.png',
        'url': 'https://crypto.com/exchange',
    },
    {
        'name': 'Bitfinex',
        'slug': 'bitfinex',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/bitfinex.png',
        'url': 'www.bitfinex.com',
    },
    {
        'name': 'BingX',
        'slug': 'bingx',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/bingx.png',
        'url': 'www.bingx.com',
    },
    {
        'name': 'Kraken',
        'slug': 'kraken',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/kraken.png',
        'url': 'www.kraken.com',
    },
    {
        'name': 'Binance.US',
        'slug': 'binance-us',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/binance-us.png',
        'url': 'www.binance.us',
    },
    {
        'name': 'Bithumb',
        'slug': 'bithumb',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/bithumb.png',
        'url': 'www.bithumb.com',
    },
    {
        'name': 'BitMart',
        'slug': 'bitmart',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/bitmart.png',
        'url': 'www.bitmart.com',
    },
    {
        'name': 'LBank',
        'slug': 'lbank',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/lbank.png',
        'url': 'www.lbank.com',
    },
    {
        'name': 'WazirX',
        'slug': 'wazirx',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/wazirx.png',
        'url': 'www.wazirx.com',
    },
    {
        'name': 'Bitstamp',
        'slug': 'bitstamp',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/original/bitstamp.png',
        'url': 'www.bitstamp.net',
    },
    {
        'name': 'BitoPro',
        'slug': 'bitopro',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64_original/bitopro.png',
        'url': 'www.bitopro.com',
    },
    {
        'name': 'Tapbit',
        'slug': 'tapbit',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64_original/tapbit.png',
        'url': 'www.tapbit.com',
    },
    {
        'name': 'XT.COM',
        'slug': 'xt-com',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64_original/xt-com.png',
        'url': 'www.xt.com',
    },
    {
        'name': 'KCEX',
        'slug': 'kcex',
        'logo_url': 'https://s2.coinmarketcap.com/static/img/exchanges/64x64_original/kcex.png',
        'url': 'www.kcex.com',
    },
]

# 创建SSL上下文（忽略证书验证）
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# 创建输出目录
output_dir = "/Users/jim/Desktop/Claude Code/DAO3/public/icons"

print("=" * 80)
print("从CoinMarketCap下载交易所官方logo")
print("=" * 80)

success_count = 0
failed_list = []

for exchange in exchanges_data:
    name = exchange['name']
    slug = exchange['slug']
    logo_url = exchange['logo_url']
    output_file = os.path.join(output_dir, f"{slug}.png")

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
            success_count += 1

            # 验证文件是否为有效图片
            try:
                from PIL import Image
                img = Image.open(output_file)
                width, height = img.size
                print(f"   尺寸: {width}x{height}px")
            except:
                print(f"   注意: 无法验证图片格式")

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
    for name, url in failed_list[:5]:
        print(f"  • {name}: {url}")
    if len(failed_list) > 5:
        print(f"  ... 还有 {len(failed_list) - 5} 个失败")

# 生成需要添加到mockData.ts的数据
print("\n" + "=" * 80)
print("需要添加到mockData.ts的数据")
print("=" * 80)

for i, exchange in enumerate(exchanges_data, 1):
    name = exchange['name']
    slug = exchange['slug']
    url = exchange['url']

    print(f"\n{i}. {name}")
    print(f"   ID: exchange{i}")
    print(f"   描述: 全球领先的加密货币交易所" if i == 1 else "知名加密货币交易所")
    print(f"   URL: {url}")
    print(f"   Icon: /icons/{slug}.png")

print("\n" + "=" * 80)
print("下一步：将上述数据添加到 mockData.ts 的交易所工具列表中")
print("=" * 80)
