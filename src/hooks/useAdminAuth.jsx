'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabaseClient';

// 管理者ユーザーの会社情報を取得するロジック
// Supabase Authで認証したユーザーのメールアドレスが`Company`テーブルに存在するかどうかで判定します。
const getAdminCompany = async (user) => {
  if (!user) return null;

  try {
    console.log('管理者確認開始:', user.email);

    const { data, error } = await supabase
      .from('Company')
      .select('id, email, name')
      .eq('email', user.email)
      .single();

    if (error) {
      console.error('Companyテーブルクエリエラー:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      return null;
    }

    console.log('管理者確認結果:', data);
    return data;
  } catch (e) {
    console.error('管理者確認中の予期しないエラー:', e);
    return null;
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

    if (!session?.user) {
      console.log('管理者認証: セッションなし');
      setAdmin(null);
      setLoading(false);
      return;
    }

    console.log('管理者認証: セッション確認中', session.user.email);
    const companyData = await getAdminCompany(session.user);

    if (companyData) {
      console.log('管理者認証: 管理者として認識', companyData);
      setAdmin(companyData);
    } else {
      console.log('管理者認証: 通常ユーザーとして認識');
      setAdmin(null);
      // 管理者でない場合でもログアウトさせない
      // 通常のユーザーとしてログインを維持
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // 管理者ページでのみ実行するように最適化
    const pathname = window.location.pathname;
    if (!pathname.startsWith('/admin')) {
      // 管理者ページ以外では管理者認証をスキップ
      setAdmin(null);
      setLoading(false);
      return;
    }

    checkAdminSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // 管理者ページ以外では管理者認証をスキップ
        if (!window.location.pathname.startsWith('/admin')) {
          return;
        }

        console.log('管理者認証: 認証状態変更', event, session?.user?.email);

        if (event === 'SIGNED_OUT') {
          console.log('管理者認証: ログアウト');
          setAdmin(null);
          setLoading(false);
          return;
        }

        if (!session?.user) {
          console.log('管理者認証: セッションなし');
          setAdmin(null);
          setLoading(false);
          return;
        }

        const companyData = await getAdminCompany(session.user);
        if (companyData) {
          console.log('管理者認証: 管理者として認識', companyData);
          setAdmin(companyData);
        } else {
          console.log('管理者認証: 通常ユーザーとして認識');
          setAdmin(null);
          // 管理者でない場合でもログアウトさせない
        }
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [checkAdminSession]);

  // 管理者ページ以外では早期リターン
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '';
  if (!pathname.startsWith('/admin')) {
    return { admin: null, loading: false, login: () => {}, logout: () => {} };
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const companyData = await getAdminCompany(data.user);

    if (companyData) {
      setAdmin(companyData);
      return { success: true };
    } else {
      // 管理者でなくてもログアウトさせない
      // 通常のユーザーとしてログインを維持
      setAdmin(null);
      return { success: true, message: '通常ユーザーとしてログインしました。' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    router.push('/admin');
  };

  return { admin, loading, login, logout };
};
