import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Service role key is not configured on the server' },
        { status: 500 },
      );
    }
    const authHeader = req.headers.get('authorization') || '';
    let userIdFromToken = null;
    if (authHeader.toLowerCase().startsWith('bearer ')) {
      const token = authHeader.slice(7);
      const { data, error: getUserErr } =
        await supabaseAdmin.auth.getUser(token);
      if (getUserErr) {
        return NextResponse.json(
          {
            error: `Failed to get user from token: ${getUserErr.message || ''}`,
          },
          { status: 401 },
        );
      }
      userIdFromToken = data?.user?.id || null;
    }

    let bodyUserId = null;
    try {
      const { authUserId } = await req.json();
      bodyUserId = authUserId || null;
    } catch (_) {}

    const targetUserId = userIdFromToken || bodyUserId;
    if (!targetUserId) {
      return NextResponse.json(
        { error: 'No user id provided (missing bearer token and authUserId)' },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);
    if (error) {
      console.error('Admin delete user error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete auth user' },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Delete account API error:', e);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
