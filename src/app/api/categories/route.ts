import { NextResponse } from 'next/server';
import { getAllCategories, createCategory } from '@/lib/db';

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const category = await createCategory(body);

    if (!category) {
      return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}
