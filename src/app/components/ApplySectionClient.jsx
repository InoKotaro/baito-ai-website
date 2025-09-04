'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import ApplyButton from '@/app/components/ApplyButton';
import { supabase } from '@/lib/supabaseClient';

export default function ApplySectionClient({ jobId }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsLoggedIn(!!user);
      } catch (error) {
        console.error('ログイン状態確認エラー:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-lg text-gray-600">状態確認中...</p>
      </div>
    );
  }

  if (isLoggedIn) {
    return <ApplyButton jobId={jobId} />;
  } else {
    return (
      <Link
        href="/login"
        className="whitespace-nowrap rounded-lg bg-orange-500 px-6 py-4 text-center font-bold text-white transition-colors hover:bg-orange-600"
      >
        ログインして応募
      </Link>
    );
  }
}
