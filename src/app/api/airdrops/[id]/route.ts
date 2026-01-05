import { NextResponse } from 'next/server';
import { updateAirdrop, deleteAirdrop } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const airdrop = await updateAirdrop(params.id, body);

    if (!airdrop) {
      return NextResponse.json({ success: false, error: 'Airdrop not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: airdrop });
  } catch (error) {
    console.error('Error in PUT /api/airdrops/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to update airdrop' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteAirdrop(params.id);

    if (!success) {
      return NextResponse.json({ success: false, error: 'Failed to delete airdrop' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/airdrops/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete airdrop' }, { status: 500 });
  }
}
