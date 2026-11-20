import { NextResponse } from 'next/server';
import { ROLEPLAY_SCENARIOS } from '@/data/roleplayScenarios';
import { getCompletedRoleplayScenarios } from '@/lib/db';
import { getGuestUserId } from '@/lib/session';

export async function GET() {
  try {
    const userId = await getGuestUserId();
    const completedScenarios = await getCompletedRoleplayScenarios(userId);
    return NextResponse.json({
      success: true,
      data: {
        scenarios: ROLEPLAY_SCENARIOS,
        completedScenarios,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
