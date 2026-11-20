import { NextResponse } from 'next/server';
import { getUnitStory } from '@/data/unitStories';
import { getStoryProgress, saveStoryProgress } from '@/lib/db';
import { getGuestUserId } from '@/lib/session';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await params;
    const story = getUnitStory(unitId);

    if (!story) {
      return NextResponse.json({ success: false, error: 'Story not found' }, { status: 404 });
    }

    const userId = await getGuestUserId();
    const progress = await getStoryProgress(unitId, userId);

    return NextResponse.json({
      success: true,
      data: {
        story,
        progress: progress || null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await params;
    const body = await request.json();
    const { score = 2, xp = 20 } = body;

    const userId = await getGuestUserId();
    await saveStoryProgress(unitId, score, xp, userId);

    return NextResponse.json({
      success: true,
      message: 'Story progress saved and XP awarded',
      xpAwarded: xp,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
