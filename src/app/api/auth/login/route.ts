import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dao3admin2025';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        message: '登录成功',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: '密码错误',
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/auth/login:', error);
    return NextResponse.json({ success: false, error: '登录失败' }, { status: 500 });
  }
}
