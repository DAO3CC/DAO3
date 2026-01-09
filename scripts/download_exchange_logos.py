#!/usr/bin/env python3
"""
下载交易所官方logo到本地
"""

import urllib.request
import urllib.error
import ssl
import os

# 创建不验证SSL的context（仅用于下载可信的图片）
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

exchanges = [
    ('binance', 'https://bin.bnbstatic.com/image/admin_mgs_logo_v3.png'),
    ('okx', 'https://static.okx.com/cdn/assets/imgs/OKX_logo.png'),
    ('coinbase', 'https://avatars.githubusercontent.com/u/18060534?s=200&v=4'),
    ('kraken', 'https://blog.kraken.com/wp-content/uploads/2021/03/kraken-logo.png'),
    ('bybit', 'https://bybit-exchange.github.io/Bybit-Landing/en/images/logo.png'),
    ('gateio', 'https://www.gate.io/resources/imgs/logo_gateio.png'),
]

output_dir = "/Users/jim/Desktop/Claude Code/DAO3/public/icons"

for name, url in exchanges:
    output_path = os.path.join(output_dir, f"{name}.png")

    try:
        print(f"正在下载 {name}...")
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ssl_context, timeout=30) as response:
            with open(output_path, 'wb') as f:
                f.write(response.read())

        file_size = os.path.getsize(output_path)
        print(f"✅ {name} logo已下载: {output_path} ({file_size} bytes)")

    except urllib.error.URLError as e:
        print(f"❌ {name} 下载失败: {e}")
    except Exception as e:
        print(f"❌ {name} 发生错误: {e}")

print("\n下载完成！")
