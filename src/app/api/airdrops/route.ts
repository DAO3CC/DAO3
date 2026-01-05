import { NextResponse } from 'next/server';
import { getAllAirdrops, createAirdrop } from '@/lib/db';

export async function GET() {
  try {
    const airdrops = await getAllAirdrops();
    return NextResponse.json({ success: true, data: airdrops });
  } catch (error) {
    console.error('Error in GET /api/airdrops:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch airdrops' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const airdrop = await createAirdrop(body);

    if (!airdrop) {
      return NextResponse.json({ success: false, error: 'Failed to create airdrop' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: airdrop });
  } catch (error) {
    console.error('Error in POST /api/airdrops:', error);
    return NextResponse.json({ success: false, error: 'Failed to create airdrop' }, { status: 500 });
  }
}
