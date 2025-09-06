import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    // 1. Verify service role key
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Service role key is not configured on the server' },
        { status: 500 },
      );
    }

    // 2. Get user from token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token is missing.' },
        { status: 401 },
      );
    }
    const token = authHeader.slice(7);
    const {
      data: { user: userFromToken },
      error: getUserErr,
    } = await supabaseAdmin.auth.getUser(token);

    if (getUserErr || !userFromToken) {
      return NextResponse.json(
        {
          error: `Authentication error: ${
            getUserErr?.message || 'User not found'
          }`,
        },
        { status: 401 },
      );
    }

    // 3. Get newName from request body
    const { newName } = await req.json();
    if (!newName || typeof newName !== 'string' || newName.trim().length === 0) {
      return NextResponse.json({ error: 'New name is invalid.' }, { status: 400 });
    }

    const targetUserId = userFromToken.id;
    const userEmail = userFromToken.email;

    // 4. Update Supabase Auth user
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      { user_metadata: { full_name: newName.trim() } },
    );

    if (authError) {
      console.error('Error updating auth user:', authError);
      return NextResponse.json(
        { error: 'Failed to update authentication information.' },
        { status: 500 },
      );
    }

    // 5. Update custom User table
    const { error: dbError } = await supabaseAdmin
      .from('User')
      .update({ name: newName.trim() })
      .eq('email', userEmail);

    if (dbError) {
      console.error('Error updating custom user table:', dbError);
      // Auth update was successful, but DB update failed. This is an inconsistent state.
      return NextResponse.json(
        { error: 'Failed to update user profile in database.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: 'Name updated successfully.' });
  } catch (e) {
    console.error('Update username API error:', e);
    return NextResponse.json(
      { error: e.message || 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
}
