#!/usr/bin/env python3
"""
创建DEX交易所分类logo
与其他分类保持一致的设计风格
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 创建高分辨率图像（1500x1500）
size = 1500
img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# 定义渐变色（蓝色到紫色，与网站主题一致）
def create_gradient(start_color, end_color, size):
    """创建渐变背景"""
    gradient = Image.new('RGBA', (size, size), start_color)
    for y in range(size):
        ratio = y / size
        r = int(start_color[0] * (1 - ratio) + end_color[0] * ratio)
        g = int(start_color[1] * (1 - ratio) + end_color[1] * ratio)
        b = int(start_color[2] * (1 - ratio) + end_color[2] * ratio)
        draw.rectangle([(0, y), (size, y + 1)], fill=(r, g, b, 255))

# 创建圆角矩形背景
corner_radius = 300
padding = 150
bg_size = size - 2 * padding

# 绘制渐变背景（对角线渐变）
for y in range(padding, size - padding):
    for x in range(padding, size - padding):
        ratio = ((x - padding) + (y - padding)) / (bg_size * 2)
        r = int(59 * (1 - ratio) + 147 * ratio)  # 蓝色到紫色
        g = int(130 * (1 - ratio) + 51 * ratio)
        b = int(246 * (1 - ratio) + 234 * ratio)
        img.putpixel((x, y), (r, g, b, 255))

# 圆角遮罩
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

# 尝试加载系统字体
font_size = 500
try:
    # 尝试使用粗体字体
    font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    # macOS系统字体
except:
    try:
        font = ImageFont.truetype("Arial.ttf", font_size)
    except:
        font = ImageFont.load_default()

# 绘制DEX文字（使用白色）
text = "DEX"
# 获取文本边界框
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]

# 居中显示
x = (size - text_width) // 2
y = (size - text_height) // 2 - 20

# 绘制阴影效果
shadow_offset = 8
draw.text((x + shadow_offset, y + shadow_offset), text, fill=(0, 0, 0, 100), font=font)

# 绘制主文字
draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)

# 保存为PNG
output_path = "/Users/jim/Desktop/Claude Code/DAO3/public/icons/categories/exchange.png"
img.save(output_path, 'PNG', optimize=True)
print(f"✅ DEX Logo已创建: {output_path}")
print(f"   尺寸: {size}x{size}px")
print(f"   格式: PNG with transparency")
