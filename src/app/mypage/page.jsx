'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient'; // supabase is needed for handleDeleteAccount
import { updateUserName } from '@/lib/updateUser';

export default function MyPage() {
  const PROTECTED_EMAILS = [
    'tester@example.com',
    'demouser@example.com',
    'demo@example.com',
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [name, setName] = useState('');
  const [deleteBusy, setDeleteBusy] = useState(false);
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');

  const { user, loading, dbUser, refreshDbUser } = useAuth();

  useEffect(() => {
    if (loading) return; // Wait for loading to finish

    if (!user) {
      router.push('/login');
    } else {
      // Set name from the best available source
      setName(dbUser?.name || user?.user_metadata?.full_name || '');
    }
  }, [user, dbUser, loading, router]);

  const handleUpdateNameClick = async () => {
    // PROTECTED_EMAILSに含まれるメールアドレスのユーザーは名前変更できないようにする
    if (PROTECTED_EMAILS.includes(user?.email)) {
      setError('このアカウントの名前は変更できません。');
      return;
    }

    if (dbUser) {
      setBusy(true);
      setError('');
      setInfo('');
      try {
        await updateUserName(dbUser.id, name);
        setInfo('名前を更新しました。');
        await refreshDbUser(); // Manually refresh the context data
      } catch (e) {
        setError(e.message);
      } finally {
        setBusy(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!dbUser) return;
    if (PROTECTED_EMAILS.includes(user?.email)) {
      alert('このアカウントは削除できません。');
      return;
    }
    if (!confirm('本当にアカウントを削除しますか？この操作は取り消せません。'))
      return;
    
    setDeleteBusy(true);
    try {
      const authUserId = user?.id;
      if (!authUserId) throw new Error("User not found.");

      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ authUserId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'アカウントの削除に失敗しました。');
      }

      await supabase.auth.signOut();
      router.replace('/login');

    } catch (e) {
      console.error('Delete account error:', e);
      setError(e.message);
      setDeleteBusy(false);
    }
  };

  return (
    <div
      className={`flex min-h-screen flex-col bg-orange-50 text-gray-700 ${
        isMenuOpen ? 'h-screen overflow-hidden md:h-auto md:overflow-auto' : ''
      }`}
    >
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main className="mx-auto mt-8 w-full max-w-4xl flex-grow px-4">
        <h1 className="mb-6 text-3xl font-bold text-blue-800">マイページ</h1>
        {loading ? (
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            読み込み中
          </div>
        ) : user ? (
          <div className="space-y-6">
            {(info || error) && (
              <div
                className={`rounded-md p-4 ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}
              >
                {error || info}
              </div>
            )}

            <section className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-blue-800">
                プロフィール
              </h2>
              <label className="mb-2 block text-sm text-gray-600">名前</label>
              <input
                type="text"
                className="mb-4 w-full rounded border px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="お名前"
                disabled={PROTECTED_EMAILS.includes(user?.email)}
              />
              <div className="flex justify-center">
                <button
                  onClick={handleUpdateNameClick}
                  disabled={busy || (dbUser && name === dbUser.name) || PROTECTED_EMAILS.includes(user?.email)}
                  className={`rounded bg-orange-500 px-6 py-2 font-bold text-white ${
                    busy || (dbUser && name === dbUser.name) || PROTECTED_EMAILS.includes(user?.email)
                      ? 'cursor-not-allowed opacity-60'
                      : 'hover:bg-orange-600'
                  }`}
                >
                  {busy ? '保存中' : '保存'}
                </button>
              </div>
            </section>

            <section className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-red-700">
                アカウント削除
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                応募データを含むアカウント情報を削除します。
                <br />
                （デモ用アカウントを除く）
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteBusy || PROTECTED_EMAILS.includes(user?.email)}
                  className={`rounded bg-red-600 px-6 py-2 font-bold text-white ${
                    deleteBusy || PROTECTED_EMAILS.includes(user?.email)
                      ? 'cursor-not-allowed opacity-60'
                      : 'hover:bg-red-700'
                  }`}
                >
                  {deleteBusy ? '削除中...' : 'アカウントを削除'}
                </button>
              </div>
            </section>
          </div>
        ) : null}{' '}
      </main>
      <Footer />
    </div>
  );
}