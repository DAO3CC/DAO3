#!/usr/bin/env python3
"""
创建"全部工具"分类logo - 交叉的两个🔧
透明背景，与其他分类保持一致的设计风格
"""

from PIL import Image, ImageDraw, ImageFont
import math

# 创建高分辨率图像（1500x1500）
size = 1500
img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# 定义渐变色（蓝紫色）
gradient_colors = [
    (59, 130, 246),   # 蓝色 #3B82F6
    (147, 51, 234),   # 紫色 #9333EA
]

# 绘制交叉的扳手图标
center_x, center_y = size // 2, size // 2
wrench_length = 500
wrench_width = 120
head_size = 180

def draw_wrench(angle, color):
    """绘制一个扳手，指定旋转角度和颜色"""
    # 创建一个临时图像用于绘制旋转的扳手
    temp_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    temp_draw = ImageDraw.Draw(temp_img)

    # 扳手柄（矩形）
    handle_length = wrench_length - head_size
    handle_x = center_x - handle_length // 2
    handle_y = center_y - wrench_width // 2

    # 绘制手柄（带渐变）
    for i in range(wrench_width):
        ratio = i / wrench_width
        r = int(color[0] + (gradient_colors[1][0] - color[0]) * ratio)
        g = int(color[1] + (gradient_colors[1][1] - color[1]) * ratio)
        b = int(color[2] + (gradient_colors[1][2] - color[2]) * ratio)
        temp_draw.rectangle(
            [(handle_x, handle_y + i), (handle_x + handle_length, handle_y + i + 1)],
            fill=(r, g, b, 255)
        )

    # 扳手头（圆形开口）
    head_center_x = handle_x + handle_length + head_size // 2
    head_center_y = center_y

    # 外圆（扳手头外轮廓）
    temp_draw.ellipse(
        [(head_center_x - head_size // 2, head_center_y - head_size // 2),
         (head_center_x + head_size // 2, head_center_y + head_size // 2)],
        fill=color
    )

    # 内圆（开口）
    hole_size = head_size // 2.5
    temp_draw.ellipse(
        [(head_center_x - hole_size // 2, head_center_y - hole_size // 2),
         (head_center_x + hole_size // 2, head_center_y + hole_size // 2)],
        fill=(0, 0, 0, 0)  # 透明
    )

    # 开口槽（六边形效果）
    slot_width = 30
    temp_draw.rectangle(
        [(head_center_x - slot_width // 2, head_center_y - head_size // 2),
         (head_center_x + slot_width // 2, head_center_y + head_size // 2)],
        fill=(0, 0, 0, 0)
    )

    # 旋转临时图像
    rotated = temp_img.rotate(angle, center=(center_x, center_y), resample=Image.BICUBIC, expand=False)

    # 合并到主图像
    img.paste(Image.alpha_composite(img, rotated), (0, 0))

# 绘制第一个扳手（蓝色，45度角）
draw_wrench(45, gradient_colors[0])

# 绘制第二个扳手（紫色，-45度角）
draw_wrench(-45, gradient_colors[1])

# 添加轻微的阴影效果
shadow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
shadow_draw = ImageDraw.Draw(shadow)
shadow_offset = 15

def draw_wrench_shadow(angle):
    """绘制扳手阴影"""
    temp_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    temp_draw = ImageDraw.Draw(temp_img)

    handle_length = wrench_length - head_size
    handle_x = center_x - handle_length // 2 + shadow_offset
    handle_y = center_y - wrench_width // 2 + shadow_offset

    temp_draw.rectangle(
        [(handle_x, handle_y), (handle_x + handle_length, handle_y + wrench_width)],
        fill=(0, 0, 0, 80)
    )

    head_center_x = handle_x + handle_length + head_size // 2
    head_center_y = center_y + shadow_offset

    temp_draw.ellipse(
        [(head_center_x - head_size // 2, head_center_y - head_size // 2),
         (head_center_x + head_size // 2, head_center_y + head_size // 2)],
        fill=(0, 0, 0, 80)
    )

    rotated = temp_img.rotate(angle, center=(center_x + shadow_offset, center_y + shadow_offset), resample=Image.BICUBIC)
    shadow.paste(rotated, (0, 0), rotated)

# 先绘制阴影
shadow_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
draw_wrench_shadow(45)
draw_wrench_shadow(-45)

# 组合图像（阴影在底层，扳手在上层）
final_img = Image.alpha_composite(shadow_img.convert('RGBA'), img)

# 保存为PNG
output_path = "/Users/jim/Desktop/Claude Code/DAO3/public/icons/categories/all-tools.png"
final_img.save(output_path, 'PNG', optimize=True)
print(f"✅ 全部工具Logo已创建: {output_path}")
print(f"   尺寸: {size}x{size}px")
print(f"   设计: 交叉的两个🔧（扳手）")
print(f"   格式: PNG with transparency")
