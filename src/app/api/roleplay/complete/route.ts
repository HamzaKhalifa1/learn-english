import { NextResponse } from 'next/server';
import { saveRoleplaySession, getUser } from '@/lib/db';
import { getScenario } from '@/data/roleplayScenarios';
import { getGuestUserId } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const userId = await getGuestUserId();
    const body = await req.json();
    const { scenarioId, turnsCount, targetWordsUsed } = body as {
      scenarioId: string;
      turnsCount: number;
      targetWordsUsed: number;
    };

    if (!scenarioId) {
      return NextResponse.json({ success: false, error: 'Scenario ID required' }, { status: 400 });
    }

    const scenario = getScenario(scenarioId);
    const level = scenario?.level || 'A1';
    const unitId = scenario?.unitId || null;
    const xp = 30;

    await saveRoleplaySession(scenarioId, unitId, level, turnsCount || 4, targetWordsUsed || 0, xp, userId);
    const user = await getUser(userId);

    return NextResponse.json({
      success: true,
      data: {
        xpEarned: xp,
        totalXp: user?.xp ?? 0,
        streak: user?.streak ?? 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error saving session' }, { status: 500 });
  }
}
