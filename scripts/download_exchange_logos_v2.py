#!/usr/bin/env python3
"""
使用不同源下载交易所logo
"""

import urllib.request
import urllib.error
import ssl
import os

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# 使用不同的URL源
exchanges = [
    ('binance', [
        'https://bin.bnbstatic.com/image/admin_mgs_logo_v3.png',
        'https://bin.bnbstatic.com/image/admin_mgs_logo_v3.png?x-oss-process=image/resize,w_200',
        'https://github.com/binance/binance-logo/raw/master/binance-logo.png',
        'https://upload.wikimedia.org/wikipedia/commons/1/12/Binance_logo.svg'
    ]),
    ('okx', [
        'https://static.okx.com/cdn/assets/imgs/OKX_logo.png',
        'https://assets.okx.com/cdn/assets/imgs/OKX_logo.png',
        'https://upload.wikimedia.org/wikipedia/commons/e/e5/OKX_logo.svg'
    ]),
    ('kraken', [
        'https://blog.kraken.com/wp-content/uploads/2021/03/kraken-logo.png',
        'https://www.kraken.com/favicon.ico',
        'https://upload.wikimedia.org/wikipedia/commons/3/3f/Kraken_logo.svg'
    ]),
    ('bybit', [
        'https://bybit-exchange.github.io/Bybit-Landing/en/images/logo.png',
        'https://github.com/bybit-exchange/apis/raw/master/bybit-logo.png',
        'https://upload.wikimedia.org/wikipedia/commons/3/31/Bybit_logo.svg'
    ]),
    ('gateio', [
        'https://www.gate.io/resources/imgs/logo_gateio.png',
        'https://www.gate.io/favicon.ico',
        'https://upload.wikimedia.org/wikipedia/commons/1/13/Gate.io_logo.svg'
    ]),
]

output_dir = "/Users/jim/Desktop/Claude Code/DAO3/public/icons"

# Coinbase已经下载成功，跳过
downloaded = ['coinbase']

for name, urls in exchanges:
    if name in downloaded:
        print(f"⏭️  {name} 已存在，跳过")
        continue

    output_path = os.path.join(output_dir, f"{name}.png")
    success = False

    for url in urls:
        try:
            print(f"尝试下载 {name} from {url}...")
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            })
            with urllib.request.urlopen(req, context=ssl_context, timeout=20) as response:
                data = response.read()
                with open(output_path, 'wb') as f:
                    f.write(data)

                file_size = len(data)
                print(f"✅ {name} logo已下载: {output_path} ({file_size} bytes)")
                success = True
                break

        except Exception as e:
            print(f"   失败: {str(e)[:50]}")
            continue

    if not success:
        print(f"❌ {name} 所有源都失败了")

print("\n下载完成！")
