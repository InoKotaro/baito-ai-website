import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase環境変数確認:', {
  url: supabaseUrl ? '設定済み' : '未設定',
  hasKey: !!supabaseAnonKey,
  urlValue: supabaseUrl,
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase環境変数が設定されていません');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY:',
    supabaseAnonKey ? '設定済み' : '未設定',
  );
  throw new Error(
    'Supabase環境変数が設定されていません。.env.localファイルを確認してください。',
  );
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    // global: {
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    // },
  },
);
