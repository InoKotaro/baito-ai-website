'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabaseClient';

export default function ApplyButton({ jobId }) {
  const router = useRouter();
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state

  // 応募済みかどうかをチェック
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsLoggedIn(false); // Set logged in status
          setIsApplied(false);
          return;
        }

        setIsLoggedIn(true); // Set logged in status

        // UserテーブルからユーザーIDを取得
        const { data: dbUser } = await supabase
          .from('User')
          .select('id')
          .eq('email', user.email)
          .single();

        if (dbUser) {
          // JobApplicationテーブルで応募済みかチェック
          try {
            const { data: application, error: appError } = await supabase
              .from('JobApplication')
              .select('id')
              .eq('userid', dbUser.id)
              .eq('jobid', jobId)
              .single();

            if (appError) {
              if (appError.code === 'PGRST116') {
                setIsApplied(false);
              } else {
                console.error('応募状況確認エラー:', appError);
                setIsApplied(false);
              }
            } else {
              setIsApplied(true);
            }
          } catch (error) {
            console.error('応募状況確認エラー:', error);
            setIsApplied(false);
          }
        }
      } catch (error) {
        console.error('応募状況確認エラー:', error);
        setIsApplied(false);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkApplicationStatus();
  }, [jobId]);

  const handleApplyClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isApplied) {
      return;
    }

    router.push(`/apply/${jobId}`);
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="cursor-not-allowed whitespace-nowrap rounded-lg bg-gray-400 px-8 py-4 font-bold text-white"
      >
        読み込み中
      </button>
    );
  }

  // New render logic
  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="whitespace-nowrap rounded-lg bg-orange-500 px-8 py-4 font-bold text-white transition-colors hover:bg-orange-600"
      >
        ログインして応募
      </Link>
    );
  }

  if (isApplied) {
    return (
      <button
        disabled
        className="cursor-not-allowed whitespace-nowrap rounded-lg bg-green-500 px-8 py-4 font-bold text-white"
      >
        応募済み
      </button>
    );
  }

  return (
    <button
      onClick={handleApplyClick}
      className="whitespace-nowrap rounded-lg bg-orange-500 px-8 py-4 font-bold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
    >
      応募する
    </button>
  );
}