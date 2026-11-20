import { NextResponse } from 'next/server';
import { getUnitWordProgress } from '@/lib/db';
import { getGuestUserId } from '@/lib/session';

// GET /api/words/unit/[unitId] — returns progress for all words in one unit for current guest
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await params;
    const userId = await getGuestUserId();
    const rows = await getUnitWordProgress(unitId, userId);
    return NextResponse.json({ success: true, data: rows });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
