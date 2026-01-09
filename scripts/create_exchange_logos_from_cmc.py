#!/usr/bin/env python3
"""
从CoinMarketCap获取的交易所数据创建logo
"""

import urllib.request
import urllib.error
import ssl
import os
from PIL import Image, ImageDraw, ImageFont
import re

# 从CoinMarketCap提取的交易所数据 (前30个)
exchanges_data = [
    {
        'name': 'Binance',
        'description': '全球领先的加密货币交易所',
        'url': 'https://www.binance.com',
        'color': '#F3BA2F',  # Binance黄色
    },
    {
        'name': 'Coinbase Exchange',
        'description': '美国合规加密货币交易所',
        'url': 'https://www.coinbase.com',
        'color': '#0052FF',  # Coinbase蓝色
    },
    {
        'name': 'Upbit',
        'description': '韩国领先的加密货币交易所',
        'url': 'https://www.upbit.com',
        'color': '#1A1A1A',  # Upbit深灰色
    },
    {
        'name': 'OKX',
        'description': '知名的加密货币交易所',
        'url': 'https://www.okx.com',
        'color': '#1A2633',  # OKX深蓝色
    },
    {
        'name': 'Bybit',
        'description': '数字货币衍生品交易平台',
        'url': 'https://www.bybit.com',
        'color': '#00AAFF',  # Bybit青色
    },
    {
        'name': 'Bitget',
        'description': '加密货币金融服务提供商',
        'url': 'https://www.bitget.com',
        'color': '#00B825',  # Bitget绿色
    },
    {
        'name': 'Gate',
        'description': '加密货币金融服务提供商',
        'url': 'https://www.gate.io',
        'color': '#0FA8E0',  # Gate青色
    },
    {
        'name': 'KuCoin',
        'description': '知名的加密货币交易所',
        'url': 'https://www.kucoin.com',
        'color': '#00C5D0',  # KuCoin蓝色
    },
    {
        'name': 'MEXC',
        'description': '数字货币交易平台',
        'url': 'https://www.mexc.com',
        'color': '#1EBE29',  # MEXC青色
    },
    {
        'name': 'HTX',
        'description': '知名加密货币交易所',
        'url': 'https://www.htx.com',
        'color': '#00CDA2',  # HTX橙色
    },
    {
        'name': 'Crypto.com Exchange',
        'description': '加密货币交易平台',
        'url': 'https://crypto.com/exchange',
        'color': '#1A1A1A',  # 深灰色
    },
    {
        'name': 'Bitfinex',
        'description': '加密货币衍生品交易平台',
        'url': 'www.bitfinex.com',
        'color': '#0052CC',  # Bitfinex蓝色
    },
    {
        'name': 'BingX',
        'description': '数字货币交易平台',
        'url': 'www.bingx.com',
        'color': '#00AAFF',  # BingX青色
    },
    {
        'name': 'Bithumb',
        'description': '韩国领先的加密货币交易所',
        'url': 'www.bithumb.com',
        'color': '#F79331',  # Bithumb黄色
    },
    {
        'name': 'BitMart',
        'description': '数字货币交易平台',
        'url': 'www.bitmart.com',
        'color': '#24C7CC',  # BitMart紫色
    },
    {
        'name': 'LBank',
        'description': '知名的加密货币交易所',
        'url': 'www.lbank.com',
        'color': '#00B494',  # LBank蓝色
    },
    {
        'name': 'WazirX',
        'description': '数字货币交易平台',
        'url': 'www.wazirx.com',
        'color': '#0052CC',  # WazirX蓝色
    },
]

def create_exchange_logo(exchange_data, output_dir):
    """为交易所创建logo"""
    name = exchange_data['name']
    color_hex = exchange_data['color']
    description = exchange_data['description']

    # 将hex颜色转换为RGB（移除#前缀）
    if color_hex.startswith('#'):
        color_hex = color_hex[1:]
    color_rgb = tuple(int(color_hex[i:i+2], 16) for i in (0, 2, 4))

    size = 512
    padding = 60

    # 创建图像
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 创建渐变背景
    for y in range(padding, size - padding):
        for x in range(padding, size - padding):
            ratio = ((x - padding) + (y - padding)) / ((size - 2 * padding) * 2)
            r = int(color_rgb[0] * (1 - ratio * 0.2))
            g = int(color_rgb[1] * (1 - ratio * 0.2))
            b = int(color_rgb[2] * (1 - ratio * 0.2))
            img.putpixel((x, y), (r, g, b, 255))

    # 创建圆角矩形
    corner_radius = 100
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle(
        [(padding, padding), (size - padding, size - padding)],
        radius=corner_radius,
        fill=255
    )

    # 应用圆角
    background = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    background.paste(img, mask=mask)
    img = background
    draw = ImageDraw.Draw(img)

    # 尝试加载字体
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 120, index=0)
        font_bold = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 140, index=1)
    except:
        try:
            font = ImageFont.truetype("Arial.ttf", 120)
            font_bold = ImageFont.truetype("Arial Bold.ttf", 140)
        except:
            font = font_bold = ImageFont.load_default()

    # 绘制首字母
    first_letter = name[0].upper()
    font_size = 180

    # 绘制首字母
    try:
        # 使用粗体字
        bbox = draw.textbbox((0, 0), first_letter, font=font_bold)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        x = (size - text_width) // 2
        y = (size - text_height) // 2 - 20

        # 绘制阴影
        shadow_offset = 6
        draw.text((x + shadow_offset, y + shadow_offset), first_letter, fill=(0, 0, 0, 150), font=font_bold)

        # 绘制主文字
        draw.text((x, y), first_letter, fill=(255, 255, 255, 255), font=font_bold)

    except:
        # 如果字体加载失败，使用默认字体
        bbox = draw.textbbox((0, 0), first_letter, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        x = (size - text_width) // 2
        y = (size - text_height) // 2 - 20
        draw.text((x, y), first_letter, fill=(255, 255, 255, 255), font=font)

    # 保存logo
    safe_name = name.replace(' ', '-').lower()
    output_path = os.path.join(output_dir, f"{safe_name}.png")

    img.save(output_path, 'PNG', optimize=True)
    return output_path, os.path.getsize(output_path)

# 创建所有交易所logo
output_dir = "/Users/jim/Desktop/Claude Code/DAO3/public/icons"

print("=" * 80)
print("创建交易所Logo")
print("=" * 80)

created_count = 0
for exchange in exchanges_data:
    try:
        output_path, file_size = create_exchange_logo(exchange, output_dir)
        print(f"✅ {exchange['name']}: {output_path} ({file_size} bytes)")
        created_count += 1
    except Exception as e:
        print(f"❌ {exchange['name']}: 创建失败 - {e}")

print("\n" + "=" * 80)
print(f"成功创建: {created_count}/{len(exchanges_data)}")
print("=" * 80)

# 输出需要添加到mockData.ts的交易所数据
print("\n" + "=" * 80)
print("需要添加到mockData.ts的交易所数据")
print("=" * 80)

for i, exchange in enumerate(exchanges_data, 1):
    print(f"\n{i}. {exchange['name']}")
    print(f"   描述: {exchange['description']}")
    print(f"   URL: {exchange['url']}")
    print(f"   颜色: {exchange['color']}")
