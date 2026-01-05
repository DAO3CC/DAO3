import { NextResponse } from 'next/server';
import { getAllTools, createTool } from '@/lib/db';

export async function GET() {
  try {
    const tools = await getAllTools();
    return NextResponse.json({ success: true, data: tools });
  } catch (error) {
    console.error('Error in GET /api/tools:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tools' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tool = await createTool(body);

    if (!tool) {
      return NextResponse.json({ success: false, error: 'Failed to create tool' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: tool });
  } catch (error) {
    console.error('Error in POST /api/tools:', error);
    return NextResponse.json({ success: false, error: 'Failed to create tool' }, { status: 500 });
  }
}
