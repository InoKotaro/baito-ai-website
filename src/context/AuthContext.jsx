'use client';

import { createContext, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabaseClient';

// 1. Contextの作成
export const AuthContext = createContext();

// 2. getAdminCompany関数の定義
const getAdminCompany = async (user) => {
  if (!user) return null;
  try {
    const { data, error } = await supabase
      .from('Company')
      .select('id, email, name')
      .eq('email', user.email)
      .single();
    if (error) {
      console.error('[getAdminCompany] Supabase error:', error);
      return null;
    }
    return data;
  } catch (e) {
    console.error('[getAdminCompany] Unexpected error:', e);
    return null;
  }
};

// 3. AuthProviderコンポーネントの作成
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChangeリスナーで認証状態を監視
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            const companyData = await getAdminCompany(session.user);
            setAdmin(companyData);
          } else {
            setAdmin(null);
          }
        } catch (e) {
          console.error('Error in onAuthStateChange:', e);
          setAdmin(null);
        } finally {
          setLoading(false);
        }
      },
    );

    // クリーンアップ関数
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 4. Context Providerを介して値を渡す
  const value = { admin, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
