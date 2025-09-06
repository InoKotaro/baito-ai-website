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

    const targetUserId = userFromToken.id;
    const userEmail = userFromToken.email;

    // Find the user in the custom 'User' table by email to get their ID
    const { data: customUser, error: findUserError } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (findUserError && findUserError.code !== 'PGRST116') {
      // PGRST116 = "The result contains 0 rows"
      console.error('Error finding user in custom table:', findUserError);
      return NextResponse.json(
        { error: 'Error searching for user in database.' },
        { status: 500 },
      );
    }

    if (customUser) {
      // Delete related 'JobApplication' records
      const { error: deleteApplicationsError } = await supabaseAdmin
        .from('JobApplication')
        .delete()
        .eq('userId', customUser.id);

      if (deleteApplicationsError) {
        console.error(
          'Error deleting job applications:',
          deleteApplicationsError,
        );
        return NextResponse.json(
          { error: "Failed to delete user's applications." },
          { status: 500 },
        );
      }

      // Delete the user from the custom 'User' table
      const { error: deleteCustomUserError } = await supabaseAdmin
        .from('User')
        .delete()
        .eq('id', customUser.id);

      if (deleteCustomUserError) {
        console.error(
          'Error deleting user from custom table:',
          deleteCustomUserError,
        );
        return NextResponse.json(
          { error: 'Failed to delete user from database.' },
          { status: 500 },
        );
      }
    }

    // Finally, delete the user from Supabase Auth
    const { error: deleteAuthUserError } =
      await supabaseAdmin.auth.admin.deleteUser(targetUserId);
    if (deleteAuthUserError) {
      // This is a problematic state: user is deleted from our DB but not from Auth.
      // Log this inconsistency for manual review.
      console.error(
        `INCONSISTENCY: User ${targetUserId} deleted from custom DB but failed to delete from Auth.`,
        deleteAuthUserError,
      );
      return NextResponse.json(
        {
          error:
            'User deleted from application database, but failed to delete from authentication provider. Please contact support.',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Delete account API error:', e);
    return NextResponse.json({ error: e.message || 'Unexpected error' }, { status: 500 });
  }
}