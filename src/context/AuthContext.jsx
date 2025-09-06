'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { supabase } from '@/lib/supabaseClient';

export const AuthContext = createContext();

const getAdminCompany = async (user) => {
  if (!user) return null;
  try {
    const { data, error } = await supabase
      .from('Company')
      .select('id, email, name')
      .eq('email', user.email)
      .single();
    if (error) {
      return null;
    }
    return data;
  } catch (e) {
    console.error('[getAdminCompany] Unexpected error:', e);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        const authUser = session?.user || null;
        setUser(authUser);

        if (authUser) {
          const { data: profile } = await supabase
            .from('User')
            .select('*')
            .eq('email', authUser.email)
            .single();
          setDbUser(profile || null);

          const companyData = await getAdminCompany(authUser);
          setAdmin(companyData);
        } else {
          setDbUser(null);
          setAdmin(null);
        }

        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshDbUser = useCallback(async () => {
    if (user) {
      const { data: profile } = await supabase
        .from('User')
        .select('*')
        .eq('email', user.email)
        .single();
      setDbUser(profile || null);
    }
  }, [user]);

  const signUp = useCallback(async (name, email, password) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Signup did not return a user.');

    const { data: dbData, error: insertError } = await supabase
      .from('User')
      .insert({ name, email, password: '' })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    setUser(authData.user);
    setDbUser(dbData);
  }, []);

  const value = useMemo(
    () => ({ user, dbUser, admin, loading, refreshDbUser, signUp }),
    [user, dbUser, admin, loading, refreshDbUser, signUp],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
