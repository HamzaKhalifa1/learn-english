// API route handlers - shared utilities
import { NextResponse } from 'next/server';

export function successResponse(data: unknown) {
  return NextResponse.json({ success: true, data });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}
