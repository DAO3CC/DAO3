#!/usr/bin/env python3
"""
为6个交易所创建简单的文字logo
"""

from PIL import Image, ImageDraw, ImageFont
import os

exchanges = [
    ('binance', '#F3BA2F', 'Binance'),
    ('okx', '#1A2633', 'OKX'),
    ('coinbase', '#0052FF', 'Coinbase'),
    ('kraken', '#4D3B8E', 'Kraken'),
    ('bybit', '#F7A600', 'Bybit'),
    ('gateio', '#0FA8E0', 'Gate.io'),
]

size = 512
padding = 60

for exchange_id, color, name in exchanges:
    # 创建图像
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 解析颜色
    if color.startswith('#'):
        color_rgb = tuple(int(color[i:i+2], 16) for i in (1, 3, 5))
    else:
        color_rgb = (59, 130, 246)  # 默认蓝色

    # 绘制圆角矩形背景
    corner_radius = 100
    bg_padding = 50

    # 创建圆角矩形遮罩
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle(
        [(bg_padding, bg_padding), (size - bg_padding, size - bg_padding)],
        radius=corner_radius,
        fill=255
    )

    # 绘制渐变背景
    for y in range(bg_padding, size - bg_padding):
        for x in range(bg_padding, size - bg_padding):
            ratio = ((x - bg_padding) + (y - bg_padding)) / ((size - 2 * bg_padding) * 2)
            r = int(color_rgb[0] * (1 - ratio * 0.3))
            g = int(color_rgb[1] * (1 - ratio * 0.3))
            b = int(color_rgb[2] * (1 - ratio * 0.3))
            img.putpixel((x, y), (r, g, b, 255))

    # 应用圆角
    background = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    background.paste(img, mask=mask)
    img = background
    draw = ImageDraw.Draw(img)

    # 尝试加载字体
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 120)
    except:
        try:
            font = ImageFont.truetype("Arial.ttf", 120)
        except:
            font = ImageFont.load_default()

    # 绘制文字（白色）
    text = name
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = (size - text_width) // 2
    y = (size - text_height) // 2 - 10

    # 绘制阴影
    shadow_offset = 6
    draw.text((x + shadow_offset, y + shadow_offset), text, fill=(0, 0, 0, 100), font=font)

    # 绘制主文字
    draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)

    # 保存
    output_path = f"/Users/jim/Desktop/Claude Code/DAO3/public/icons/{exchange_id}.png"
    img.save(output_path, 'PNG', optimize=True)
    print(f"✅ {name} logo已创建: {output_path}")

print("\n所有交易所logo已生成完成！")
