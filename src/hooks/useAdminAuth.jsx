'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabaseClient';

const getAdminCompany = async (user) => {
  if (!user) return null;
  try {
    const { data, error } = await supabase
      .from('Company')
      .select('id, email, name')
      .eq('email', user.email)
      .single();
    if (error) {
      console.error('Companyテーブルクエリエラー:', error);
      return null;
    }
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

  useEffect(() => {
    const pathname = window.location.pathname;
    if (!pathname.startsWith('/admin')) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!window.location.pathname.startsWith('/admin')) {
          setAdmin(null);
          setLoading(false);
          return;
        }

        if (session?.user) {
          const companyData = await getAdminCompany(session.user);
          setAdmin(companyData);
        } else {
          setAdmin(null);
        }
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
