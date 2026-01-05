import { NextResponse } from 'next/server';
import { updateCategory, deleteCategory } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const category = await updateCategory(params.id, body);

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error in PUT /api/categories/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteCategory(params.id);

    if (!success) {
      return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/categories/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
