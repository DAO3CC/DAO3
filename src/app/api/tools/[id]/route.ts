import { NextResponse } from 'next/server';
import { updateTool, deleteTool } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const tool = await updateTool(params.id, body);

    if (!tool) {
      return NextResponse.json({ success: false, error: 'Tool not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: tool });
  } catch (error) {
    console.error('Error in PUT /api/tools/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to update tool' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteTool(params.id);

    if (!success) {
      return NextResponse.json({ success: false, error: 'Failed to delete tool' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/tools/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete tool' }, { status: 500 });
  }
}
