#!/usr/bin/env python3
"""
使用第三方logo服务下载交易所logo
"""

import urllib.request
import urllib.error
import ssl
import os
import json

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# 使用clearbit logo API和其他服务
exchanges = [
    ('binance', 'https://logo.clearbit.com/binance.com'),
    ('okx', 'https://logo.clearbit.com/okx.com'),
    ('kraken', 'https://logo.clearbit.com/kraken.com'),
    ('bybit', 'https://logo.clearbit.com/bybit.com'),
    ('gateio', 'https://logo.clearbit.com/gate.io'),
    ('coinbase', 'https://logo.clearbit.com/coinbase.com'),
]

output_dir = "/Users/jim/Desktop/Claude Code/DAO3/public/icons"

for name, url in exchanges:
    output_path = os.path.join(output_dir, f"{name}.png")

    try:
        print(f"正在下载 {name} from {url}...")
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })

        with urllib.request.urlopen(req, context=ssl_context, timeout=30) as response:
            data = response.read()

            # 检查是否是有效的图片数据
            if len(data) > 100:  # 至少要有一些内容
                with open(output_path, 'wb') as f:
                    f.write(data)

                file_size = len(data)
                print(f"✅ {name} logo已下载: {output_path} ({file_size} bytes)")
            else:
                print(f"❌ {name} 下载的文件太小")

    except Exception as e:
        print(f"❌ {name} 下载失败: {str(e)[:80]}")

print("\n使用备用方法...")
# 尝试使用谷歌favicon服务
favicon_urls = [
    ('binance', 'https://www.google.com/s2/favicons?domain=binance.com&sz=128'),
    ('okx', 'https://www.google.com/s2/favicons?domain=okx.com&sz=128'),
    ('kraken', 'https://www.google.com/s2/favicons?domain=kraken.com&sz=128'),
    ('bybit', 'https://www.google.com/s2/favicons?domain=bybit.com&sz=128'),
    ('gateio', 'https://www.google.com/s2/favicons?domain=gate.io&sz=128'),
]

for name, url in favicon_urls:
    output_path = os.path.join(output_dir, f"{name}.png")

    # 如果文件已经存在且大于1KB，跳过
    if os.path.exists(output_path) and os.path.getsize(output_path) > 1024:
        print(f"⏭️  {name} 已存在，跳过")
        continue

    try:
        print(f"下载favicon {name}...")
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0'
        })

        with urllib.request.urlopen(req, context=ssl_context, timeout=20) as response:
            data = response.read()
            with open(output_path, 'wb') as f:
                f.write(data)

            file_size = len(data)
            print(f"✅ {name} favicon已下载: ({file_size} bytes)")

    except Exception as e:
        print(f"❌ {name} favicon下载失败")

print("\n下载完成！")
