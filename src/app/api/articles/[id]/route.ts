import { NextResponse } from 'next/server';
import { updateArticle, deleteArticle } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const article = await updateArticle(params.id, body);

    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('Error in PUT /api/articles/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteArticle(params.id);

    if (!success) {
      return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/articles/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 });
  }
}
