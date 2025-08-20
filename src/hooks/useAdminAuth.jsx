'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabaseClient';

// 管理者ユーザーかどうかを判定するロジックを修正
// Supabase Authで認証したユーザーのメールアドレスが`company`テーブルに存在するかどうかで判定します。
const isAdminUser = async (user) => {
  if (!user) return false;

  try {
    const { data, error } = await supabase
      .from('Company')
      .select('id') // 存在確認のため、軽いカラムを1つだけ取得
      .eq('email', user.email)
      .single();

    // errorがあり、それが「行が見つからない」以外の場合はエラーログを出力
    if (error && error.code !== 'PGRST116') {
      console.error(
        'Error checking admin user:',
        JSON.stringify(error, null, 2),
      );
      return false;
    }

    // dataがあれば（=companyテーブルにレコードが存在すれば）管理者とみなす
    return !!data;
  } catch (e) {
    console.error('An unexpected error occurred in isAdminUser:', e);
    return false;
  }
};

export const useAdminAuth = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // セッションを確認し、管理者ユーザーであればstateを更新する
  const checkAdminSession = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const is_admin = await isAdminUser(session?.user);

    if (session?.user && is_admin) {
      setAdmin(session.user);
    } else {
      setAdmin(null);
      // 管理者でない、もしくはセッションがない場合は破棄する
      if (session) {
        await supabase.auth.signOut();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAdminSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const is_admin = await isAdminUser(session?.user);
        if (session?.user && is_admin) {
          setAdmin(session.user);
        } else {
          setAdmin(null);
        }
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [checkAdminSession]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const is_admin = await isAdminUser(data.user);

    if (data.user && is_admin) {
      setAdmin(data.user);
      return { success: true };
    } else {
      // 管理者でなければログアウトさせる
      await supabase.auth.signOut();
      return { success: false, error: '管理者権限がありません。' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    router.push('/admin');
  };

  return { admin, loading, login, logout };
};
