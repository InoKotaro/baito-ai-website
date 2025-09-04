'use client';

import { useRouter } from 'next/navigation';
import { useContext } from 'react';

import { AuthContext } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

// Contextから値を取得
export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AuthProvider');
  }

  const router = useRouter();

  // ログイン・ログアウト機能は利便性のために残す、状態管理はすべてContextが行う
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: error.message };
    }
    // 状態の更新はAuthProvider内のonAuthStateChangeが自動的に検知
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    // 状態の更新はAuthProvider内のonAuthStateChangeが自動的に検知
    router.push('/admin');
  };

  return { ...context, login, logout };
};
