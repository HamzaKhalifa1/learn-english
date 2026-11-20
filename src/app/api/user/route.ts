import { NextResponse } from 'next/server';
import { addXP, updateUserLevel, resetPlacement } from '@/lib/db';
import { getOrCreateGuestUser, getGuestUserId } from '@/lib/session';

export async function GET() {
  try {
    const user = await getOrCreateGuestUser();
    return NextResponse.json({ success: true, data: user });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getGuestUserId();
    const body = await req.json();

    // Add XP
    if (body.xp) await addXP(body.xp, userId);

    // Update user level upon graduation
    if (body.action === 'update-level' && body.level) {
      await updateUserLevel(body.level, userId);
      return NextResponse.json({ success: true, level: body.level });
    }

    // Reset placement test — allows re-taking the test
    if (body.action === 'reset-placement') {
      await resetPlacement(userId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
