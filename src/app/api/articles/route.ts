import { NextResponse } from 'next/server';
import { getAllArticles, createArticle } from '@/lib/db';

export async function GET() {
  try {
    const articles = await getAllArticles();
    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    console.error('Error in GET /api/articles:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const article = await createArticle(body);

    if (!article) {
      return NextResponse.json({ success: false, error: 'Failed to create article' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('Error in POST /api/articles:', error);
    return NextResponse.json({ success: false, error: 'Failed to create article' }, { status: 500 });
  }
}
