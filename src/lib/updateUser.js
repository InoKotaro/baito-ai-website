import { supabase } from '@/lib/supabaseClient';

export const updateUserName = async (userId, newName) => {
  // Update DB
  const { error: dbError } = await supabase
    .from('User')
    .update({ name: newName })
    .eq('id', userId);

  if (dbError) {
    throw new Error('データベースの更新に失敗しました。');
  }

  // --- DEBUG: Temporarily removed Auth update to isolate the cause of the hang ---
  // const { data: { user: updatedUser }, error: authError } = await supabase.auth.updateUser({
  //   data: { full_name: newName },
  // });

  // if (authError) {
  //   // In a real app, you might want to roll back the DB change here.
  //   throw new Error('認証情報の更新に失敗しました。');
  // }

  // return updatedUser;
  return null; // Return null as we are not getting an updated user object anymore
};